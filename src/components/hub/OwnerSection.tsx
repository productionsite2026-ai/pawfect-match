import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Send, Eye, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface OwnerSectionProps {
  onPostRequest: () => void;
}

export const OwnerSection = ({ onPostRequest }: OwnerSectionProps) => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Send, text: "Publication gratuite et rapide" },
    { icon: Eye, text: "Visible par tous les prestataires" },
    { icon: CheckCircle, text: "Réponses sous 24h en moyenne" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <PlusCircle className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Vous êtes Propriétaire d'un animal ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Déposez une demande de service sans choisir de prestataire à l'avance.
                Votre annonce sera visible par les prestataires disponibles près de chez vous, 
                qui pourront vous contacter directement.
              </p>

              <ul className="space-y-3 mb-6">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <benefit.icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{benefit.text}</span>
                  </li>
                ))}
              </ul>

              <Button 
                size="lg" 
                className="w-full md:w-auto shadow-lg"
                onClick={onPostRequest}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Déposer une demande de service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
