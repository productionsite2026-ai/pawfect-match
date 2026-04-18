import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, ArrowRight, Upload, Clock, XCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Document {
  document_type: string;
  verification_status: string | null;
}

interface VerificationBannerProps {
  isVerified: boolean;
  documents: Document[];
  walkerName?: string;
}

const requiredDocs = [
  { type: "id_card", label: "Pièce d'identité" },
  { type: "criminal_record", label: "Casier judiciaire" },
  { type: "insurance", label: "Assurance RC" },
];

export const VerificationBanner = ({ isVerified, documents, walkerName }: VerificationBannerProps) => {
  const navigate = useNavigate();

  const getDocStatus = (docType: string) => {
    const doc = documents.find(d => d.document_type === docType);
    if (!doc) return { status: "missing", icon: Upload, color: "text-muted-foreground", bg: "bg-muted" };
    if (doc.verification_status === "approved") return { status: "approved", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" };
    if (doc.verification_status === "rejected") return { status: "rejected", icon: XCircle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" };
    return { status: "pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" };
  };

  const approvedCount = documents.filter(d => 
    requiredDocs.some(r => r.type === d.document_type) && d.verification_status === "approved"
  ).length;
  
  const progress = Math.round((approvedCount / requiredDocs.length) * 100);

  // Already verified - show success banner
  if (isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-900 mb-6">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Profil vérifié</h3>
                  <Badge className="bg-green-600 text-white gap-1">
                    <CheckCircle className="h-3 w-3" />
                    100%
                  </Badge>
                </div>
                <p className="text-sm text-green-700/80 dark:text-green-300/80">
                  Tous vos documents ont été validés. Vous êtes visible par tous les Propriétaires.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Not verified - show warning banner with document status
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-900 mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left side - Warning info */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    Compte en cours de vérification
                  </h3>
                  <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-300">
                    {progress}%
                  </Badge>
                </div>
                <p className="text-sm text-amber-700/80 dark:text-amber-300/80 mb-3">
                  Complétez votre vérification pour apparaître dans les recherches et recevoir des demandes.
                </p>
                
                {/* Document status icons */}
                <div className="flex flex-wrap gap-2">
                  {requiredDocs.map((doc) => {
                    const status = getDocStatus(doc.type);
                    const Icon = status.icon;
                    return (
                      <motion.div
                        key={doc.type}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Icon className={`h-3.5 w-3.5 ${status.color}`} />
                        <span className={`text-xs font-medium ${status.color}`}>
                          {doc.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right side - Progress and CTA */}
            <div className="flex flex-col items-end gap-3 min-w-[180px]">
              <div className="flex items-center gap-3 w-full">
                <Progress value={progress} className="h-2 flex-1" />
                <span className="text-sm font-bold text-amber-600 min-w-[40px]">{progress}%</span>
              </div>
              <Button 
                size="sm" 
                className="gap-2 bg-amber-600 hover:bg-amber-700"
                onClick={() => navigate('/profile')}
              >
                Compléter mon profil
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VerificationBanner;
