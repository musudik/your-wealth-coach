import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Copy, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { QRCodeCanvas } from 'qrcode.react';
import { getDatabase, ref, set, get } from 'firebase/database';
import { auth } from '@/lib/firebase';

interface ClientFormsModalProps {
  clientId: string;
  clientName: string;
  onClose: () => void;
}

const formTypes = [
  { id: "self-disclosure", name: "Self Disclosure" },
  { id: "tax-return", name: "Tax Return" },
  { id: "real-estate", name: "Real Estate" },
  { id: "electricity", name: "Electricity" }
];

export function ClientFormsModal({ clientId, clientName, onClose }: ClientFormsModalProps) {
  const [forms, setForms] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState<string | null>(null);

  useEffect(() => {
    generateFormLinks();
  }, [clientId]);

  const generateFormLinks = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const db = getDatabase();
      const formsRef = ref(db, `partners/${user.uid}/clients/${clientId}/formLinks`);
      
      // Check if forms already exist
      const snapshot = await get(formsRef);
      if (snapshot.exists()) {
        setForms(snapshot.val());
      } else {
        // Generate new form links
        const newForms: Record<string, string> = {};
        for (const type of formTypes) {
          const formId = `${clientId}-${type.id}-${Date.now()}`;
          // Update URL format to include partner and client IDs
          newForms[type.id] = `${window.location.origin}/form/${type.id}?client=${clientId}&partner=${user.uid}&form=${formId}`;
        }
        
        // Save to Firebase
        await set(formsRef, newForms);
        setForms(newForms);
      }
    } catch (error) {
      console.error('Error generating form links:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate form links',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Link copied',
      description: 'Form link has been copied to clipboard',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-auto max-h-[90vh]"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-600">
              Form Links for {clientName}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:text-orange-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading form links...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formTypes.map((type) => (
                <Card key={type.id} className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-600">{type.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={forms[type.id] || ''}
                        readOnly
                        className="flex-1 p-2 text-sm bg-gray-50 rounded border"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(forms[type.id])}
                        className="hover:text-orange-500"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowQR(showQR === type.id ? null : type.id)}
                        className="hover:text-orange-500"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {showQR === type.id && (
                      <div className="flex justify-center p-4 bg-white rounded-lg">
                        <QRCodeCanvas value={forms[type.id]} size={128} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 