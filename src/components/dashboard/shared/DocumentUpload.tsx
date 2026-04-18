import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, FileText, Shield, Camera, Award, CheckCircle, 
  Clock, AlertCircle, Eye, Trash2, RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentUploadProps {
  walkerId: string;
  onDocumentUploaded?: () => void;
}

const DOCUMENT_TYPES = [
  { 
    type: 'id_card', 
    label: "Carte d'identité", 
    description: "Recto/verso de votre CNI ou passeport",
    required: true, 
    icon: FileText,
    acceptedFormats: "image/jpeg,image/png,application/pdf",
    maxSize: 5 // MB
  },
  { 
    type: 'criminal_record', 
    label: 'Casier judiciaire (B3)', 
    description: "Extrait datant de moins de 3 mois",
    required: true, 
    icon: Shield,
    acceptedFormats: "application/pdf,image/jpeg,image/png",
    maxSize: 5
  },
  { 
    type: 'insurance', 
    label: 'Assurance RC Pro', 
    description: "Attestation en cours de validité",
    required: true, 
    icon: Award,
    acceptedFormats: "application/pdf,image/jpeg,image/png",
    maxSize: 5
  },
  { 
    type: 'photo', 
    label: 'Photo de profil', 
    description: "Photo professionnelle de vous",
    required: false, 
    icon: Camera,
    acceptedFormats: "image/jpeg,image/png,image/webp",
    maxSize: 2
  },
];

interface DocumentStatus {
  type: string;
  status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
  file_url?: string;
  rejection_reason?: string;
  submitted_at?: string;
  verified_at?: string;
}

