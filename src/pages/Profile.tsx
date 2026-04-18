import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Shield, Camera, Bell, LogOut } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { motion } from "framer-motion";
import heroImage from "@/assets/pages/profile-edit-hero.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setProfile(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.get('firstName') as string,
          last_name: formData.get('lastName') as string,
          phone: formData.get('phone') as string || null,
          address: formData.get('address') as string || null,
          city: formData.get('city') as string || null,
          postal_code: formData.get('zipCode') as string || null,
          bio: formData.get('bio') as string || null,
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({ title: "Profil mis à jour", description: "Vos modifications ont été enregistrées" });
      fetchProfile();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <motion.div 
            className="animate-pulse space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-64 bg-muted rounded-lg" />
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Mon Profil | DogWalking"
        description="Gérez votre profil DogWalking : informations personnelles, sécurité et préférences de notifications."
        canonical="https://dogwalking.fr/profile"
        noindex
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[30vh] min-h-[200px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        
        <motion.div 
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Mon Profil</h1>
          <p className="text-xl text-muted-foreground">Gérez vos informations personnelles</p>
        </motion.div>
      </section>
      
      <main className="container mx-auto px-4 py-12">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile header */}
          <motion.div variants={itemVariants}>
            <Card className="mb-8 shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full w-8 h-8">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                      <Badge variant={profile.user_type === 'walker' ? 'default' : 'secondary'}>
                        {profile.user_type === 'walker' ? 'Accompagnateur Certifié' : 'Propriétaire'}
                      </Badge>
                      {profile.account_verified && (
                        <Badge variant="outline" className="text-primary">
                          <Shield className="h-3 w-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  Sécurité
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>Gérez vos informations de profil</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input id="firstName" name="firstName" defaultValue={profile.first_name} />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Nom</Label>
                          <Input id="lastName" name="lastName" defaultValue={profile.last_name} />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
                      </div>

                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" name="phone" type="tel" defaultValue={profile.phone || ''} placeholder="06 12 34 56 78" />
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" defaultValue={profile.bio || ''} placeholder="Parlez-nous de vous..." rows={3} />
                      </div>

                      <div>
                        <Label htmlFor="address">Adresse</Label>
                        <Input id="address" name="address" defaultValue={profile.address || ''} placeholder="123 Rue de la Paix" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">Ville</Label>
                          <Input id="city" name="city" defaultValue={profile.city || ''} placeholder="Paris" />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">Code postal</Label>
                          <Input id="zipCode" name="zipCode" defaultValue={profile.postal_code || ''} placeholder="75001" />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Sécurité du compte</CardTitle>
                    <CardDescription>Gérez la sécurité de votre compte</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div 
                      className="flex items-center justify-between p-4 border rounded-lg"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div>
                        <p className="font-medium">Mot de passe</p>
                        <p className="text-sm text-muted-foreground">Dernière modification : jamais</p>
                      </div>
                      <Button variant="outline">Modifier</Button>
                    </motion.div>
                    <motion.div 
                      className="flex items-center justify-between p-4 border rounded-lg"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div>
                        <p className="font-medium">Authentification à deux facteurs</p>
                        <p className="text-sm text-muted-foreground">Non activée</p>
                      </div>
                      <Button variant="outline">Activer</Button>
                    </motion.div>
                    <motion.div 
                      className="flex items-center justify-between p-4 border rounded-lg"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div>
                        <p className="font-medium">Sessions actives</p>
                        <p className="text-sm text-muted-foreground">1 session active</p>
                      </div>
                      <Button variant="outline">Gérer</Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Préférences de notifications</CardTitle>
                    <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Nouvelles réservations", description: "Recevoir une notification pour chaque nouvelle réservation" },
                      { label: "Messages", description: "Recevoir une notification pour les nouveaux messages" },
                      { label: "Rappels", description: "Recevoir des rappels avant les réservations" },
                      { label: "Promotions", description: "Recevoir les offres et promotions DogWalking" },
                    ].map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center justify-between p-4 border rounded-lg"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Profile;
