import { User, Mail, Phone, MapPin, Camera, LogOut, FileText, Shield, Bell, Upload, RefreshCw, Trash2, Euro, Settings, Lock, Eye, EyeOff, Smartphone, Download, ChevronRight, CreditCard, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useWalkerProfile } from "@/hooks/useProfile";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import avatarWalker from "@/assets/avatar-walker.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockProfile } from "@/data/demoData";
import { Switch } from "@/components/ui/switch";

const ProfileTab = ({ role }: { role: "owner" | "walker" }) => {
  const { user } = useAuth();
  const { data: realProfile } = useProfile();
  const { data: walkerProfile } = useWalkerProfile(user?.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isDemo = !user;
  const profile = isDemo ? mockProfile : realProfile;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Walker pricing state
  const [hourlyRate, setHourlyRate] = useState(15);
  const [maxDogs, setMaxDogs] = useState(3);
  const [serviceRadius, setServiceRadius] = useState(5);
  const [savingPricing, setSavingPricing] = useState(false);

  // Notification prefs
  const [notifs, setNotifs] = useState({
    push: true, email: true, sms: false,
    bookings: true, messages: true, reviews: true, promos: false,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    profileVisible: true, showCity: true, showPhone: false,
  });

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "");
      setBio(profile.bio || "");
      setAddress((profile as any).address || "");
    }
  }, [profile]);

  useEffect(() => {
    if (walkerProfile) {
      setHourlyRate(walkerProfile.hourly_rate || 15);
      setMaxDogs(walkerProfile.max_dogs || 3);
      setServiceRadius(walkerProfile.service_radius_km || 5);
    }
  }, [walkerProfile]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      first_name: firstName, last_name: lastName, phone, city, bio,
      updated_at: new Date().toISOString()
    }).eq("id", user.id);
    if (error) { toast.error("Erreur de sauvegarde"); return; }
    toast.success("Profil mis à jour !");
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    setEditing(false);
  };

  const handleSavePricing = async () => {
    if (!user) return;
    setSavingPricing(true);
    const { error } = await supabase.from("walker_profiles").update({
      hourly_rate: hourlyRate,
      max_dogs: maxDogs,
      service_radius_km: serviceRadius,
      updated_at: new Date().toISOString()
    }).eq("user_id", user.id);
    if (error) toast.error("Erreur");
    else {
      toast.success("Tarifs enregistrés !");
      queryClient.invalidateQueries({ queryKey: ["walker_profile"] });
    }
    setSavingPricing(false);
    setActiveSection(null);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    if (!file.type.startsWith('image/')) { toast.error("Format non supporté"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image trop volumineuse (max 2MB)"); return; }
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/avatars/')[1];
        if (oldPath) await supabase.storage.from('avatars').remove([oldPath]);
      }
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      await supabase.from('profiles').update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() }).eq('id', user.id);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Photo mise à jour !");
    } catch (error: any) { toast.error(error.message); }
    finally { setUploading(false); }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !profile?.avatar_url) return;
    setUploading(true);
    try {
      const oldPath = profile.avatar_url.split('/avatars/')[1];
      if (oldPath) await supabase.storage.from('avatars').remove([oldPath]);
      await supabase.from('profiles').update({ avatar_url: null, updated_at: new Date().toISOString() }).eq('id', user.id);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Photo supprimée");
    } catch (error: any) { toast.error(error.message); }
    finally { setUploading(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const serviceEstimates = [
    { label: "Promenade (1h)", price: hourlyRate },
    { label: "Visite à domicile", price: Math.round(hourlyRate * 0.8) },
    { label: "Garde journée", price: Math.round(hourlyRate * 3) },
    { label: "Accompagnement Vétérinaire", price: Math.round(hourlyRate * 1.5) },
  ];

  return (
    <div className="px-4 py-6 space-y-3 pb-24">
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-card p-5 text-center">
        <div className="relative inline-block mb-3 group">
          <img src={profile?.avatar_url || avatarWalker} alt="Avatar"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20 mx-auto transition-transform group-hover:scale-105" />
          {uploading ? (
            <div className="absolute inset-0 rounded-full bg-foreground/40 flex items-center justify-center mx-auto w-20 h-20">
              <RefreshCw className="w-5 h-5 text-primary-foreground animate-spin" />
            </div>
          ) : (
            <button onClick={() => !isDemo && fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full gradient-primary flex items-center justify-center border-2 border-card shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>
        {profile?.avatar_url && !isDemo && (
          <button onClick={handleRemoveAvatar} className="text-[10px] text-destructive font-medium flex items-center gap-1 mx-auto mb-1">
            <Trash2 className="w-3 h-3" /> Supprimer
          </button>
        )}
        <h2 className="text-lg font-black text-foreground">{profile?.first_name || "Utilisateur"} {profile?.last_name || ""}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{profile?.email}</p>
        <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
          {role === "walker" ? "🏃 Accompagnateur Certifié" : "🏠 Propriétaire d'animal"}
        </span>
      </motion.div>

      <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); e.target.value = ''; }} />

      {/* Personal Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card rounded-2xl shadow-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground text-sm">👤 Informations personnelles</h3>
          {!isDemo && (
            <button onClick={() => editing ? handleSave() : setEditing(true)}
              className="text-xs font-bold text-primary">
              {editing ? "💾 Sauvegarder" : "✏️ Modifier"}
            </button>
          )}
        </div>
        {[
          { icon: User, label: "Prénom", value: firstName, set: setFirstName },
          { icon: User, label: "Nom", value: lastName, set: setLastName },
          { icon: Phone, label: "Téléphone", value: phone, set: setPhone, placeholder: "06 12 34 56 78" },
          { icon: MapPin, label: "Ville", value: city, set: setCity, placeholder: "Paris, Lyon..." },
          { icon: Home, label: "Adresse", value: address, set: setAddress, placeholder: "12 rue de la Paix" },
        ].map((field) => (
          <div key={field.label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
              <field.icon className="w-4 h-4 text-primary" />
            </div>
            {editing ? (
              <input value={field.value} onChange={e => field.set(e.target.value)}
                placeholder={field.placeholder || field.label}
                className="flex-1 px-3 py-2 rounded-xl bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            ) : (
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">{field.label}</p>
                <p className="text-sm font-semibold text-foreground">{field.value || "—"}</p>
              </div>
            )}
          </div>
        ))}
        {editing && (
          <div className="space-y-2">
            <label className="text-[10px] text-muted-foreground font-semibold">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Parlez de vous..."
              maxLength={500}
              className="w-full px-3 py-2 rounded-xl bg-muted text-sm text-foreground min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            <p className="text-[9px] text-muted-foreground text-right">{bio.length}/500</p>
          </div>
        )}
        {!editing && bio && (
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground mb-1">Bio</p>
            <p className="text-sm text-foreground leading-relaxed">{bio}</p>
          </div>
        )}
      </motion.div>

      {/* === WALKER ONLY: Pricing Section === */}
      {role === "walker" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden">
          <button onClick={() => setActiveSection(activeSection === "pricing" ? null : "pricing")}
            className="w-full p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <Euro className="w-4 h-4 text-accent" />
              </div>
              <h3 className="font-bold text-foreground text-sm">💰 Tarifs & Services</h3>
            </div>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === "pricing" ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {activeSection === "pricing" && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-muted-foreground">Tarif Horaire (85% pour vous)</span>
                      <span className="text-primary">{hourlyRate}€ / h</span>
                    </div>
                    <input type="range" min={10} max={50} step={1} value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))}
                      className="w-full accent-primary" />
                    <p className="text-[9px] text-muted-foreground">Commission DogWalking : 15% (Paiement sécurisé inclus)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-muted-foreground">Nombre max d'Animaux</span>
                      <span className="text-primary">{maxDogs} Animaux</span>
                    </div>
                    <input type="range" min={1} max={5} step={1} value={maxDogs} onChange={e => setMaxDogs(Number(e.target.value))}
                      className="w-full accent-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-muted-foreground">Rayon d'action</span>
                      <span className="text-primary">{serviceRadius} km</span>
                    </div>
                    <input type="range" min={1} max={50} step={1} value={serviceRadius} onChange={e => setServiceRadius(Number(e.target.value))}
                      className="w-full accent-primary" />
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground">Estimations des prestations :</p>
                    <div className="grid grid-cols-2 gap-2">
                      {serviceEstimates.map(est => (
                        <div key={est.label} className="p-2 rounded-lg bg-card border border-border/50">
                          <p className="text-[9px] text-muted-foreground truncate">{est.label}</p>
                          <p className="text-xs font-bold text-foreground">{est.price}€</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleSavePricing} disabled={savingPricing} className="w-full h-10 rounded-xl font-bold text-xs">
                    {savingPricing ? "Enregistrement..." : "💾 Sauvegarder les tarifs"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Settings Sections */}
      {[
        { id: "notifs", icon: Bell, title: "Notifications", color: "bg-blue-500/10 text-blue-500", content: (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold">Push Notifications</p>
                <p className="text-[10px] text-muted-foreground">Alertes sur votre smartphone</p>
              </div>
              <Switch checked={notifs.push} onCheckedChange={v => setNotifs({...notifs, push: v})} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold">Emails</p>
                <p className="text-[10px] text-muted-foreground">Récapitulatifs et réservations</p>
              </div>
              <Switch checked={notifs.email} onCheckedChange={v => setNotifs({...notifs, email: v})} />
            </div>
          </div>
        )},
        { id: "privacy", icon: Shield, title: "Confidentialité", color: "bg-green-500/10 text-green-500", content: (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold">Profil public</p>
                <p className="text-[10px] text-muted-foreground">Visible dans la recherche</p>
              </div>
              <Switch checked={privacy.profileVisible} onCheckedChange={v => setPrivacy({...privacy, profileVisible: v})} />
            </div>
          </div>
        )},
        { id: "security", icon: Lock, title: "Sécurité & Compte", color: "bg-amber-500/10 text-amber-500", content: (
          <div className="p-4 space-y-2">
            <Button variant="outline" className="w-full justify-start text-xs font-bold h-10 rounded-xl">Changer le mot de passe</Button>
            <Button variant="outline" className="w-full justify-start text-xs font-bold h-10 rounded-xl">Double authentification</Button>
          </div>
        )},
      ].map(section => (
        <motion.div key={section.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden">
          <button onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            className="w-full p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${section.color} flex items-center justify-center`}>
                <section.icon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-foreground text-sm">{section.title}</h3>
            </div>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === section.id ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {activeSection === section.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t">
                {section.content}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Logout Button */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        onClick={handleLogout}
        className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-destructive/20 text-destructive font-bold text-sm flex items-center justify-center gap-2 hover:bg-destructive/5 transition-colors mt-4">
        <LogOut className="w-4 h-4" /> Déconnexion
      </motion.button>

      <p className="text-center text-[10px] text-muted-foreground py-4">Version 2.4.0 • DogWalking France</p>
    </div>
  );
};

export default ProfileTab;
