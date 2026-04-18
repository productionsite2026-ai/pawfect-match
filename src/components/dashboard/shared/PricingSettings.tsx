import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Euro, Clock, Dog, MapPin, Calculator, Sparkles, Info, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PricingSettingsProps {
  walkerProfile: any;
  onUpdate?: () => void;
}

const SERVICE_TYPES = [
  { id: 'promenade', label: 'Promenade', icon: Dog, defaultPrice: 15, description: 'Sortie quotidienne' },
  { id: 'visite', label: 'Visite à domicile', icon: MapPin, defaultPrice: 12, description: 'Nourriture & compagnie' },
  { id: 'garde', label: 'Garde journée', icon: Clock, defaultPrice: 35, description: 'Garde complète' },
  { id: 'veterinaire', label: 'Accompagnement véto', icon: MapPin, defaultPrice: 25, description: 'Transport & attente' },
];

const PricingSettings = ({ walkerProfile, onUpdate }: PricingSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(walkerProfile?.hourly_rate || 15);
  const [serviceRadius, setServiceRadius] = useState(walkerProfile?.service_radius_km || 5);
  const [maxDogs, setMaxDogs] = useState(walkerProfile?.max_dogs || 3);
  const [dynamicPricing, setDynamicPricing] = useState(false);
  const [weekendSupplement, setWeekendSupplement] = useState(20);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non connecté");

      const { error } = await supabase
        .from('walker_profiles')
        .update({
          hourly_rate: hourlyRate,
          service_radius_km: serviceRadius,
          max_dogs: maxDogs,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      toast({ title: "Tarifs mis à jour", description: "Vos nouveaux tarifs sont maintenant actifs" });
      onUpdate?.();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Pricing Card */}
      <Card className="overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Euro className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Tarification</CardTitle>
              <CardDescription>Définissez vos tarifs et paramètres</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Hourly Rate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Tarif horaire</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Transparence totale sur vos revenus</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <Slider
                  value={[hourlyRate]}
                  onValueChange={([v]) => setHourlyRate(v)}
                  min={10}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>10€</span>
                  <span>50€</span>
                </div>
              </div>
              <div className="relative w-32">
                <Input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="text-center text-xl font-bold pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">€/h</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span className="text-sm">Vous recevez l'intégralité</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{hourlyRate}€/h</span>
            </div>
          </div>

          {/* Service Radius */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Zone d'intervention</Label>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <Slider
                  value={[serviceRadius]}
                  onValueChange={([v]) => setServiceRadius(v)}
                  min={1}
                  max={25}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1 km</span>
                  <span>25 km</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <MapPin className="h-4 w-4 mr-1" />
                {serviceRadius} km
              </Badge>
            </div>
          </div>

          {/* Max Dogs */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Chiens simultanés maximum</Label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Button
                  key={n}
                  variant={maxDogs === n ? "default" : "outline"}
                  onClick={() => setMaxDogs(n)}
                  className="h-14 text-lg font-bold"
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Pricing */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Tarification dynamique</CardTitle>
                <CardDescription>Ajustez vos prix automatiquement</CardDescription>
              </div>
            </div>
            <Switch checked={dynamicPricing} onCheckedChange={setDynamicPricing} />
          </div>
        </CardHeader>
        {dynamicPricing && (
          <CardContent className="space-y-4 pt-0">
            <div className="p-4 rounded-xl bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <span>Supplément week-end</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={weekendSupplement}
                    onChange={(e) => setWeekendSupplement(Number(e.target.value))}
                    className="w-20 text-center"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Tarif week-end estimé</span>
                <span className="font-semibold text-foreground">
                  {(hourlyRate * (1 + weekendSupplement / 100)).toFixed(2)}€/h
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Service Prices */}
      <Card>
        <CardHeader>
          <CardTitle>Tarifs par service</CardTitle>
          <CardDescription>Prix indicatifs basés sur votre tarif horaire</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {SERVICE_TYPES.map((service) => {
              const estimatedPrice = service.id === 'promenade' 
                ? hourlyRate 
                : service.id === 'visite' 
                  ? hourlyRate * 0.8 
                  : service.id === 'garde' 
                    ? hourlyRate * 3 
                    : hourlyRate * 1.5;
              
              return (
                <div 
                  key={service.id}
                  className="flex items-center gap-4 p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{service.label}</p>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{estimatedPrice.toFixed(0)}€</p>
                    <p className="text-xs text-muted-foreground">estimé</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Annuler</Button>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="gap-2 px-8"
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </motion.div>
  );
};

export default PricingSettings;
