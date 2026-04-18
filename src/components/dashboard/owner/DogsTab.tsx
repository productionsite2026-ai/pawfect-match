import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dog as DogIcon, Plus, Edit2, Trash2, Heart, Info, Save, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import DogPhotoUpload from "@/components/dashboard/shared/DogPhotoUpload";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface DogFormData {
  name: string;
  breed: string;
  age: string;
  weight: string;
  size: string;
  temperament: string;
  special_needs: string;
}

const initialFormData: DogFormData = {
  name: '',
  breed: '',
  age: '',
  weight: '',
  size: 'medium',
  temperament: '',
  special_needs: ''
};

const DogsTab = () => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingDog, setEditingDog] = useState<any>(null);
  const [formData, setFormData] = useState<DogFormData>(initialFormData);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setDogs(data || []);
    }
    setLoading(false);
  };

  const openAddSheet = () => {
    setEditingDog(null);
    setFormData(initialFormData);
    setIsSheetOpen(true);
  };

  const openEditSheet = (dog: any) => {
    setEditingDog(dog);
    setFormData({
      name: dog.name || '',
      breed: dog.breed || '',
      age: dog.age?.toString() || '',
      weight: dog.weight?.toString() || '',
      size: dog.size || 'medium',
      temperament: dog.temperament || '',
      special_needs: dog.special_needs || ''
    });
    setIsSheetOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const dogData = {
      name: formData.name,
      breed: formData.breed,
      age: formData.age ? parseInt(formData.age) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      size: formData.size as any,
      temperament: formData.temperament || null,
      special_needs: formData.special_needs || null,
    };

    try {
      if (editingDog) {
        // Update existing dog
        const { error } = await supabase
          .from('dogs')
          .update({ ...dogData, updated_at: new Date().toISOString() })
          .eq('id', editingDog.id);

        if (error) throw error;

        toast({
          title: "Chien mis à jour !",
          description: `${formData.name} a été modifié avec succès.`,
        });
      } else {
        // Create new dog
        const { error } = await supabase.from('dogs').insert({
          ...dogData,
          owner_id: session.user.id,
        });

        if (error) throw error;

        toast({
          title: "Chien ajouté !",
          description: "Votre compagnon a été ajouté avec succès.",
        });
      }
      
      setIsSheetOpen(false);
      setFormData(initialFormData);
      setEditingDog(null);
      fetchDogs();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dogId: string, dogName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${dogName} ?`)) return;

    const { error } = await supabase.from('dogs').delete().eq('id', dogId);
    
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Chien supprimé", description: `${dogName} a été retiré de votre liste.` });
      fetchDogs();
    }
  };

  const getSizeLabel = (size: string | null) => {
    const sizes: Record<string, string> = {
      small: "Petit",
      medium: "Moyen",
      large: "Grand",
      giant: "Géant"
    };
    return sizes[size || ''] || size;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div 
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <DogIcon className="h-8 w-8 text-primary" />
            Mes Chiens
          </h2>
          <p className="text-muted-foreground mt-1">
            Gérez les profils de vos compagnons à quatre pattes
          </p>
        </div>
        
        <Button onClick={openAddSheet} className="gap-2 shadow-lg">
          <Plus className="h-5 w-5" />
          Ajouter un chien
        </Button>
      </motion.div>

      {/* Sheet for Add/Edit */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {editingDog ? `Modifier ${editingDog.name}` : 'Ajouter un chien'}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div>
              <Label htmlFor="name">Nom du chien *</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                placeholder="Rex, Bella..." 
                className="mt-1" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="breed">Race</Label>
                <Input 
                  id="breed" 
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  placeholder="Labrador..." 
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="age">Âge (années)</Label>
                <Input 
                  id="age" 
                  type="number" 
                  min="0"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="3" 
                  className="mt-1" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  step="0.1" 
                  min="0"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  placeholder="25" 
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="size">Taille</Label>
                <Select value={formData.size} onValueChange={(v) => setFormData({...formData, size: v})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Taille du chien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petit ({"<"} 10kg)</SelectItem>
                    <SelectItem value="medium">Moyen (10-25kg)</SelectItem>
                    <SelectItem value="large">Grand (25-45kg)</SelectItem>
                    <SelectItem value="giant">Géant ({">"} 45kg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="temperament">Tempérament</Label>
              <Textarea 
                id="temperament" 
                value={formData.temperament}
                onChange={(e) => setFormData({...formData, temperament: e.target.value})}
                placeholder="Calme, joueur, sociable avec les autres chiens..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="medical" className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Notes médicales
              </Label>
              <Textarea 
                id="medical" 
                value={formData.special_needs}
                onChange={(e) => setFormData({...formData, special_needs: e.target.value})}
                placeholder="Allergies, traitements, précautions particulières..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSheetOpen(false)} 
                className="flex-1 gap-2"
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
              <Button type="submit" className="flex-1 gap-2" disabled={submitting}>
                {submitting ? 'Enregistrement...' : (
                  <>
                    <Save className="h-4 w-4" />
                    {editingDog ? 'Enregistrer' : 'Ajouter'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Dogs Grid */}
      {dogs.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-16 px-4">
            <CardContent>
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center text-5xl">
                🐕
              </div>
              <h3 className="font-semibold text-xl mb-2">Aucun chien enregistré</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Ajoutez votre premier compagnon pour commencer à réserver des promenades
              </p>
              <Button onClick={openAddSheet} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter mon premier chien
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs.map((dog, index) => (
            <motion.div
              key={dog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                  {dog.photo_url ? (
                    <img src={dog.photo_url} alt={dog.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl">
                      🐕
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  
                  {/* Photo upload button */}
                  <div className="absolute top-3 left-3">
                    <DogPhotoUpload
                      currentUrl={dog.photo_url}
                      dogId={dog.id}
                      dogName={dog.name}
                      size="sm"
                      onUploadComplete={() => fetchDogs()}
                    />
                  </div>
                  
                  {/* Quick actions */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8"
                      onClick={() => openEditSheet(dog)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-8 w-8"
                      onClick={() => handleDelete(dog.id, dog.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Name overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-bold text-foreground">{dog.name}</h3>
                    <p className="text-sm text-muted-foreground">{dog.breed || 'Race non spécifiée'}</p>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dog.age && (
                      <Badge variant="secondary">{dog.age} an{dog.age > 1 ? 's' : ''}</Badge>
                    )}
                    {dog.weight && (
                      <Badge variant="secondary">{dog.weight} kg</Badge>
                    )}
                    {dog.size && (
                      <Badge variant="outline">{getSizeLabel(dog.size)}</Badge>
                    )}
                  </div>
                  
                  {dog.temperament && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {dog.temperament}
                    </p>
                  )}
                  
                  {dog.special_needs && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-sm">
                      <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-amber-700 dark:text-amber-400 line-clamp-2">{dog.special_needs}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {/* Add Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dogs.length * 0.1 }}
          >
            <Card 
              className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
              onClick={openAddSheet}
            >
              <CardContent className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 mx-auto mb-4 flex items-center justify-center transition-colors">
                  <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Ajouter un chien
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DogsTab;