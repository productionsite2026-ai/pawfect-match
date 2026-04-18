import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, Send, ArrowLeft, Search, Image, Paperclip, X, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRealtimeMessages, Conversation } from "@/hooks/useRealtimeMessages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Notification sound (base64 encoded short beep)
const NOTIFICATION_SOUND_URL = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczHj6NyN/Qu2k8JT2Hw9bQv3xMM0OFwtHOw4FVOUmKxNHMwIBWPEmKxM/JvX1VPEuMyM3FuXlUP1CQy8zDtXVTQFOUzsvBsHJSQViX0svBr3FPQlqa08zBrm5MQWCi18/ArWxKQWWt5NHArGlGP2iy59PBqWRDP3C46tfGplxAPnO87d3Mol5CP3fB8+LMn11BQHrF+OfQnFpAQH7K/ezUmldAQYDP//DYmFY/QYLR//PbllQ+QYTT//XdlFI9QIbV//fflVA8P4XX//nhl009PoXZ//rjlks8PoXZ//vjl0o7PYTa//zkmEk7PYPa//3lmUg6PILb//7nmkc5O4Hb///om0Y5O4Dc///pnEU4OoHc///qnUQ4On/d///snkM3OX7d///tn0I2OX3e///uoEE2OHze///voUA1OH3e///woT81N37e///xoj80N37e///yoz40Nn/e///0pD0zNn/e///1pTwyNoHe///2pjsxNYHe///4pzovNILe///5qDkuNILe///6qTgtM4Pe///7qjcsM4Pf///8qzYrMoPf///+rDUqMYTf///";

const playNotificationSound = () => {
  try {
    const audio = new Audio(NOTIFICATION_SOUND_URL);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  } catch {}
};

// Check if content is an image message
const isImageMessage = (content: string) => content.startsWith("[IMG]");
const getImageUrl = (content: string) => content.replace("[IMG]", "");

