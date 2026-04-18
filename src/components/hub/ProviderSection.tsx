import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search, MessageSquare, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ProviderSectionProps {
  onViewRequests: () => void;
  requestCount?: number;
}

export const ProviderSection = ({ onViewRequests, requestCount = 0 }: ProviderSectionProps) => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Search, text: "Consultez les demandes en temps réel" },
    { icon: MessageSquare, text: "Contactez directement les Propriétaires" },
    { icon: Star, text: "Développez votre clientèle locale" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="h-full border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent hover:shadow-lg transition-shadow">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-secondary/10">
              <Users className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Vous proposez des services pour animaux ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Consultez les demandes publiées par les Propriétaires et répondez 
                aux annonces correspondant à vos disponibilités et à vos services.
              </p>

              <ul className="space-y-3 mb-6">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <benefit.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{benefit.text}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="secondary"
                  size="lg" 
                  className="w-full sm:w-auto"
                  onClick={onViewRequests}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Voir les demandes de Propriétaires
                  {requestCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                      {requestCount}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/walker/register')}
                >
                  Devenir prestataire
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
