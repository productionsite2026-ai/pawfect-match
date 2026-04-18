import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Trash2, RefreshCw, Dog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DogPhotoUploadProps {
  currentUrl?: string | null;
  dogId: string;
  dogName: string;
  onUploadComplete?: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-24 h-24"
};

const DogPhotoUpload = ({ 
  currentUrl, 
  dogId, 
  dogName,
  onUploadComplete,
  size = "md"
}: DogPhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner une image (JPG, PNG, WebP)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB for dog photos)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image trop volumineuse",
        description: "La taille maximale est de 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${dogId}/photo_${Date.now()}.${fileExt}`;

      // Delete old photo if exists
      if (currentUrl) {
        const oldPath = currentUrl.split('/dog-photos/')[1];
        if (oldPath) {
          await supabase.storage.from('dog-photos').remove([oldPath]);
        }
      }

      // Upload new photo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('dog-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(fileName);

      // Update dog record
      const { error: updateError } = await supabase
        .from('dogs')
        .update({ 
          photo_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', dogId);

      if (updateError) throw updateError;

      setPreviewUrl(urlData.publicUrl);
      onUploadComplete?.(urlData.publicUrl);
      
      toast({
        title: "Photo ajoutée",
        description: `La photo de ${dogName} a été enregistrée`
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      setPreviewUrl(currentUrl || null);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setDialogOpen(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentUrl) return;

    setUploading(true);
    try {
      // Delete from storage
      const oldPath = currentUrl.split('/dog-photos/')[1];
      if (oldPath) {
        await supabase.storage.from('dog-photos').remove([oldPath]);
      }

      // Update dog record
      const { error } = await supabase
        .from('dogs')
        .update({ 
          photo_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', dogId);

      if (error) throw error;

      setPreviewUrl(null);
      onUploadComplete?.("");
      
      toast({ title: "Photo supprimée" });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setDialogOpen(true)}>
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={dogName} 
            className={`${sizeClasses[size]} rounded-2xl object-cover shadow-lg ring-2 ring-background transition-transform group-hover:scale-105`}
          />
        ) : (
          <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg ring-2 ring-background transition-transform group-hover:scale-105`}>
            <span className="text-3xl">🐕</span>
          </div>
        )}
        
        <Button 
          size="icon" 
          variant="secondary" 
          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
          disabled={uploading}
        >
          {uploading ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <Camera className="h-3 w-3" />
          )}
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = '';
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Photo de {dogName}</DialogTitle>
            <DialogDescription>
              Ajoutez une belle photo de votre compagnon
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-6 py-6">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt={dogName}
                className="w-40 h-40 rounded-2xl object-cover shadow-xl ring-4 ring-muted"
              />
            ) : (
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-xl ring-4 ring-muted">
                <Dog className="h-16 w-16 text-primary/50" />
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="gap-2"
              >
                {uploading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {previewUrl ? "Changer" : "Ajouter une photo"}
              </Button>
              
              {previewUrl && (
                <Button 
                  variant="outline" 
                  onClick={handleRemovePhoto}
                  disabled={uploading}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Formats acceptés: JPG, PNG, WebP • Taille max: 5MB
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DogPhotoUpload;
