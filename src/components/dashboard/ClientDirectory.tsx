import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { 
  Mail,
  Search, 
  Trash2,
  UserPlus,
  QrCode, 
  FileText, 
  Edit
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { THEME } from "../../config";
import { ClientService } from "../../db-services/clientService";
import { firestore } from "../../db-services/firebase";
import { Client } from "../../types/types";
import { useToast } from "../ui/use-toast";

// Import language data
import languageData from "../../i18n/language.json";

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
  
  const countAllPendingForms = async (clientsList) => {
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
  
  const handleEditClient = (clientId) => {
    history.push(`/clients/${clientId}/edit`);
  };
  
  const handleReviewForms = (clientId) => {
    history.push(`/clients/${clientId}/forms`);
  };
  
  const handleDeleteClient = async (clientId) => {
    // Show confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete this client?")) {
    try {
        await clientService.deleteClient(clientId);
      
        if (isMountedRef.current) {
          setClients(clients.filter(client => client.clientId !== clientId));
      toast({
            title: "Client Deleted",
        description: "The client has been successfully deleted.",
      });
        }
    } catch (error) {
        console.error("Error deleting client:", error);
        if (isMountedRef.current) {
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
      }
    }
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
                    width: '100%'
                  }}
                >
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
                        onClick={() => handleReviewForms(client.clientId)}
                      >
                        <QrCode size={window.innerWidth < 640 ? 16 : 14} style={{ marginRight: window.innerWidth < 640 ? 0 : '0.375rem' }} />
                        {window.innerWidth >= 640 && (
                          <>
                            <span>Forms</span>
                            {pendingFormsCount[client.clientId] > 0 && (
                              <span style={{
                                marginLeft: '0.375rem',
                                background: '#dbeafe',
                                color: '#1d4ed8',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                padding: '0 0.5rem',
                                borderRadius: '9999px'
                              }}>
                                {pendingFormsCount[client.clientId]}
                              </span>
                            )}
                                          </>
                                        )}
                        {window.innerWidth < 640 && pendingFormsCount[client.clientId] > 0 && (
                          <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {pendingFormsCount[client.clientId]}
                          </span>
                        )}
                      </button>
                      
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