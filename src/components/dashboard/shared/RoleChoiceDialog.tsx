import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Dog, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface RoleChoiceDialogProps {
  open: boolean;
  onChoice: (role: 'owner' | 'walker') => void;
}

const RoleChoiceDialog: React.FC<RoleChoiceDialogProps> = ({ open, onChoice }) => {
  const roles = [
    {
      type: 'owner' as const,
      icon: Heart,
      title: 'Espace Propriétaire',
      description: 'Gérer mes chiens et réservations',
      bgGradient: 'bg-gradient-to-br from-heart/15 to-heart/5',
      borderColor: 'border-heart/30 hover:border-heart',
      iconBg: 'bg-heart/20',
      iconColor: 'text-heart',
      hoverBg: 'hover:bg-heart/10'
    },
    {
      type: 'walker' as const,
      icon: Dog,
      title: 'Espace Accompagnateur',
      description: 'Voir mes missions et mes revenus',
      bgGradient: 'bg-gradient-to-br from-stat-green/15 to-stat-green/5',
      borderColor: 'border-stat-green/30 hover:border-stat-green',
      iconBg: 'bg-stat-green/20',
      iconColor: 'text-stat-green',
      hoverBg: 'hover:bg-stat-green/10'
    }
  ];

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Dog className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-xl">Quel espace souhaitez-vous ouvrir ?</DialogTitle>
          <DialogDescription>
            Vous avez accès aux deux tableaux de bord. Choisissez votre rôle actif.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 mt-4">
          {roles.map((role) => (
            <motion.button
              key={role.type}
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChoice(role.type)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${role.bgGradient} ${role.borderColor} ${role.hoverBg}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role.iconBg}`}>
                <role.icon className={`h-6 w-6 ${role.iconColor}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{role.title}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
              <CheckCircle className={`h-5 w-5 ${role.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleChoiceDialog;