const MessagesTab = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevMessageCountRef = useRef(0);

  const {
    messages,
    conversations,
    loading,
    currentUserId,
    sendMessage,
    startTyping,
    stopTyping,
    isUserTyping,
    isUserOnline,
  } = useRealtimeMessages(selectedConversation?.otherParticipant?.id);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Play sound on new incoming messages
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current && prevMessageCountRef.current > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.sender_id !== currentUserId) {
        playNotificationSound();
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, currentUserId]);

  const filtered = conversations.filter(c =>
    c.otherParticipant?.first_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation?.otherParticipant?.id) return;
    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);
    stopTyping(selectedConversation.otherParticipant.id);
    const { success } = await sendMessage(content, selectedConversation.otherParticipant.id);
    if (!success) setNewMessage(content);
    setSending(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUserId || !selectedConversation?.otherParticipant?.id) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast({ title: "Fichier non supporté", description: "Seules les images sont acceptées", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Maximum 5 Mo", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `chat/${currentUserId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("walk-proofs")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      toast({ title: "Erreur upload", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("walk-proofs").getPublicUrl(path);
    const imageContent = `[IMG]${urlData.publicUrl}`;
    
    await sendMessage(imageContent, selectedConversation.otherParticipant.id);
    setUploading(false);
    toast({ title: "Image envoyée ✓" });
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (selectedConversation?.otherParticipant?.id && e.target.value) {
      startTyping(selectedConversation.otherParticipant.id);
    }
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Maintenant";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  // Conversation list view
  if (!selectedConversation) {
    return (
      <div className="px-4 py-6 pb-24 space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-black text-foreground">Messages</h2>
          {conversations.some(c => c.unreadCount > 0) && (
            <span className="text-[10px] font-bold text-white bg-destructive rounded-full px-1.5 py-0.5">
              {conversations.reduce((s, c) => s + c.unreadCount, 0)}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <motion.div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-semibold text-muted-foreground">Aucune conversation</p>
            <p className="text-xs text-muted-foreground mt-1">Vos échanges apparaîtront ici</p>
          </motion.div>
        ) : (
          <div className="space-y-1.5">
            {filtered.map((conv, i) => {
              const online = isUserOnline(conv.id);
              const typing = isUserTyping(conv.id);
              const lastContent = conv.lastMessage?.content || "";
              const isImg = isImageMessage(lastContent);
              return (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { setSelectedConversation(conv); setTimeout(() => inputRef.current?.focus(), 100); }}
                  className={cn(
                    "w-full bg-card rounded-2xl shadow-card p-3 flex items-center gap-3 text-left transition-all hover:shadow-card-hover",
                    conv.unreadCount > 0 && "border border-primary/20"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conv.otherParticipant?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {conv.otherParticipant?.first_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{conv.otherParticipant?.first_name || "Utilisateur"}</span>
                      <span className="text-[9px] text-muted-foreground">{formatTime(conv.lastMessage?.created_at || null)}</span>
                    </div>
                    {typing ? (
                      <p className="text-xs text-primary italic">Écrit...</p>
                    ) : (
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.lastMessage?.sender_id === currentUserId && "Vous : "}
                        {isImg ? "📷 Photo" : (conv.lastMessage?.content || "Démarrer la conversation")}
                      </p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Chat view
  const partner = selectedConversation.otherParticipant;
  const partnerTyping = partner?.id ? isUserTyping(partner.id) : false;
  const partnerOnline = partner?.id ? isUserOnline(partner.id) : false;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] pb-16">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Chat Header */}
      <div className="px-4 py-3 border-b bg-card flex items-center gap-3">
        <button onClick={() => setSelectedConversation(null)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative">
          <Avatar className="w-9 h-9">
            <AvatarImage src={partner?.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{partner?.first_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          {partnerOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />}
        </div>
        <div>
          <p className="font-bold text-sm text-foreground">{partner?.first_name || "Utilisateur"}</p>
          <p className="text-[10px] text-muted-foreground">
            {partnerTyping ? <span className="text-primary italic">Écrit...</span> : partnerOnline ? <span className="text-green-600">En ligne</span> : "Hors ligne"}
          </p>
        </div>
      </div>

      {/* Image preview overlay */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setImagePreview(null)}
          >
            <button className="absolute top-4 right-4 text-white" onClick={() => setImagePreview(null)}>
              <X className="w-6 h-6" />
            </button>
            <img src={imagePreview} alt="Preview" className="max-w-full max-h-full rounded-xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Commencez la conversation</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === currentUserId;
            const isImg = isImageMessage(msg.content);
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex", isOwn ? "justify-end" : "justify-start")}
              >
                {isImg ? (
                  <div className={cn("max-w-[75%] rounded-2xl overflow-hidden cursor-pointer", isOwn ? "rounded-br-md" : "rounded-bl-md")}
                    onClick={() => setImagePreview(getImageUrl(msg.content))}>
                    <img src={getImageUrl(msg.content)} alt="Photo partagée" className="w-full max-h-60 object-cover" loading="lazy" />
                    <div className={cn("px-3 py-1.5", isOwn ? "gradient-primary" : "bg-muted")}>
                      <p className={cn("text-[9px]", isOwn ? "text-white/60" : "text-muted-foreground")}>
                        📷 {new Date(msg.created_at || "").toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        {isOwn && msg.read && " ✓✓"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={cn(
                    "max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm",
                    isOwn
                      ? "gradient-primary text-white rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}>
                    <p className="leading-relaxed">{msg.content}</p>
                    <p className={cn("text-[9px] mt-1", isOwn ? "text-white/60" : "text-muted-foreground")}>
                      {new Date(msg.created_at || "").toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      {isOwn && msg.read && " ✓✓"}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
        {partnerTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 px-3 py-2">
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/30"
                animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input with image button */}
      <div className="px-4 py-3 border-t bg-card">
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            {uploading ? (
              <motion.div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
            ) : (
              <Image className="w-4 h-4 text-muted-foreground" />
            )}
          </motion.button>
          <input
            ref={inputRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Écrire un message..."
            className="flex-1 px-4 py-2.5 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            disabled={sending}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default MessagesTab;
