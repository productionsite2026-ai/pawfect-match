import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { motion } from "framer-motion";
import { Dog, Heart, Info } from "lucide-react";
import heroImage from "@/assets/pages/add-dog-hero.jpg";

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

const AddDog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUserId(session.user.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const { error } = await supabase.from('dogs').insert({
        owner_id: userId,
        name: formData.get('name') as string,
        breed: formData.get('breed') as string,
        age: formData.get('age') ? parseInt(formData.get('age') as string) : null,
        weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : null,
        temperament: formData.get('temperament') as string || null,
        special_needs: formData.get('medical') as string || null,
      });

      if (error) throw error;

      toast({
        title: "Chien ajouté !",
        description: "Votre chien a été ajouté avec succès.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Ajouter un chien | DogWalking"
        description="Enregistrez votre chien sur DogWalking pour réserver des promenades et gardes. Renseignez son profil : race, âge, tempérament et besoins spécifiques."
        canonical="https://dogwalking.fr/dogs/add"
        noindex
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6"
          >
            <Dog className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ajouter un chien</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Créez le profil de votre compagnon pour réserver des promenades
          </p>
        </motion.div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Informations du chien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Label htmlFor="name">Nom du chien *</Label>
                  <Input id="name" name="name" required placeholder="Rex, Bella..." />
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="breed">Race *</Label>
                    <Input id="breed" name="breed" required placeholder="Labrador, Berger..." />
                  </div>
                  <div>
                    <Label htmlFor="age">Âge (années)</Label>
                    <Input id="age" name="age" type="number" min="0" placeholder="3" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input id="weight" name="weight" type="number" step="0.1" min="0" placeholder="25" />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="temperament">Tempérament</Label>
                  <Textarea 
                    id="temperament" 
                    name="temperament"
                    placeholder="Calme, joueur, sociable avec les autres chiens..."
                    rows={3}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="behavior">Comportement avec autres chiens</Label>
                  <select
                    id="behavior"
                    name="behavior"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="friendly">Sociable — adore les autres chiens</option>
                    <option value="selective">Sélectif — s'entend avec certains</option>
                    <option value="reactive">Réactif — nécessite une gestion</option>
                    <option value="fearful">Craintif — préfère les éviter</option>
                    <option value="aggressive">Agressif — ne pas mettre en contact</option>
                  </select>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between p-4 rounded-xl border">
                  <div>
                    <Label htmlFor="vaccinated" className="font-medium">Vaccinations à jour</Label>
                    <p className="text-xs text-muted-foreground">Carnet de vaccination vérifié</p>
                  </div>
                  <input type="checkbox" id="vaccinated" name="vaccinated" defaultChecked
                    className="h-5 w-5 rounded border-input text-primary focus:ring-primary" />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="medical" className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    Notes médicales (optionnel)
                  </Label>
                  <Textarea 
                    id="medical" 
                    name="medical"
                    placeholder="Allergies, traitements, précautions particulières..."
                    rows={3}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Ajout...' : 'Ajouter le chien'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default AddDog;
