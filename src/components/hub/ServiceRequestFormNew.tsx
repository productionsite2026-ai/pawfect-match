import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, Heart, Search, CalendarDays, Clock, MessageSquare, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceRequestFormNewProps {
  onSubmit: (data: any) => void;
}

export const ServiceRequestFormNew = ({ onSubmit }: ServiceRequestFormNewProps) => {
  const navigate = useNavigate();
  const [animalType, setAnimalType] = useState("chien");
  const [selectedService, setSelectedService] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [dateNeeded, setDateNeeded] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [description, setDescription] = useState("");
  const [petName, setPetName] = useState("");

  const serviceOptions = [
    { id: "promenade", label: "Promenade de chien" },
    { id: "garde", label: "Garde à domicile" },
    { id: "visite", label: "Visite à domicile" },
    { id: "dog-sitting", label: "Garde à votre domicile" },
    { id: "pet-sitting", label: "Tout animal" },
    { id: "marche-reguliere", label: "Marche régulière" },
  ];

  const timeSlotOptions = [
    { id: "matin", label: "Matin (8h-12h)" },
    { id: "apres-midi", label: "Après-midi (12h-18h)" },
    { id: "soir", label: "Soir (18h-22h)" },
    { id: "journee-complete", label: "Journée complète" },
    { id: "flexible", label: "Flexible" },
  ];

  const handlePostRequest = () => {
    onSubmit({
      animalType,
      selectedService,
      city,
      postalCode,
      dateNeeded,
      timeSlot,
      description,
      petName,
    });
  };

  return (
    <div className="bg-card shadow-card rounded-2xl p-6 md:p-8 border border-border">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Déposer une demande de service
      </h2>

      {/* Type d'animal */}
      <div className="mb-6">
        <Label className="text-base font-medium mb-3 block">Type d'animal</Label>
        <RadioGroup 
          value={animalType} 
          onValueChange={setAnimalType}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="chien" id="chien" className="border-primary text-primary" />
            <Label htmlFor="chien" className="flex items-center gap-2 cursor-pointer text-base">
              <span className="text-xl">🐕</span> Chien
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="chat" id="chat" className="border-primary text-primary" />
            <Label htmlFor="chat" className="flex items-center gap-2 cursor-pointer text-base">
              <span className="text-xl">🐱</span> Chat
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Nom de l'animal */}
      <div className="mb-6">
        <Label htmlFor="petName" className="text-base font-medium mb-3 block">Nom de votre animal</Label>
        <Input 
          id="petName"
          type="text" 
          placeholder="Ex: Max, Luna..."
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          className="h-12 text-base rounded-xl border-2"
        />
      </div>

      {/* Service */}
      <div className="mb-6">
        <Label htmlFor="service" className="text-base font-medium mb-3 block">Service recherché</Label>
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="h-12 text-base rounded-xl border-2">
            <SelectValue placeholder="Sélectionnez un service" />
          </SelectTrigger>
          <SelectContent>
            {serviceOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ville et Code Postal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="city" className="text-base font-medium mb-3 block">Ville</Label>
          <Input 
            id="city"
            type="text" 
            placeholder="Ex: Paris"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-12 text-base rounded-xl border-2"
          />
        </div>
        <div>
          <Label htmlFor="postalCode" className="text-base font-medium mb-3 block">Code Postal</Label>
          <Input 
            id="postalCode"
            type="text" 
            placeholder="Ex: 75001"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="h-12 text-base rounded-xl border-2"
          />
        </div>
      </div>

      {/* Date et Heure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="dateNeeded" className="text-base font-medium mb-3 block">Date souhaitée</Label>
          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input 
              id="dateNeeded"
              type="text" 
              placeholder="Ex: 15/01/2025 ou Dès que possible"
              value={dateNeeded}
              onChange={(e) => setDateNeeded(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl border-2"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="timeSlot" className="text-base font-medium mb-3 block">Plage horaire</Label>
          <Select value={timeSlot} onValueChange={setTimeSlot}>
            <SelectTrigger className="h-12 text-base rounded-xl border-2">
              <SelectValue placeholder="Sélectionnez une plage horaire" />
            </SelectTrigger>
            <SelectContent>
              {timeSlotOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <Label htmlFor="description" className="text-base font-medium mb-3 block">Description de votre demande</Label>
        <Textarea 
          id="description"
          placeholder="Décrivez votre besoin (comportement de l'animal, spécificités, etc.)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px] text-base rounded-xl border-2"
        />
      </div>

      {/* Bouton de soumission */}
      <Button 
        className="w-full h-14 text-lg font-semibold rounded-xl"
        onClick={handlePostRequest}
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Déposer ma demande
      </Button>
    </div>
  );
};
