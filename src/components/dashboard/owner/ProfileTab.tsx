import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, LogOut, Camera, MapPin, Settings, FileText } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import AdvancedSettings from "@/components/dashboard/shared/AdvancedSettings";
import AvatarUpload from "@/components/dashboard/shared/AvatarUpload";

interface ProfileTabProps { 
  profile: any; 
}

const ProfileTab = ({ profile }: ProfileTabProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    address: profile?.address || '',
    postal_code: profile?.postal_code || '',
    bio: profile?.bio || ''
  });
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({ title: "Déconnexion réussie" });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          city: profileData.city,
          address: profileData.address,
          postal_code: profileData.postal_code,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile?.id);

      if (error) throw error;
      toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <AvatarUpload
            currentUrl={profile?.avatar_url}
            userId={profile?.id}
            userName={`${profile?.first_name || ''} ${profile?.last_name || ''}`}
            size="xl"
            variant="owner"
            onUploadComplete={() => {
              toast({ title: "Photo mise à jour" });
            }}
          />
          <div>
            <h2 className="text-2xl font-bold">{profile?.first_name} {profile?.last_name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{profile?.city || 'Ville non définie'}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{profile?.email}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="profile" className="gap-2 rounded-lg">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 rounded-lg">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input 
                      value={profileData.first_name} 
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input 
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile?.email || ''} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input 
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    placeholder="12 rue de la Paix"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Code postal</Label>
                    <Input 
                      value={profileData.postal_code}
                      onChange={(e) => setProfileData({...profileData, postal_code: e.target.value})}
                      placeholder="75001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville</Label>
                  <Input 
                    value={profileData.city}
                    onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                    placeholder="Paris..."
                  />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                  {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </CardContent>
            </Card>

            {/* Bio & About */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  À propos de vous
                </CardTitle>
                <CardDescription>Cette information aide les Accompagnateurs Certifiés à vous connaître</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea 
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={6}
                    placeholder="Parlez-nous de vous et de votre animal...

Par exemple:
- Votre expérience avec les animaux
- Les besoins particuliers de votre compagnon
- Vos attentes vis-à-vis des Accompagnateurs Certifiés"
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    {profileData.bio.length}/500 caractères
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <AdvancedSettings userType="owner" />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfileTab;
