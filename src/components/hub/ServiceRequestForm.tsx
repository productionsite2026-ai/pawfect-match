import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Dog, Cat, Rabbit, Calendar, MapPin, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ServiceRequestData) => void;
}

export interface ServiceRequestData {
  pet_name: string;
  pet_type: string;
  service_type: string;
  city: string;
  postal_code: string;
  date_needed: string;
  time_slot: string;
  description: string;
}

const petTypes = [
  { value: "chien", label: "Chien", icon: Dog },
  { value: "chat", label: "Chat", icon: Cat },
  { value: "lapin", label: "Lapin", icon: Rabbit },
  { value: "autre", label: "Autre", icon: Dog },
];

const serviceTypes = [
  { value: "promenade", label: "Promenade" },
  { value: "garde", label: "Garde à domicile" },
  { value: "visite", label: "Visite à domicile" },
  { value: "veterinaire", label: "Accompagnement vétérinaire" },
];

const timeSlots = [
  { value: "matin", label: "Matin (8h-12h)" },
  { value: "apres-midi", label: "Après-midi (12h-18h)" },
  { value: "soir", label: "Soir (18h-21h)" },
  { value: "flexible", label: "Flexible" },
];

export const ServiceRequestForm = ({ isOpen, onClose, onSubmit }: ServiceRequestFormProps) => {
  const [formData, setFormData] = useState<ServiceRequestData>({
    pet_name: "",
    pet_type: "",
    service_type: "",
    city: "",
    postal_code: "",
    date_needed: "",
    time_slot: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.pet_name || !formData.pet_type || !formData.service_type || !formData.city || !formData.description) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Envoyer à Supabase quand la table sera créée
      if (onSubmit) {
        onSubmit(formData);
      }
      
      toast({
        title: "Demande publiée ! 🎉",
        description: "Votre demande est maintenant visible par les prestataires de votre zone.",
      });
      
      // Reset form
      setFormData({
        pet_name: "",
        pet_type: "",
        service_type: "",
        city: "",
        postal_code: "",
        date_needed: "",
        time_slot: "",
        description: "",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-primary" />
            Déposer une demande de service
          </DialogTitle>
          <DialogDescription>
            Décrivez votre besoin et les prestataires disponibles pourront vous contacter.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Pet Info */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-2">
              <Label htmlFor="pet_name">Nom de l'animal *</Label>
              <Input
                id="pet_name"
                placeholder="Max, Minou..."
                value={formData.pet_name}
                onChange={(e) => setFormData({ ...formData, pet_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet_type">Type d'animal *</Label>
              <Select
                value={formData.pet_type}
                onValueChange={(value) => setFormData({ ...formData, pet_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {petTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Service Type */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="service_type">Service recherché *</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) => setFormData({ ...formData, service_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Quel service recherchez-vous ?" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {serviceTypes.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Location */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Ville *
              </Label>
              <Input
                id="city"
                placeholder="Paris, Lyon..."
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Code postal</Label>
              <Input
                id="postal_code"
                placeholder="75015"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              />
            </div>
          </motion.div>

          {/* Date and Time */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-2">
              <Label htmlFor="date_needed" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Date souhaitée
              </Label>
              <Input
                id="date_needed"
                type="date"
                value={formData.date_needed}
                onChange={(e) => setFormData({ ...formData, date_needed: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time_slot" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Créneau horaire
              </Label>
              <Select
                value={formData.time_slot}
                onValueChange={(value) => setFormData({ ...formData, time_slot: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="description">Description de votre besoin *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre besoin en détail : fréquence, durée, particularités de votre animal..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Plus votre description est détaillée, plus les prestataires pourront vous proposer une offre adaptée.
            </p>
          </motion.div>

          {/* Submit */}
          <motion.div 
            className="flex gap-3 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Publication...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Publier ma demande
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequestForm;
