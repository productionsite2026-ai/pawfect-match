import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, ArrowLeft, Loader2, Search } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_avatar: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
}

const MessagesTab = () => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    if (selectedConversation && currentUserId) {
      fetchMessages(selectedConversation.participant_id);
      supabase.from('messages').update({ read: true }).eq('sender_id', selectedConversation.participant_id).eq('receiver_id', currentUserId);
    }
  }, [selectedConversation, currentUserId]);

  const fetchConversations = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    setCurrentUserId(session.user.id);

    const { data: allMessages } = await supabase.from('messages').select('*').or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`).order('created_at', { ascending: false });
    if (!allMessages?.length) { setLoading(false); return; }

    const conversationMap = new Map<string, { messages: any[]; unread: number }>();
    allMessages.forEach(msg => {
      const partnerId = msg.sender_id === session.user.id ? msg.receiver_id : msg.sender_id;
      if (!conversationMap.has(partnerId)) conversationMap.set(partnerId, { messages: [], unread: 0 });
      conversationMap.get(partnerId)!.messages.push(msg);
      if (msg.receiver_id === session.user.id && !msg.read) conversationMap.get(partnerId)!.unread++;
    });

    const partnerIds = Array.from(conversationMap.keys());
    const { data: profiles } = await supabase.from('profiles').select('id, first_name, last_name, avatar_url').in('id', partnerIds);
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    setConversations(partnerIds.map(partnerId => {
      const { messages, unread } = conversationMap.get(partnerId)!;
      const profile = profileMap.get(partnerId);
      return { id: partnerId, participant_id: partnerId, participant_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Utilisateur' : 'Utilisateur', participant_avatar: profile?.avatar_url || null, last_message: messages[0].content, last_message_time: messages[0].created_at, unread_count: unread };
    }).sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()));
    setLoading(false);
  };

  const fetchMessages = async (partnerId: string) => {
    if (!currentUserId) return;
    const { data } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`).order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUserId) return;
    setSending(true);
    const { data, error } = await supabase.from('messages').insert({ content: newMessage.trim(), sender_id: currentUserId, receiver_id: selectedConversation.participant_id }).select().single();
    if (!error && data) { setMessages(prev => [...prev, data]); setNewMessage(""); }
    else toast({ title: "Erreur", variant: "destructive" });
    setSending(false);
  };

  const formatTime = (d: string) => { const date = new Date(d); const diff = Date.now() - date.getTime(); return diff < 86400000 ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><MessageCircle className="h-6 w-6 text-primary" />Messages</h2>
      <Card className="overflow-hidden shadow-lg h-[600px] flex">
        <AnimatePresence mode="wait">
          {!selectedConversation ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col">
              <div className="p-4 border-b"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div></div>
              <div className="flex-1 overflow-y-auto">
                {conversations.filter(c => c.participant_name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                  <div className="text-center py-16"><MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" /><h3 className="text-xl font-semibold mb-2">Aucune conversation</h3><p className="text-muted-foreground">Réservez une promenade pour démarrer</p></div>
                ) : conversations.filter(c => c.participant_name.toLowerCase().includes(searchQuery.toLowerCase())).map(conv => (
                  <div key={conv.id} onClick={() => setSelectedConversation(conv)} className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer border-b">
                    <Avatar className="h-12 w-12"><AvatarImage src={conv.participant_avatar || undefined} /><AvatarFallback className="bg-primary/10 text-primary">{conv.participant_name.charAt(0)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0"><div className="flex justify-between"><p className="font-semibold truncate">{conv.participant_name}</p><span className="text-xs text-muted-foreground">{formatTime(conv.last_message_time)}</span></div><div className="flex justify-between mt-1"><p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>{conv.unread_count > 0 && <Badge className="bg-primary">{conv.unread_count}</Badge>}</div></div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="w-full flex flex-col">
              <div className="p-4 border-b flex items-center gap-3 bg-muted/30"><Button variant="ghost" size="icon" onClick={() => setSelectedConversation(null)}><ArrowLeft className="h-5 w-5" /></Button><Avatar className="h-10 w-10"><AvatarImage src={selectedConversation.participant_avatar || undefined} /><AvatarFallback className="bg-primary/10 text-primary">{selectedConversation.participant_name.charAt(0)}</AvatarFallback></Avatar><p className="font-semibold">{selectedConversation.participant_name}</p></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">{messages.map(msg => (<div key={msg.id} className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender_id === currentUserId ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}><p>{msg.content}</p><p className={`text-xs mt-1 ${msg.sender_id === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatTime(msg.created_at)}</p></div></div>))}</div>
              <div className="p-4 border-t"><div className="flex gap-2"><Input placeholder="Votre message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} disabled={sending} /><Button onClick={sendMessage} disabled={!newMessage.trim() || sending}>{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button></div></div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default MessagesTab;
