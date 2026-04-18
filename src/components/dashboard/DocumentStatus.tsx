import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, Clock, XCircle, Upload, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Document {
  type: string;
  label: string;
  status: 'approved' | 'pending' | 'rejected' | 'missing';
  expiresAt?: string;
}

interface DocumentStatusProps {
  documents: Document[];
  onUpload?: (type: string) => void;
  verificationProgress: number;
}

const statusConfig = {
  approved: {
    icon: CheckCircle,
    label: 'Vérifié',
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/30'
  },
  pending: {
    icon: Clock,
    label: 'En attente',
    color: 'text-amber-600',
    bg: 'bg-amber-100 dark:bg-amber-900/30'
  },
  rejected: {
    icon: XCircle,
    label: 'Refusé',
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/30'
  },
  missing: {
    icon: Upload,
    label: 'Non soumis',
    color: 'text-muted-foreground',
    bg: 'bg-muted'
  }
};

export const DocumentStatus = ({
  documents,
  onUpload,
  verificationProgress
}: DocumentStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Documents requis
            </CardTitle>
            <CardDescription>Statut de vérification de votre profil</CardDescription>
          </div>
          {verificationProgress < 100 && (
            <div className="flex items-center gap-2">
              <Progress value={verificationProgress} className="w-16 h-2" />
              <span className="text-sm font-bold text-amber-600">{verificationProgress}%</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc, index) => {
            const config = statusConfig[doc.status];
            const StatusIcon = config.icon;
            
            return (
              <motion.div
                key={doc.type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <p className="font-medium">{doc.label}</p>
                    {doc.expiresAt && doc.status === 'approved' && (
                      <p className="text-xs text-muted-foreground">
                        Expire le {new Date(doc.expiresAt).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
                
                {doc.status === 'missing' || doc.status === 'rejected' ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onUpload?.(doc.type)}
                    className="gap-1"
                  >
                    <Upload className="h-3 w-3" />
                    Soumettre
                  </Button>
                ) : (
                  <Badge 
                    variant={doc.status === 'approved' ? 'default' : 'secondary'}
                    className={doc.status === 'approved' ? 'bg-green-600' : ''}
                  >
                    {config.label}
                  </Badge>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {verificationProgress < 100 && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Conseil :</strong> Un profil 100% vérifié reçoit en moyenne 3x plus de demandes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentStatus;
