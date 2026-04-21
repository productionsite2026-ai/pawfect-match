import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar, Clock, Dog, MapPin, Shield, Lock, CheckCircle,
  ArrowLeft, ArrowRight, Sparkles, Star, CreditCard, MessageCircle, Key
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ServiceType = Database['public']['Enums']['service_type'];
export type KeyHandoverProtocol = 'in_person' | 'lockbox' | 'neighbor' | 'already_provided';

interface BookingStepsProps {
  walker: any;
  dogs: any[];
  isAuthenticated: boolean;
  onSubmit: (data: BookingData) => Promise<void>;
  onRequireAuth: () => void;
}

interface BookingData {
  service: ServiceType;
  dogId: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
  address?: string;
  keyHandoverProtocol?: KeyHandoverProtocol;
  keyHandoverDetails?: string;
}

const SERVICES_REQUIRING_KEYS: ServiceType[] = ['garde', 'visite', 'pet_sitting' as ServiceType];

const keyProtocolOptions: { value: KeyHandoverProtocol; label: string; description: string; icon: string }[] = [
  { value: 'in_person', label: 'Remise en main propre', description: 'RDV avant la mission pour récupérer les clés', icon: '🤝' },
  { value: 'lockbox', label: 'Boîte à clés sécurisée', description: 'Code à fournir dans les détails', icon: '🔐' },
  { value: 'neighbor', label: 'Voisin / Concierge / Gardien', description: 'Indiquez nom et contact', icon: '👤' },
  { value: 'already_provided', label: 'Double déjà fourni', description: 'L\'Accompagnateur Certifié a déjà une copie', icon: '🔑' },
];

const serviceOptions = [
  { 
    id: 'promenade' as ServiceType, 
    label: 'Promenade', 
    description: 'Balade en extérieur avec photos', 
    icon: '🚶',
    duration: '30min - 2h'
  },
  { 
    id: 'visite' as ServiceType, 
    label: 'Visite à domicile', 
    description: 'Passage chez vous pour repas et câlins', 
    icon: '🏠',
    duration: '30min'
  },
  { 
    id: 'garde' as ServiceType, 
    label: 'Garde', 
    description: 'Hébergement chez le Accompagnateur Certifié', 
    icon: '🛏️',
    duration: 'Nuit'
  },
  { 
    id: 'veterinaire' as ServiceType, 
    label: 'Accompagnement véto', 
    description: 'Transport et présence au RDV', 
    icon: '🏥',
    duration: 'Variable'
  },
];

const durations = [
  { value: 30, label: '30 min', price: 1 },
  { value: 60, label: '1 heure', price: 2 },
  { value: 90, label: '1h30', price: 3 },
  { value: 120, label: '2 heures', price: 4 },
];

