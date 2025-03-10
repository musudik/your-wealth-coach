import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Check,
  Copy,
  Edit,
  FileText,
  Mail,
  QrCode,
  Search,
  Trash2,
  UserPlus
} from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { THEME } from "../../config";
import { ClientService } from "../../db-services/clientService";
import { firestore } from "../../db-services/firebase";
import { Client } from "../../types/types";
import { useToast } from "../ui/use-toast";

// Import language data

export default function ClientDirectory() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingFormsCount, setPendingFormsCount] = useState<Record<string, number>>({});
  const history = useHistory();
  const { toast } = useToast();
  const auth = getAuth();
  const clientService = new ClientService();
  
  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true);
  
  // Add these new states
  const [expandedClient, setExpandedClient] = useState(null);
  const [loadingForms, setLoadingForms] = useState({});
  const [clientForms, setClientForms] = useState({});
  const [copiedUrl, setCopiedUrl] = useState('');
  const [expandedQRCodes, setExpandedQRCodes] = useState<string | null>(null);
  
  useEffect(() => {
    // Set isMounted to true when the component mounts
    isMountedRef.current = true;
    
    // Fetch clients when the component mounts
      fetchClients();
    
    // Clean up function to set isMounted to false when the component unmounts
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  const fetchClients = async () => {
    try {
      if (!isMountedRef.current) return;
      setLoading(true);
      
      // Get the current user's ID as the partner ID
      const partnerId = auth.currentUser?.uid;
      
      if (!partnerId) {
        console.error("No partner ID available");
        if (isMountedRef.current) {
          setLoading(false);
        }
        return;
      }
      
      // Use ClientService to get all clients for the current partner
      const clientsList = await clientService.getClientsByPartnerId(partnerId);
      
      if (isMountedRef.current) {
        // Sort clients by last updated date if available
        clientsList.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return dateB - dateA;
        });
        
        setClients(clientsList);
        
        // Count pending forms for each client
        countAllPendingForms(clientsList);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      if (isMountedRef.current) {
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
        setLoading(false);
      }
    } finally {
      if (isMountedRef.current) {
      setLoading(false);
      }
    }
  };
  
  const countAllPendingForms = async (clientsList:Client[]) => {
    try {
      if (!isMountedRef.current) return;
    
      const pendingCounts = {};
      
      for (const client of clientsList) {
        // Skip if component unmounted during processing
        if (!isMountedRef.current) return;
        
        // Query forms from Firestore
        const formsCollection = collection(firestore, "forms");
        const pendingFormsQuery = query(
          formsCollection,
          where("clientId", "==", client.clientId),
          where("status", "==", "pending")
        );
        
        const pendingFormsSnapshot = await getDocs(pendingFormsQuery);
        pendingCounts[client.clientId] = pendingFormsSnapshot.size;
      }
      
      if (isMountedRef.current) {
        setPendingFormsCount(pendingCounts);
      }
    } catch (error) {
      console.error("Error counting pending forms:", error);
    }
  };
  
  const handleAddClient = () => {
    history.push('/clients/new/edit');
  };
  
  const handleEditClient = (clientId:string) => {
    history.push(`/clients/${clientId}/edit`);
  };
  
  const handleReviewForms = async (clientId:string) => {
    if (expandedClient === clientId) {
      setExpandedClient(null);
    } else {
      setExpandedClient(clientId);
      await fetchClientForms(clientId);
    }
  };
  
  const fetchClientForms = async (clientId: string) => {
    try {
      setLoadingForms(prev => ({ ...prev, [clientId]: true }));
      
      const formsCollection = collection(firestore, "forms");
      const formsQuery = query(
        formsCollection,
        where("clientId", "==", clientId)
      );
      
      const formsSnapshot = await getDocs(formsQuery);
      const processedForms = formsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
        
        setClientForms(prev => ({ ...prev, [clientId]: processedForms }));
    } catch (error) {
      console.error('Error fetching client forms:', error);
      toast({
        title: "Error",
        description: "Failed to load client forms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingForms(prev => ({ ...prev, [clientId]: false }));
    }
  };
  
  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        const partnerId = auth.currentUser?.uid;
        
        if (!partnerId) {
          throw new Error("No partner ID available");
        }

        // First verify that this client belongs to the current partner
        const client = clients.find(c => c.clientId === clientId);
        if (!client || client.partnerId !== partnerId) {
          throw new Error("Unauthorized to delete this client");
        }

        await clientService.deleteClient(clientId, partnerId); // Pass partnerId to the service
        
        setClients(prevClients => prevClients.filter(client => client.clientId !== clientId));
      
      toast({
          title: "Success",
          description: "Client deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
    }
  };
  
  // Add helper function for form URLs
  const getFormUrl = (clientId:string, formType:string) => {
    const partnerId = auth.currentUser?.uid;
    const origin = window.location.origin;
    return `${origin}/form/${formType}?client=${clientId}&partner=${partnerId}`;
  };
  
  // Add clipboard function
  const copyToClipboard = (url:string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;
    
    const fullName = `${client.personalInformation?.firstName || ''} ${client.personalInformation?.lastName || ''}`.trim().toLowerCase();
    const email = (client.contactInformation?.email || '').toLowerCase();
    const phone = client.contactInformation?.phone || '';
    
    return fullName.includes(searchQuery.toLowerCase()) || 
           email.includes(searchQuery.toLowerCase()) ||
           phone.includes(searchQuery);
  });
  
  // Helper function to get client name
  const getClientName = (client: Client): string => {
    return `${client.personalInformation?.firstName || ''} ${client.personalInformation?.lastName || ''}`.trim();
  };

  // Helper function to get client initials
  const getClientInitials = (client: Client): string => {
    const firstName = client.personalInformation?.firstName || '';
    const lastName = client.personalInformation?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  // Modify the FormsDialog component to be a dropdown section
  const QRCodeSection = ({ client }) => {
    const formTypes = ['self-disclosure', 'tax-return', 'real-estate', 'electricity'];
  
  return (
      <div style={{
        borderTop: '1px solid #e5e7eb',
        padding: '1rem',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: '#111827'
          }}>
            Form Links for {getClientName(client)}
          </h4>
          <button
            onClick={() => setExpandedQRCodes(null)}
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ✕
          </button>
                      </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          width: '100%'
        }}>
                              {formTypes.map((formType) => {
            const url = getFormUrl(client.clientId, formType);
                                return (
              <div key={formType} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}>
                <p style={{
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  textTransform: 'capitalize'
                }}>
                  {formType.replace('-', ' ')}
                </p>
                <div style={{
                  background: 'white',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                                      <QRCodeSVG value={url} size={120} />
                                    </div>
                <button
                                        onClick={() => copyToClipboard(url)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                                      >
                                        {copiedUrl === url ? (
                                          <>
                      <Check size={14} style={{ marginRight: '0.25rem' }} />
                                            Copied!
                                          </>
                                        ) : (
                                          <>
                      <Copy size={14} style={{ marginRight: '0.25rem' }} />
                                            Copy URL
                                          </>
                                        )}
                </button>
                                  </div>
                                );
                              })}
                            </div>
      </div>
    );
  };
  
  return (
    <div style={{ 
      width: '70%', 
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        color: '#1e293b',
        marginBottom: '1.5rem'
      }}>
        Client Directory
      </h2>
      
      <div style={{
        width: '100%',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden'
      }}>
        {/* Search and Add Client Section */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            gap: '1rem',
            width: '100%'
          }}>
            {/* Search Input */}
            <div style={{ 
              position: 'relative',
              width: window.innerWidth < 640 ? '100%' : '60%'
            }}>
              <div style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }}>
                <Search size={18} />
            </div>
              <input 
                  type="text"
                style={{ 
                  width: '70%',
                  height: '40px',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.95rem',
                  backgroundColor: '#f9fafb',
                  outline: 'none'
                }} 
                  placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

            {/* Add Client Button */}
            <button 
              onClick={handleAddClient}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '40px',
                padding: '0 1rem',
                borderRadius: '8px',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                width: window.innerWidth < 640 ? '100%' : 'auto'
              }}
            >
              <UserPlus size={18} style={{ marginRight: '8px' }} />
                Add Client
            </button>
                    </div>
                  </div>
                  
        {/* Content Area */}
        <div style={{ padding: '1rem' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '3rem 0'
            }}>
              <div style={{
                height: '2.5rem',
                width: '2.5rem',
                borderRadius: '50%',
                border: `4px solid ${THEME.PRIMARY}`,
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite'
              }}></div>
                      </div>
          ) : filteredClients.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  background: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '50%',
                  marginBottom: '1rem'
                }}>
                  <UserPlus size={40} style={{ color: '#9ca3af' }} />
                        </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>No clients found</h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '1.5rem',
                  maxWidth: '28rem'
                }}>
                  {searchQuery ? 'Try a different search term or add a new client.' : 'Add your first client to start managing their information and forms.'}
                </p>
                <button 
                  onClick={handleAddClient}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    fontWeight: '500',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Add Client
                </button>
                                        </div>
                                      </div>
                                    ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              width: '100%'
            }}>
              {filteredClients.map((client) => (
                <div
                  key={client.clientId}
                  style={{
                    background: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f3f4f6',
                    width: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {/* Client Info Container */}
                  <div style={{ 
                    padding: '1rem',
                    width: '100%'
                  }}>
                    {/* Client Info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      width: '100%'
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        backgroundColor: '#dbeafe',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        marginRight: '0.75rem',
                        flexShrink: 0
                      }}>
                        {getClientInitials(client)}
                      </div>
                      
                      {/* Client Details */}
                      <div style={{
                        overflow: 'hidden',
                        width: 'calc(100% - 3.25rem)'
                      }}>
                        <h3 style={{
                          fontWeight: '500',
                          color: '#111827',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {getClientName(client)}
                        </h3>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          <Mail size={14} style={{ marginRight: '0.25rem', flexShrink: 0 }} />
                          <span style={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis' 
                          }}>
                            {client.contactInformation?.email || 'No email'}
                          </span>
                      </div>
                    </div>
                  </div>
                  
                    {/* Action Buttons */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: window.innerWidth < 480 ? '1fr 1fr' : 'repeat(4, 1fr)',
                      gap: '0.5rem',
                      width: '100%'
                    }}>
                      {/* Edit Button */}
                      <button 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '2.25rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#d97706',
                          border: '1px solid #fcd34d',
                          background: 'transparent',
                          cursor: 'pointer',
                          padding: '0 0.5rem',
                          width: '70%'
                        }}
                        onClick={() => handleEditClient(client.clientId)}
                      >
                        <Edit size={window.innerWidth < 640 ? 16 : 14} style={{ marginRight: window.innerWidth < 640 ? 0 : '0.375rem' }} />
                        {window.innerWidth >= 640 && <span>Edit</span>}
                      </button>
                      
                      {/* Forms Button */}
                      <button 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '2.25rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          background: 'transparent',
                          cursor: 'pointer',
                          padding: '0 0.5rem',
                          width: '70%'
                        }}
                        onClick={() => setExpandedQRCodes(expandedQRCodes === client.clientId ? null : client.clientId)}
                      >
                        <QrCode size={window.innerWidth < 640 ? 16 : 14} style={{ marginRight: window.innerWidth < 640 ? 0 : '0.375rem' }} />
                        {window.innerWidth >= 640 && <span>Forms</span>}
                      </button>
                      
                      {/* Review Button */}
                      <button 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '2.25rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#16a34a',
                          border: '1px solid #bbf7d0',
                          background: 'transparent',
                          cursor: 'pointer',
                          padding: '0 0.5rem',
                          width: '70%'
                        }}
                        onClick={() => handleReviewForms(client.clientId)}
                      >
                        <FileText size={window.innerWidth < 640 ? 16 : 14} style={{ marginRight: window.innerWidth < 640 ? 0 : '0.375rem' }} />
                        {window.innerWidth >= 640 && <span>Review</span>}
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '2.25rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          background: 'transparent',
                          cursor: 'pointer',
                          padding: '0 0.5rem',
                          width: '70%'
                        }}
                        onClick={() => handleDeleteClient(client.clientId)}
                      >
                        <Trash2 size={window.innerWidth < 640 ? 16 : 14} style={{ marginRight: window.innerWidth < 640 ? 0 : '0.375rem' }} />
                        {window.innerWidth >= 640 && <span>Delete</span>}
                      </button>
                                    </div>
                        </div>

                  {/* QR Code Section */}
                  {expandedQRCodes === client.clientId && (
                    <QRCodeSection client={client} />
                      )}
                    </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
} 