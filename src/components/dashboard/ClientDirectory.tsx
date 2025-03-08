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
      padding: '16px',
      maxWidth: '60%',
      margin: '0 auto'
    }}>
      {/* Header Section */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '16px'
        }}>
          Client Directory
        </h2>

        {/* Search and Add Client Controls */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          gap: '12px',
          width: '100%'
        }}>
          {/* Search Box */}
          <div style={{
            position: 'relative',
            flex: window.innerWidth <= 768 ? '1' : '1',
            minWidth: window.innerWidth <= 768 ? '100%' : '200px'
          }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              width: '20px',
              height: '20px'
            }} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '90%',
                height: '44px',
                paddingLeft: '40px',
                paddingRight: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '16px',
                backgroundColor: '#f9fafb'
              }}
            />
          </div>

          {/* Add Client Button */}
          <button
            onClick={handleAddClient}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '44px',
              padding: '0 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minWidth: window.innerWidth <= 768 ? '100%' : 'auto'
            }}
          >
            <UserPlus size={20} style={{ marginRight: '8px' }} />
            Add Client
          </button>
        </div>
      </div>

      {/* Client List Section */}
      <div style={{
        width: '100%',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        ) : filteredClients.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#6b7280',
              fontSize: '16px'
            }}>
              {searchQuery ? 'No clients found matching your search.' : 'No clients yet. Add your first client to get started.'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            backgroundColor: '#f3f4f6'
          }}>
            {filteredClients.map((client) => (
              <div
                key={client.clientId}
                style={{
                  padding: '16px',
                  backgroundColor: 'white'
                }}
              >
                {/* Client Info Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#dbeafe',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '16px',
                    flexShrink: 0,
                    marginRight: '12px'
                  }}>
                    {getClientInitials(client)}
                  </div>

                  {/* Client Details */}
                  <div style={{
                    flex: '1',
                    minWidth: 0 // Ensures text truncation works
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#111827',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {getClientName(client)}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#6b7280',
                      fontSize: '14px',
                      marginTop: '4px'
                    }}>
                      <Mail size={14} style={{ marginRight: '6px' }} />
                      <span style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {client.contactInformation?.email || 'No email'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth <= 480 ? '1fr 1fr' : 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {/* Action Buttons */}
                  <ActionButton
                    icon={<Edit size={16} />}
                    label="Edit"
                    onClick={() => handleEditClient(client.clientId)}
                    color="#d97706"
                    borderColor="#fcd34d"
                  />
                  <ActionButton
                    icon={<QrCode size={16} />}
                    label="Forms"
                    onClick={() => handleReviewForms(client.clientId)}
                    color="#2563eb"
                    borderColor="#bfdbfe"
                    badge={pendingFormsCount[client.clientId]}
                  />
                  <ActionButton
                    icon={<FileText size={16} />}
                    label="Review"
                    onClick={() => handleReviewForms(client.clientId)}
                    color="#16a34a"
                    borderColor="#bbf7d0"
                  />
                  <ActionButton
                    icon={<Trash2 size={16} />}
                    label="Delete"
                    onClick={() => handleDeleteClient(client.clientId)}
                    color="#dc2626"
                    borderColor="#fecaca"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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

// ActionButton Component
function ActionButton({ icon, label, onClick, color, borderColor, badge }) {
  const showLabel = window.innerWidth > 480;
  
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '36px',
        padding: '0 12px',
        borderRadius: '6px',
        border: `1px solid ${borderColor}`,
        backgroundColor: 'transparent',
        color: color,
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        gap: '6px',
        width: '50%'
      }}
    >
      {icon}
      {showLabel && <span>{label}</span>}
      {badge && badge > 0 && (
        <span style={{
          position: showLabel ? 'static' : 'absolute',
          top: showLabel ? 'auto' : '-6px',
          right: showLabel ? 'auto' : '-6px',
          backgroundColor: '#dbeafe',
          color: '#1d4ed8',
          fontSize: '12px',
          fontWeight: '500',
          padding: '2px 6px',
          borderRadius: '9999px',
          minWidth: '20px',
          textAlign: 'center'
        }}>
          {badge}
        </span>
      )}
    </button>
  );
} 