const DocumentUpload = ({ walkerId, onDocumentUploaded }: DocumentUploadProps) => {
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [initialized, setInitialized] = useState(false);

  // Fetch existing documents on mount
  useEffect(() => {
    if (!initialized && walkerId) {
      fetchDocuments();
      setInitialized(true);
    }
  }, [walkerId, initialized]);

  const fetchDocuments = async () => {
    const { data } = await supabase
      .from('walker_documents')
      .select('*')
      .eq('walker_id', walkerId);

    if (data) {
      const statusMap: DocumentStatus[] = DOCUMENT_TYPES.map(docType => {
        const existing = data.find(d => d.document_type === docType.type);
        return {
          type: docType.type,
          status: existing?.verification_status as any || 'not_submitted',
          file_url: existing?.file_url,
          rejection_reason: existing?.rejection_reason,
          submitted_at: existing?.submitted_at,
          verified_at: existing?.verified_at
        };
      });
      setDocuments(statusMap);
    }
  };

  const getDocumentStatus = (type: string): DocumentStatus => {
    return documents.find(d => d.type === type) || { type, status: 'not_submitted' };
  };

  const handleFileSelect = async (docType: typeof DOCUMENT_TYPES[0], file: File) => {
    // Validate file size
    if (file.size > docType.maxSize * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `La taille maximale est de ${docType.maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    setUploading(docType.type);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${walkerId}/${docType.type}_${Date.now()}.${fileExt}`;

      // Simulate progress (Supabase doesn't provide upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('walker-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      // Get the file URL
      const { data: urlData } = supabase.storage
        .from('walker-documents')
        .getPublicUrl(fileName);

      // Check if document record exists
      const { data: existingDoc } = await supabase
        .from('walker_documents')
        .select('id')
        .eq('walker_id', walkerId)
        .eq('document_type', docType.type)
        .maybeSingle();

      if (existingDoc) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('walker_documents')
          .update({
            file_url: urlData.publicUrl,
            verification_status: 'pending',
            submitted_at: new Date().toISOString(),
            rejection_reason: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDoc.id);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('walker_documents')
          .insert({
            walker_id: walkerId,
            document_type: docType.type,
            file_url: urlData.publicUrl,
            verification_status: 'pending',
            submitted_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      setUploadProgress(100);
      
      toast({
        title: "Document téléversé",
        description: "Votre document est en cours de vérification"
      });

      // Refresh documents list
      await fetchDocuments();
      onDocumentUploaded?.();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur de téléversement",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(null);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = async (docType: string) => {
    try {
      const { error } = await supabase
        .from('walker_documents')
        .delete()
        .eq('walker_id', walkerId)
        .eq('document_type', docType);

      if (error) throw error;

      toast({ title: "Document supprimé" });
      await fetchDocuments();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const openPreview = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  const getStatusBadge = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
            <CheckCircle className="h-3 w-3" />
            Vérifié
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
            <Clock className="h-3 w-3" />
            En attente
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 gap-1">
            <AlertCircle className="h-3 w-3" />
            Rejeté
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <Upload className="h-3 w-3" />
            Non soumis
          </Badge>
        );
    }
  };

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const requiredCount = DOCUMENT_TYPES.filter(d => d.required).length;
  const completionPercentage = (verifiedCount / requiredCount) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Progress Overview */}
      <Card className="overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Vérification de votre profil</CardTitle>
                <CardDescription>Soumettez vos documents pour obtenir le badge vérifié</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{verifiedCount}/{requiredCount}</div>
              <p className="text-sm text-muted-foreground">documents vérifiés</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progression</span>
              <span className="font-semibold">{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
          {completionPercentage === 100 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 flex items-center gap-3"
            >
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">Profil vérifié !</p>
                <p className="text-sm text-green-700 dark:text-green-300">Vous pouvez maintenant recevoir des demandes de promenade</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {DOCUMENT_TYPES.map((docType) => {
          const status = getDocumentStatus(docType.type);
          const isUploading = uploading === docType.type;

          return (
            <Card 
              key={docType.type}
              className={`transition-all duration-300 ${
                status.status === 'verified' 
                  ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' 
                  : status.status === 'rejected'
                    ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20'
                    : ''
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    status.status === 'verified'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : status.status === 'rejected'
                        ? 'bg-red-100 dark:bg-red-900/30'
                        : 'bg-muted'
                  }`}>
                    <docType.icon className={`h-7 w-7 ${
                      status.status === 'verified'
                        ? 'text-green-600'
                        : status.status === 'rejected'
                          ? 'text-red-600'
                          : 'text-muted-foreground'
                    }`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{docType.label}</h3>
                          {docType.required && (
                            <Badge variant="outline" className="text-xs text-destructive border-destructive/50">
                              Requis
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{docType.description}</p>
                        
                        {/* Rejection reason */}
                        {status.status === 'rejected' && status.rejection_reason && (
                          <div className="mt-2 p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-sm text-red-700 dark:text-red-300">
                            <strong>Raison:</strong> {status.rejection_reason}
                          </div>
                        )}

                        {/* Upload progress */}
                        <AnimatePresence>
                          {isUploading && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3"
                            >
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Téléversement en cours...
                              </div>
                              <Progress value={uploadProgress} className="h-2" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(status.status)}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-4">
                      <input
                        type="file"
                        ref={el => fileInputRefs.current[docType.type] = el}
                        accept={docType.acceptedFormats}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(docType, file);
                          e.target.value = '';
                        }}
                      />
                      
                      {status.status === 'not_submitted' || status.status === 'rejected' ? (
                        <Button
                          onClick={() => fileInputRefs.current[docType.type]?.click()}
                          disabled={isUploading}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {status.status === 'rejected' ? 'Soumettre à nouveau' : 'Téléverser'}
                        </Button>
                      ) : (
                        <>
                          {status.file_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openPreview(status.file_url!)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Voir
                            </Button>
                          )}
                          {status.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRefs.current[docType.type]?.click()}
                              className="gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              Remplacer
                            </Button>
                          )}
                          {status.status !== 'verified' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(docType.type)}
                              className="gap-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info box */}
      <Card className="bg-muted/50">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Processus de vérification</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Vos documents sont vérifiés par notre équipe sous 24-48h</li>
                <li>Vous recevrez une notification une fois la vérification terminée</li>
                <li>Formats acceptés: PDF, JPG, PNG (max 5MB)</li>
                <li>Vos documents sont stockés de manière sécurisée et confidentiels</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Aperçu du document</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            previewUrl.endsWith('.pdf') ? (
              <iframe 
                src={previewUrl} 
                className="w-full h-[600px] rounded-lg border"
              />
            ) : (
              <img 
                src={previewUrl} 
                alt="Document preview" 
                className="w-full max-h-[600px] object-contain rounded-lg"
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DocumentUpload;
