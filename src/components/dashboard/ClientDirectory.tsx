import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format, formatDistance } from "date-fns";
import { firestore } from "../../db-services/firebase";
import { collection, doc, getDoc, getDocs, deleteDoc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { useToast } from "../ui/use-toast";
import { QRCodeSVG } from 'qrcode.react';
import { formTypes } from "./Dashboard";
import { 
  Loader2, 
  Search, 
  Edit, 
  QrCode, 
  FileText, 
  Trash2, 
  X, 
  Copy, 
  Check, 
  FileDown, 
  ClipboardCheck,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  MoreHorizontal
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// Helper function to format form type display
const formatFormType = (type: string) => {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Helper function to get status badge
const getFormStatusBadge = (status: string) => {
  if (status === 'pending') return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Review</Badge>;
  if (status === 'approved') return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
  if (status === 'rejected') return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
  return <Badge variant="outline">{status}</Badge>;
};

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  lastActivity: Date;
}

export function ClientDirectory() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientForms, setClientForms] = useState<Record<string, any>>({});
  const [pendingFormsCount, setPendingFormsCount] = useState<Record<string, number>>({});
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [currentFormUrl, setCurrentFormUrl] = useState('');
  const [formUrlCopied, setFormUrlCopied] = useState(false);
  const history = useHistory();
  const { toast } = useToast();
  
  useEffect(() => {
    let isMounted = true;
    fetchClients();
    
    return () => {
      isMounted = false;
    };
    
    async function fetchClients() {
      try {
        if (!isMounted) return;
        setLoading(true);
        
        const partnerId = "current-partner-id"; // Replace with actual partner ID
        
        const clientsCollection = collection(firestore, "clients");
        const clientsQuery = query(
          clientsCollection,
          where("partnerId", "==", partnerId)
        );
        
        const clientsSnapshot = await getDocs(clientsQuery);
        const clientsList = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastActivity: doc.data().lastActivity?.toDate() || new Date()
        }));
        
        clientsList.sort((a, b) => b.lastActivity - a.lastActivity);
        
        if (isMounted) {
          setClients(clientsList);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        // Use mock data if Firestore fetch fails
        if (isMounted) {
          setClients([
            {
              id: "1",
              name: "John Doe",
              email: "john.doe@example.com",
              phone: "+1 (555) 123-4567",
              status: "active",
              lastActivity: new Date(2023, 9, 15)
            },
            {
              id: "2",
              name: "Jane Smith",
              email: "jane.smith@example.com",
              phone: "+1 (555) 987-6543",
              status: "active",
              lastActivity: new Date(2023, 9, 12)
            },
            {
              id: "3",
              name: "Michael Johnson",
              email: "michael.j@example.com",
              phone: "+1 (555) 456-7890",
              status: "inactive",
              lastActivity: new Date(2023, 8, 28)
            },
            {
              id: "4",
              name: "Sarah Williams",
              email: "sarah.w@example.com",
              phone: "+1 (555) 789-0123",
              status: "active",
              lastActivity: new Date(2023, 9, 10)
            },
            {
              id: "5",
              name: "Robert Brown",
              email: "robert.b@example.com",
              phone: "+1 (555) 234-5678",
              status: "pending",
              lastActivity: new Date(2023, 9, 5)
            }
          ]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
  }, []);
  
  const countAllPendingForms = async (clientsList) => {
    try {
      const pendingCounts = {};
      
      for (const client of clientsList) {
        // Query forms from Firestore
        const formsCollection = collection(firestore, "forms");
        const pendingFormsQuery = query(
          formsCollection,
          where("clientId", "==", client.id),
          where("status", "==", "pending")
        );
        
        const pendingFormsSnapshot = await getDocs(pendingFormsQuery);
        pendingCounts[client.id] = pendingFormsSnapshot.size;
      }
      
      setPendingFormsCount(pendingCounts);
    } catch (error) {
      console.error("Error counting pending forms:", error);
    }
  };
  
  const fetchClientForms = async (clientId) => {
    try {
      // Query forms from Firestore
      const formsCollection = collection(firestore, "forms");
      const formsQuery = query(
        formsCollection,
        where("clientId", "==", clientId)
      );
      
      const formsSnapshot = await getDocs(formsQuery);
      const formsList = formsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Group forms by type
      const formsByType = {};
      formTypes.forEach(type => {
        formsByType[type] = formsList.filter(form => form.formType === type);
      });
      
      setClientForms({
        ...clientForms,
        [clientId]: formsByType
      });
      
      return formsByType;
    } catch (error) {
      console.error("Error fetching client forms:", error);
      toast({
        title: "Error",
        description: "Failed to load forms. Please try again.",
        variant: "destructive",
      });
      return {};
    }
  };
  
  const handleReviewForms = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client);
    
    // Fetch forms for this client if not already loaded
    if (!clientForms[clientId]) {
      fetchClientForms(clientId);
    }
  };
  
  const handleDownloadPDF = (form) => {
    // Implement PDF download logic
    toast({
      title: "Download Started",
      description: `Downloading ${formatFormType(form.formType)} form.`,
    });
  };
  
  const handleApproveForm = async (clientId, formType, formId) => {
    try {
      // Update form status in Firestore
      const formRef = doc(firestore, "forms", formId);
      await updateDoc(formRef, {
        status: "approved",
        updatedAt: new Date()
      });
      
      // Update local state
      const updatedForms = { ...clientForms };
      const formIndex = updatedForms[clientId][formType].findIndex(f => f.id === formId);
      
      if (formIndex !== -1) {
        updatedForms[clientId][formType][formIndex].status = "approved";
        updatedForms[clientId][formType][formIndex].updatedAt = new Date();
        setClientForms(updatedForms);
      }
      
      // Update pending forms count
      const updatedPendingCounts = { ...pendingFormsCount };
      if (updatedPendingCounts[clientId] > 0) {
        updatedPendingCounts[clientId]--;
      }
      setPendingFormsCount(updatedPendingCounts);
      
      toast({
        title: "Form Approved",
        description: `The ${formatFormType(formType)} form has been approved.`,
      });
    } catch (error) {
      console.error("Error approving form:", error);
      toast({
        title: "Error",
        description: "Failed to approve form. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteForm = async (clientId, formType, formId) => {
    try {
      // Delete form from Firestore
      await deleteDoc(doc(firestore, "forms", formId));
      
      // Update local state
      const updatedForms = { ...clientForms };
      updatedForms[clientId][formType] = updatedForms[clientId][formType].filter(f => f.id !== formId);
      setClientForms(updatedForms);
      
      // Update pending forms count if the form was pending
      const form = clientForms[clientId][formType].find(f => f.id === formId);
      if (form && form.status === "pending") {
        const updatedPendingCounts = { ...pendingFormsCount };
        if (updatedPendingCounts[clientId] > 0) {
          updatedPendingCounts[clientId]--;
        }
        setPendingFormsCount(updatedPendingCounts);
      }
      
      toast({
        title: "Form Deleted",
        description: `The ${formatFormType(formType)} form has been deleted.`,
      });
    } catch (error) {
      console.error("Error deleting form:", error);
      toast({
        title: "Error",
        description: "Failed to delete form. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getFormUrl = (clientId, formType) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/forms/${formType}?clientId=${clientId}`;
  };
  
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setFormUrlCopied(true);
    setTimeout(() => setFormUrlCopied(false), 2000);
  };
  
  const handleEditClient = (clientId) => {
    history.push(`/clients/${clientId}/edit`);
  };
  
  const handleDeleteClient = async (clientId) => {
    try {
      // Delete client from Firestore
      await deleteDoc(doc(firestore, "clients", clientId));
      
      // Update local state
      setClients(clients.filter(client => client.id !== clientId));
      
      toast({
        title: "Client Deleted",
        description: "The client has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    const fullName = `${client.name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           client.phone.includes(searchQuery);
  });
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: 'rgba(0, 208, 132, 0.1)',
          text: '#00d084'
        };
      case 'inactive':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          text: '#ef4444'
        };
      case 'pending':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          text: '#f59e0b'
        };
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.1)',
          text: '#6b7280'
        };
    }
  };

  return (
    <div>
      <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle className="text-xl">Client Directory</CardTitle>
              <CardDescription>Manage your clients and their forms</CardDescription>
            </div>
            <div className="mt-2 md:mt-0 flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search clients..."
                  className="pl-8 w-full md:w-auto"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => history.push('/clients/new/edit')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div style={{ 
                display: 'inline-block',
                width: '2rem',
                height: '2rem',
                border: '3px solid #e5e7eb',
                borderTopColor: '#003366',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No clients found</p>
              <Button 
                onClick={() => history.push('/clients/new/edit')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Your First Client
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => {
                const statusStyle = getStatusColor(client.status);
                
                return (
                  <div
                    key={client.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={client.avatarUrl} alt={`${client.name}`} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {client.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-gray-900">{client.name}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1">
                              {client.email && (
                                <span className="flex items-center">
                                  <Mail className="h-3.5 w-3.5 mr-1" />
                                  {client.email}
                                </span>
                              )}
                              {client.phone && (
                                <span className="flex items-center sm:ml-4 mt-1 sm:mt-0">
                                  <Phone className="h-3.5 w-3.5 mr-1" />
                                  {client.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex mt-4 sm:mt-0 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-amber-600 border-amber-200 hover:bg-amber-50"
                            onClick={() => handleEditClient(client.id)}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1.5" />
                            Edit
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <QrCode className="h-3.5 w-3.5 mr-1.5" />
                                Forms
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Form Links for {client.name}</DialogTitle>
                                <DialogDescription>
                                  Scan these QR codes or copy the links to access forms for this client.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                                {formTypes.map((formType) => {
                                  const url = getFormUrl(client.id, formType);
                                  return (
                                    <div key={formType} className="flex flex-col items-center p-3 border rounded-lg">
                                      <p className="font-medium mb-2 text-center capitalize">{formType.replace('-', ' ')}</p>
                                      <div className="bg-white p-2 rounded-lg mb-2">
                                        <QRCodeSVG value={url} size={120} />
                                      </div>
                                      <div className="w-full">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="w-full text-xs"
                                          onClick={() => copyToClipboard(url)}
                                        >
                                          {formUrlCopied === url ? (
                                            <>
                                              <Check className="h-3 w-3 mr-1" />
                                              Copied!
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="h-3 w-3 mr-1" />
                                              Copy URL
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <DialogClose asChild>
                                <Button variant="outline" className="mt-2">Close</Button>
                              </DialogClose>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleReviewForms(client.id)}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            Review
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Client</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {client.name}? 
                                  This action cannot be undone and all client data will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                    
                    {/* Forms Review Section */}
                    {selectedClient === client && (
                      <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium text-gray-900">
                            Forms Submitted by {client.name}
                          </h4>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedClient(null)}
                            className="text-gray-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {clientForms[client.id] && Object.keys(clientForms[client.id]).length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Form Type</TableHead>
                                  <TableHead>Submitted</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(clientForms[client.id]).map(([formType, forms]) => (
                                  <TableRow key={`${formType}-forms`}>
                                    <TableCell className="font-medium">
                                      {formatFormType(formType)}
                                    </TableCell>
                                    <TableCell>
                                      {forms.length > 0 && (
                                        <div className="text-sm text-gray-500">
                                          {format(new Date(forms[0].createdAt), 'MMM d, yyyy')}
                                          <div className="text-xs">
                                            {formatDistance(new Date(forms[0].createdAt), new Date(), { addSuffix: true })}
                                          </div>
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {getFormStatusBadge(forms[0]?.status || 'pending')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end space-x-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                          onClick={() => handleDownloadPDF(forms[0])}
                                        >
                                          <FileDown className="h-3.5 w-3.5" />
                                        </Button>
                                        
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 border-green-200 hover:bg-green-50"
                                          onClick={() => handleApproveForm(client.id, formType, forms[0].id)}
                                          disabled={forms[0]?.status === "approved"}
                                        >
                                          <ClipboardCheck className="h-3.5 w-3.5" />
                                        </Button>
                                        
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 border-red-200 hover:bg-red-50"
                                          onClick={() => handleDeleteForm(client.id, formType, forms[0].id)}
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No forms submitted yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 