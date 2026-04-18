import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Dog, PawPrint, Home, Eye, Calendar, HelpCircle, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const services = [
  { id: "promenade", icon: Dog, label: "Promenade de chien", color: "bg-primary/10 border-primary/30" },
  { id: "garde", icon: Home, label: "Garde à domicile", color: "bg-emerald-500/10 border-emerald-500/30" },
  { id: "visite", icon: Eye, label: "Visite à domicile", color: "bg-violet-500/10 border-violet-500/30" },
  { id: "garde-domicile", icon: PawPrint, label: "Garde à votre domicile", color: "bg-orange-500/10 border-orange-500/30" },
  { id: "reguliere", icon: Calendar, label: "Marche régulière", color: "bg-cyan-500/10 border-cyan-500/30" },
  { id: "autre", icon: HelpCircle, label: "Autre besoin", color: "bg-muted border-muted-foreground/20" },
];

const urgencyOptions = [
  { id: "flexible", label: "Flexible", desc: "Sous 1 semaine", color: "border-emerald-500 text-emerald-600" },
  { id: "rapide", label: "Sous 48h", desc: "Besoin rapide", color: "border-orange-500 text-orange-600" },
  { id: "urgent", label: "Aujourd'hui", desc: "Urgence", color: "border-red-500 text-red-600" },
];

const ZonesContactSection = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [urgency, setUrgency] = useState("");
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  const canNext = () => {
    if (step === 1) return selectedService !== "";
    if (step === 2) return urgency !== "";
    if (step === 3) return name.trim() !== "" && /^[\d\s.+()-]{10,}$/.test(phone) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return false;
  };

  const resetForm = () => { setStep(1); setSelectedService(""); setUrgency(""); setDetails(""); setName(""); setPhone(""); setEmail(""); setCity(""); };

  const handleSubmit = () => {
    toast({ title: "✅ Demande envoyée !", description: "Nous vous recontactons sous 24h pour trouver le promeneur idéal." });
    resetForm();
  };

  return (
    <section id="contact-zone" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 mb-4">
            🐕 Trouvez votre promeneur
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Demande de Service — Trouvez un Accompagnateur
          </h2>
          <p className="text-muted-foreground text-lg">Décrivez votre besoin, on s'occupe de trouver le promeneur parfait près de chez vous.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
          <div className="h-1.5 rounded-t-2xl bg-gradient-to-r from-primary via-primary/60 to-emerald-500" />
          <div className="bg-card rounded-b-2xl shadow-2xl border border-border/50 overflow-hidden p-8">
            {/* Steps */}
            <div className="flex items-center justify-center gap-0 mb-8">
              {[1, 2, 3].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}>
                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                  </div>
                  {i < 2 && <div className={`w-16 h-0.5 mx-1 transition-all ${step > s ? "bg-primary" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-lg font-bold text-foreground mb-1">Quel service recherchez-vous ?</h3>
                  <p className="text-sm text-muted-foreground mb-6">Sélectionnez le type de service dont vous avez besoin.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {services.map((s) => (
                      <button key={s.id} onClick={() => setSelectedService(s.id)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedService === s.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/30"}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.color}`}>
                          <s.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-foreground text-center">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-lg font-bold text-foreground mb-1">Quel est votre délai ?</h3>
                  <p className="text-sm text-muted-foreground mb-6">Quand avez-vous besoin du service ?</p>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {urgencyOptions.map((u) => (
                      <button key={u.id} onClick={() => setUrgency(u.id)} className={`p-4 rounded-xl border-2 transition-all text-center ${urgency === u.id ? `${u.color} bg-muted/50 shadow-md` : "border-border hover:border-primary/30"}`}>
                        <span className="text-sm font-bold block">{u.label}</span>
                        <span className="text-xs text-muted-foreground">{u.desc}</span>
                      </button>
                    ))}
                  </div>
                  <Textarea placeholder="Détails supplémentaires (race du chien, besoins spécifiques...)" value={details} onChange={(e) => setDetails(e.target.value)} className="min-h-[80px]" />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-lg font-bold text-foreground mb-1">Vos coordonnées</h3>
                  <p className="text-sm text-muted-foreground mb-6">Pour vous recontacter avec le promeneur idéal.</p>
                  <div className="space-y-4">
                    <Input placeholder="Votre nom *" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input placeholder="Téléphone *" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <Input placeholder="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input placeholder="Ville / Code postal" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Retour
                </Button>
              ) : <div />}
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="rounded-full">
                  Suivant <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canNext()} className="rounded-full">
                  Envoyer ma demande <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ZonesContactSection;
