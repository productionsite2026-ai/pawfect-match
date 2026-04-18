import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AvatarUploadProps {
  currentUrl?: string | null;
  userId: string;
  userName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "owner" | "walker";
  onUploadComplete?: (url: string) => void;
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-16 w-16", 
  lg: "h-20 w-20",
  xl: "h-24 w-24"
};

const buttonSizeClasses = {
  sm: "h-6 w-6",
  md: "h-7 w-7",
  lg: "h-8 w-8",
  xl: "h-9 w-9"
};

const AvatarUpload = ({ 
  currentUrl, 
  userId, 
  userName = "",
  size = "lg",
  variant = "owner",
  onUploadComplete 
}: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = () => {
    const parts = userName.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return userName.charAt(0).toUpperCase() || "?";
  };

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

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Image trop volumineuse",
        description: "La taille maximale est de 2MB",
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
      const fileName = `${userId}/avatar_${Date.now()}.${fileExt}`;

      // Delete old avatar if exists
      if (currentUrl) {
        const oldPath = currentUrl.split('/avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      // Upload new avatar
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      setPreviewUrl(urlData.publicUrl);
      onUploadComplete?.(urlData.publicUrl);
      
      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été enregistrée"
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

  const handleRemoveAvatar = async () => {
    if (!currentUrl) return;

    setUploading(true);
    try {
      // Delete from storage
      const oldPath = currentUrl.split('/avatars/')[1];
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

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

  const gradientClass = variant === "walker" 
    ? "from-green-500 to-emerald-600" 
    : "from-primary to-primary/70";

  return (
    <>
      <div className="relative group">
        <Avatar className={`${sizeClasses[size]} ring-4 ring-background shadow-xl transition-transform group-hover:scale-105`}>
          <AvatarImage src={previewUrl || undefined} className="object-cover" />
          <AvatarFallback className={`bg-gradient-to-br ${gradientClass} text-white text-xl font-bold`}>
            {uploading ? (
              <RefreshCw className="h-6 w-6 animate-spin" />
            ) : (
              getInitials()
            )}
          </AvatarFallback>
        </Avatar>
        
        <Button 
          size="icon" 
          variant="secondary" 
          className={`absolute -bottom-1 -right-1 ${buttonSizeClasses[size]} rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110`}
          onClick={() => setDialogOpen(true)}
          disabled={uploading}
        >
          <Camera className="h-4 w-4" />
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
            <DialogTitle>Photo de profil</DialogTitle>
            <DialogDescription>
              Choisissez une photo qui vous représente. Elle sera visible par les autres utilisateurs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-6 py-6">
            <Avatar className="h-32 w-32 ring-4 ring-muted">
              <AvatarImage src={previewUrl || undefined} className="object-cover" />
              <AvatarFallback className={`bg-gradient-to-br ${gradientClass} text-white text-3xl font-bold`}>
                {getInitials()}
              </AvatarFallback>
            </Avatar>

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
                {previewUrl ? "Changer" : "Téléverser"}
              </Button>
              
              {previewUrl && (
                <Button 
                  variant="outline" 
                  onClick={handleRemoveAvatar}
                  disabled={uploading}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Formats acceptés: JPG, PNG, WebP • Taille max: 2MB
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvatarUpload;