export const BookingSteps = ({
  walker,
  dogs,
  isAuthenticated,
  onSubmit,
  onRequireAuth
}: BookingStepsProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookingData>({
    service: 'promenade',
    dogId: '',
    date: '',
    time: '',
    duration: 30,
    notes: '',
    address: '',
    keyHandoverProtocol: undefined,
    keyHandoverDetails: ''
  });

  const calculatePrice = () => {
    const baseRate = walker?.hourly_rate || 15;
    if (formData.service === 'promenade') {
      return Math.round(baseRate * formData.duration / 30);
    }
    return baseRate;
  };

  const handleNext = () => {
    if (step === 3 && !isAuthenticated) {
      onRequireAuth();
      return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.service;
      case 2: {
        const dateOk = !!formData.date && !!formData.time;
        const needsKeys = SERVICES_REQUIRING_KEYS.includes(formData.service);
        const keysOk = !needsKeys || !!formData.keyHandoverProtocol;
        return dateOk && keysOk;
      }
      case 3: return isAuthenticated ? !!formData.dogId : true;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between px-2">
        {[
          { num: 1, label: 'Service' },
          { num: 2, label: 'Date & Heure' },
          { num: 3, label: 'Votre animal' },
          { num: 4, label: 'Confirmation' }
        ].map((s, i, arr) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: step === s.num ? 1.1 : 1,
                  backgroundColor: step >= s.num 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--muted))'
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s.num ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {step > s.num ? <CheckCircle className="h-5 w-5" /> : s.num}
              </motion.div>
              <span className={`text-xs mt-1.5 hidden sm:block ${
                step >= s.num ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}>
                {s.label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                step > s.num ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Choisir le service
                </CardTitle>
                <CardDescription>
                  Quel type de prestation souhaitez-vous ?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={formData.service} 
                  onValueChange={(v) => setFormData({ ...formData, service: v as ServiceType })}
                >
                  <div className="grid gap-3">
                    {serviceOptions.map((service) => (
                      <Label
                        key={service.id}
                        htmlFor={service.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.service === service.id
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={service.id} id={service.id} />
                        <span className="text-2xl">{service.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold">{service.label}</p>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        <Badge variant="secondary">{service.duration}</Badge>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>

                {formData.service === 'promenade' && (
                  <div className="mt-6">
                    <Label className="text-sm font-medium mb-3 block">Durée de la promenade</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {durations.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, duration: d.value })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.duration === d.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <p className="font-medium">{d.label}</p>
                          <p className="text-sm text-primary font-bold">
                            {(walker?.hourly_rate || 15) * d.price / 2}€
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Date et heure
                </CardTitle>
                <CardDescription>
                  Quand souhaitez-vous cette prestation ?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-sm font-medium">Heure *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium">Adresse de prise en charge</Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Adresse pour récupérer votre animal"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Instructions spéciales</Label>
                  <Textarea
                    id="notes"
                    placeholder="Informations importantes (allergies, comportement, code d'entrée...)"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Protocole remise des clés (LOT 8) */}
                {SERVICES_REQUIRING_KEYS.includes(formData.service) && (
                  <div className="space-y-3 p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" />
                      <Label className="text-sm font-semibold">Protocole de remise des clés *</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pour les prestations à domicile, indiquez comment l'Accompagnateur Certifié récupèrera vos clés.
                    </p>
                    <Select
                      value={formData.keyHandoverProtocol}
                      onValueChange={(v) => setFormData({ ...formData, keyHandoverProtocol: v as KeyHandoverProtocol })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Choisir le mode de remise..." />
                      </SelectTrigger>
                      <SelectContent>
                        {keyProtocolOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <span>{opt.icon}</span>
                              <div className="text-left">
                                <p className="font-medium">{opt.label}</p>
                                <p className="text-xs text-muted-foreground">{opt.description}</p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.keyHandoverProtocol && formData.keyHandoverProtocol !== 'already_provided' && (
                      <Textarea
                        placeholder={
                          formData.keyHandoverProtocol === 'lockbox'
                            ? 'Code de la boîte à clés + emplacement (ex: près de la porte, code 1234)'
                            : formData.keyHandoverProtocol === 'neighbor'
                            ? 'Nom du voisin/concierge, étage, contact téléphonique'
                            : 'Lieu et horaire convenus pour la remise en main propre'
                        }
                        value={formData.keyHandoverDetails || ''}
                        onChange={(e) => setFormData({ ...formData, keyHandoverDetails: e.target.value })}
                        rows={2}
                        className="bg-background"
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Dog Selection */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dog className="h-5 w-5 text-primary" />
                  Votre compagnon
                </CardTitle>
                <CardDescription>
                  {isAuthenticated 
                    ? "Sélectionnez le chien pour cette prestation"
                    : "Connectez-vous pour ajouter votre animal"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAuthenticated ? (
                  dogs.length > 0 ? (
                    <RadioGroup
                      value={formData.dogId}
                      onValueChange={(v) => setFormData({ ...formData, dogId: v })}
                    >
                      <div className="grid gap-3">
                        {dogs.map((dog) => (
                          <Label
                            key={dog.id}
                            htmlFor={dog.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.dogId === dog.id
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <RadioGroupItem value={dog.id} id={dog.id} />
                            <Avatar className="h-14 w-14">
                              <AvatarImage src={dog.photo_url} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                🐕
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{dog.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {dog.breed} • {dog.age ? `${dog.age} ans` : ''}
                              </p>
                            </div>
                          </Label>
                        ))}
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                        <Dog className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">Vous n'avez pas encore ajouté de chien</p>
                      <Button variant="outline">
                        Ajouter mon chien
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-xl">
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Dernière étape !</h3>
                    <p className="text-muted-foreground mb-4">
                      Créez votre compte gratuit pour finaliser votre réservation
                    </p>
                    <Button onClick={onRequireAuth} className="gap-2">
                      Créer mon compte
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Récapitulatif
                </CardTitle>
                <CardDescription>
                  Vérifiez les détails de votre réservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Walker Info */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={walker?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {walker?.first_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{walker?.first_name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{walker?.rating?.toFixed(1) || '5.0'}</span>
                      <span>•</span>
                      <span>{walker?.total_reviews || 0} avis</span>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">
                      {serviceOptions.find(s => s.id === formData.service)?.label}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {formData.date && new Date(formData.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Heure</span>
                    <span className="font-medium">{formData.time}</span>
                  </div>
                  {formData.service === 'promenade' && (
                    <>
                      <Separator />
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Durée</span>
                        <span className="font-medium">{formData.duration} min</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Price Summary */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">{calculatePrice()}€</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Paiement sécurisé - Fonds bloqués jusqu'à validation
                  </p>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Lock className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Paiement sécurisé</strong> - Les fonds sont bloqués jusqu'à confirmation du service
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {step > 1 && (
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        )}
        <Button 
          onClick={step === 4 ? handleSubmit : handleNext}
          disabled={!canProceed() || loading}
          className="flex-1 gap-2 shadow-lg"
        >
          {loading ? (
            "Envoi en cours..."
          ) : step === 4 ? (
            <>
              <CreditCard className="h-4 w-4" />
              Confirmer et payer {calculatePrice()}€
            </>
          ) : (
            <>
              Continuer
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
