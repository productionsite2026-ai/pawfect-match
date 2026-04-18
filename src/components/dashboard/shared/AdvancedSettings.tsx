import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, Bell, Shield, Globe, Smartphone, 
  Mail, Lock, Trash2, Download, Eye, LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface AdvancedSettingsProps {
  userType: "owner" | "walker";
}

const AdvancedSettings = ({ userType }: AdvancedSettingsProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    bookingReminders: true,
    reviews: true,
    messages: true,
    promotions: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showLocation: true,
    showPhone: false
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({ title: "Déconnexion réussie" });
  };

  const handleExportData = async () => {
    toast({ title: "Export en cours", description: "Vous recevrez un email avec vos données" });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Canaux</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">Notifications par email</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.email} 
                  onCheckedChange={(v) => setNotifications({...notifications, email: v})}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Notifications push</p>
                    <p className="text-sm text-muted-foreground">Alertes sur votre appareil</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.push} 
                  onCheckedChange={(v) => setNotifications({...notifications, push: v})}
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Types</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span>Rappels de réservation</span>
                <Switch 
                  checked={notifications.bookingReminders} 
                  onCheckedChange={(v) => setNotifications({...notifications, bookingReminders: v})}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span>Nouveaux messages</span>
                <Switch 
                  checked={notifications.messages} 
                  onCheckedChange={(v) => setNotifications({...notifications, messages: v})}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span>Avis reçus</span>
                <Switch 
                  checked={notifications.reviews} 
                  onCheckedChange={(v) => setNotifications({...notifications, reviews: v})}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span>Promotions</span>
                <Switch 
                  checked={notifications.promotions} 
                  onCheckedChange={(v) => setNotifications({...notifications, promotions: v})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Confidentialité</CardTitle>
              <CardDescription>Contrôlez la visibilité de vos informations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Profil visible</p>
              <p className="text-sm text-muted-foreground">
                {userType === "walker" ? "Apparaître dans les recherches" : "Visible par les promeneurs"}
              </p>
            </div>
            <Switch 
              checked={privacy.profileVisible} 
              onCheckedChange={(v) => setPrivacy({...privacy, profileVisible: v})}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Afficher ma localisation</p>
              <p className="text-sm text-muted-foreground">Ville affichée sur votre profil</p>
            </div>
            <Switch 
              checked={privacy.showLocation} 
              onCheckedChange={(v) => setPrivacy({...privacy, showLocation: v})}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Afficher mon téléphone</p>
              <p className="text-sm text-muted-foreground">Numéro visible après réservation</p>
            </div>
            <Switch 
              checked={privacy.showPhone} 
              onCheckedChange={(v) => setPrivacy({...privacy, showPhone: v})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Sécurité</CardTitle>
              <CardDescription>Protégez votre compte</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Changer le mot de passe</p>
                <p className="text-sm text-muted-foreground">Dernière modification il y a 30 jours</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Modifier</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Authentification à deux facteurs</p>
                <p className="text-sm text-muted-foreground">Sécurité renforcée</p>
              </div>
            </div>
            <Badge variant="secondary">Désactivé</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data & Account */}
      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg">Données & Compte</CardTitle>
              <CardDescription>Gérez vos données personnelles</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3" onClick={handleExportData}>
            <Download className="h-4 w-4" />
            Exporter mes données
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdvancedSettings;
