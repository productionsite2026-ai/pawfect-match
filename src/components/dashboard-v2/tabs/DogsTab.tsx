import { Plus, Dog, Weight, Ruler, Syringe, Camera, RefreshCw, Trash2, Edit3, X, Check, Heart, Calendar, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useDogs, useAddDog, useDeleteDog } from "@/hooks/useNewDogs";
import { mockDogs } from "@/data/demoData";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import dogGolden from "@/assets/dog-golden.jpg";
import { Switch } from "@/components/ui/switch";

const SIZE_OPTIONS = [
  { value: "small", label: "Petit", desc: "< 10kg" },
  { value: "medium", label: "Moyen", desc: "10-25kg" },
  { value: "large", label: "Grand", desc: "25-45kg" },
  { value: "giant", label: "Géant", desc: "> 45kg" },
] as const;

const DogsTab = () => {
  const { user } = useAuth();
  const { data: realDogs = [] } = useDogs();
  const addDog = useAddDog();
  const deleteDog = useDeleteDog();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isDemo = !user;
  const dogs = isDemo ? mockDogs : realDogs;
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [size, setSize] = useState<string>("medium");
  const [temperament, setTemperament] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState("");
  const [vaccinated, setVaccinated] = useState(true);
  const [neutered, setNeutered] = useState(false);
  const [uploadingDogId, setUploadingDogId] = useState<string | null>(null);
  const [deletingDogId, setDeletingDogId] = useState<string | null>(null);
  const [expandedDogId, setExpandedDogId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);

  const resetForm = () => {
    setName(""); setBreed(""); setAge(""); setWeight(""); setSize("medium");
    setTemperament(""); setSpecialNeeds(""); setVaccinated(true); setNeutered(false);
    setShowForm(false);
  };

  const handleAdd = async () => {
    if (!user) return toast.error("Connectez-vous");
    if (!name.trim()) return toast.error("Nom requis");
    try {
      await addDog.mutateAsync({
        name,
        breed: breed || null,
        age: age ? Number(age) : null,
        weight: weight ? Number(weight) : null,
        size: size as any,
        temperament: temperament || null,
        special_needs: specialNeeds || null,
        vaccinations_up_to_date: vaccinated,
        is_neutered: neutered,
      });
      toast.success(`${name} ajouté !`);
      resetForm();
    } catch { toast.error("Erreur lors de l'ajout"); }
  };

  const handleDelete = async (dogId: string, dogName: string) => {
    if (!user) return;
    setDeletingDogId(dogId);
    try {
      await deleteDog.mutateAsync(dogId);
      toast.success(`${dogName} supprimé`);
    } catch { toast.error("Erreur de suppression"); }
    finally { setDeletingDogId(null); }
  };

  const handlePhotoUpload = async (file: File, dogId: string, dogName: string) => {
    if (!user) return;
    if (!file.type.startsWith('image/')) { toast.error("Format non supporté"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    setUploadingDogId(dogId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${dogId}/photo_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('dog-photos').upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('dog-photos').getPublicUrl(fileName);
      await supabase.from('dogs').update({ photo_url: urlData.publicUrl, updated_at: new Date().toISOString() }).eq('id', dogId);
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
      toast.success(`Photo de ${dogName} mise à jour !`);
    } catch (error: any) { toast.error(error.message); }
    finally { setUploadingDogId(null); }
  };

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dog className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-black text-foreground">Mes Animaux</h2>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{dogs.length}</span>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full gradient-primary text-white text-xs font-bold shadow-card">
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? "Fermer" : "Ajouter"}
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-2xl shadow-card p-4 space-y-3 overflow-hidden">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom de l'animal *"
              className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={breed} onChange={e => setBreed(e.target.value)} placeholder="Race (ex: Labrador)"
              className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <div className="grid grid-cols-2 gap-2">
              <input value={age} onChange={e => setAge(e.target.value)} placeholder="Âge (ans)" type="number" min="0"
                className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="Poids (kg)" type="number" min="0"
                className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            {/* Size selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Taille</label>
              <div className="grid grid-cols-4 gap-1.5">
                {SIZE_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => setSize(opt.value)}
                    className={`py-2 rounded-xl text-center transition-all ${
                      size === opt.value
                        ? "gradient-primary text-white shadow-card"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>
                    <span className="text-xs font-bold block">{opt.label}</span>
                    <span className="text-[8px] opacity-70">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <input value={temperament} onChange={e => setTemperament(e.target.value)} placeholder="Tempérament (calme, joueur, réactif...)"
              className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={specialNeeds} onChange={e => setSpecialNeeds(e.target.value)} placeholder="Besoins médicaux / allergies"
              className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />

            {/* Toggles */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={vaccinated} onCheckedChange={setVaccinated} />
                <label className="text-xs text-foreground font-semibold">Vacciné</label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={neutered} onCheckedChange={setNeutered} />
                <label className="text-xs text-foreground font-semibold">Stérilisé</label>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={resetForm} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold">Annuler</button>
              <button onClick={handleAdd} disabled={addDog.isPending}
                className="flex-1 py-2.5 rounded-xl gradient-primary text-white text-sm font-bold disabled:opacity-50">
                {addDog.isPending ? "Ajout..." : "✓ Ajouter"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && selectedDogId) {
            const dog = dogs.find((d: any) => d.id === selectedDogId);
            handlePhotoUpload(f, selectedDogId, dog?.name || "Chien");
          }
          e.target.value = '';
        }}
      />

      {dogs.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-3xl">
            🐕
          </div>
          <p className="text-sm font-bold text-foreground">Ajoutez votre premier animal</p>
          <p className="text-xs text-muted-foreground mt-1">Pour réserver des promenades adaptées</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)}
            className="mt-4 px-5 py-2.5 rounded-full gradient-primary text-white text-xs font-bold">
            <Plus className="w-3.5 h-3.5 inline mr-1" /> Ajouter un animal
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {dogs.map((dog: any, i: number) => {
            const isExpanded = expandedDogId === dog.id;
            const sizeLabel = SIZE_OPTIONS.find(s => s.value === dog.size)?.label || dog.size;
            return (
              <motion.div key={dog.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card rounded-2xl shadow-card overflow-hidden">
                <button className="w-full flex text-left" onClick={() => setExpandedDogId(isExpanded ? null : dog.id)}>
                  {/* Photo */}
                  <div className="relative w-28 h-28 shrink-0 group">
                    <img src={dog.photo_url || dogGolden} alt={dog.name}
                      className="w-full h-full object-cover" loading="lazy" />
                    {uploadingDogId === dog.id && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">{dog.name}</h3>
                        <Heart className="w-3.5 h-3.5 text-destructive/40" />
                      </div>
                      <p className="text-[11px] text-muted-foreground">{dog.breed || "Race inconnue"}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground flex-wrap">
                      {dog.age && <span className="flex items-center gap-0.5 bg-muted rounded-full px-2 py-0.5"><Ruler className="w-3 h-3" /> {dog.age} ans</span>}
                      {dog.weight && <span className="flex items-center gap-0.5 bg-muted rounded-full px-2 py-0.5"><Weight className="w-3 h-3" /> {dog.weight} kg</span>}
                      {dog.size && <span className="bg-muted rounded-full px-2 py-0.5">{sizeLabel}</span>}
                      {dog.vaccinations_up_to_date && (
                        <span className="flex items-center gap-0.5 bg-primary/10 text-primary rounded-full px-2 py-0.5"><Syringe className="w-3 h-3" /> Vacciné</span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-border/50">
                      <div className="p-4 space-y-3">
                        {dog.temperament && (
                          <div className="bg-muted/50 rounded-xl px-3 py-2">
                            <p className="text-[10px] font-bold text-muted-foreground mb-0.5">Tempérament</p>
                            <p className="text-xs text-foreground">{dog.temperament}</p>
                          </div>
                        )}
                        {dog.special_needs && (
                          <div className="bg-amber-500/8 border border-amber-500/15 rounded-xl px-3 py-2 flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] font-bold text-amber-600 mb-0.5">Notes médicales</p>
                              <p className="text-xs text-foreground">{dog.special_needs}</p>
                            </div>
                          </div>
                        )}
                        {/* Status badges */}
                        <div className="flex gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${dog.is_neutered ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                            {dog.is_neutered ? "✓ Stérilisé" : "Non stérilisé"}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${dog.vaccinations_up_to_date ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"}`}>
                            {dog.vaccinations_up_to_date ? "✓ Vaccins à jour" : "⚠ Vaccins à vérifier"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {!isDemo && (
                            <button onClick={(e) => { e.stopPropagation(); setSelectedDogId(dog.id); fileInputRef.current?.click(); }}
                              className="flex-1 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold flex items-center justify-center gap-1">
                              <Camera className="w-3 h-3" /> Photo
                            </button>
                          )}
                          <button onClick={() => navigate("/find-walkers")}
                            className="flex-1 py-2 rounded-xl gradient-primary text-white text-xs font-bold flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3" /> Réserver
                          </button>
                          {!isDemo && (
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(dog.id, dog.name); }}
                              disabled={deletingDogId === dog.id}
                              className="py-2 px-3 rounded-xl border border-destructive/20 text-destructive text-xs font-bold">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DogsTab;