import { useEffect, useState, useRef, useCallback } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, Send, Search, 
  ArrowLeft, Phone, Video, MoreVertical, Smile
} from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";
import { useRealtimeMessages, Conversation } from "@/hooks/useRealtimeMessages";
import { useMessageGuard } from "@/hooks/useMessageGuard";
import { MessageBubble, TypingIndicator, ConversationItem } from "@/components/messaging";
import { cn } from "@/lib/utils";
import { ShieldCheck, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    conversations,
    loading,
    currentUserId,
    sendMessage: sendMessageHook,
    startTyping,
    stopTyping,
    isUserTyping,
    isUserOnline
  } = useRealtimeMessages(selectedConversation?.otherParticipant?.id);

  // Anti-fraude (CDC §4.3) : restriction messagerie tant qu'aucun paiement séquestré
  const { hasConfirmedBooking, prewrittenMessages } = useMessageGuard(
    selectedConversation?.otherParticipant?.id
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!currentUserId && !loading) {
      navigate('/auth');
    }
  }, [currentUserId, loading, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle URL state for direct conversation selection
  useEffect(() => {
    if (location.state?.selectedWalkerId && conversations.length > 0) {
      const conv = conversations.find(c => c.otherParticipant?.id === location.state.selectedWalkerId);
      if (conv) {
        setSelectedConversation(conv);
        setShowMobileChat(true);
      }
    }
  }, [location.state, conversations]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowMobileChat(true);
    // Focus input on desktop
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleBack = () => {
    setShowMobileChat(false);
    setSelectedConversation(null);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation?.otherParticipant?.id) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    // Stop typing indicator
    stopTyping(selectedConversation.otherParticipant.id);

    const { success } = await sendMessageHook(
      messageContent, 
      selectedConversation.otherParticipant.id
    );

    if (!success) {
      setNewMessage(messageContent); // Restore message on error
    }

    setSendingMessage(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Trigger typing indicator
    if (selectedConversation?.otherParticipant?.id && e.target.value) {
      startTyping(selectedConversation.otherParticipant.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipant?.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPartnerId = selectedConversation?.otherParticipant?.id;
  const isPartnerTyping = selectedPartnerId ? isUserTyping(selectedPartnerId) : false;
  const isPartnerOnline = selectedPartnerId ? isUserOnline(selectedPartnerId) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center h-64">
            <motion.div 
              className="rounded-full h-8 w-8 border-b-2 border-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Messagerie Sécurisée | DogWalking"
        description="Communiquez avec vos Accompagnateurs Certifiés en temps réel. Messagerie sécurisée DogWalking pour organiser vos prestations."
        canonical="https://dogwalking.fr/messages"
        noindex
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <motion.h1 
          className="text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mes Messages
        </motion.h1>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Conversations List */}
          <Card className={cn(
            "md:col-span-1 overflow-hidden shadow-card",
            showMobileChat && "hidden md:block"
          )}>
            <CardHeader className="pb-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredConversations.length === 0 ? (
                  <motion.div 
                    className="text-center py-12 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Aucune conversation</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Vos conversations avec les Accompagnateurs Certifiés apparaîtront ici
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/walkers')}
                    >
                      Trouver un Accompagnateur
                    </Button>
                  </motion.div>
                ) : (
                  <div className="divide-y">
                    <AnimatePresence>
                      {filteredConversations.map((conv, index) => (
                        <ConversationItem
                          key={conv.id}
                          conversation={conv}
                          isSelected={selectedConversation?.id === conv.id}
                          isOnline={isUserOnline(conv.id)}
                          isTyping={isUserTyping(conv.id)}
                          currentUserId={currentUserId}
                          onClick={() => handleSelectConversation(conv)}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className={cn(
            "md:col-span-2 flex flex-col overflow-hidden shadow-card",
            !showMobileChat && "hidden md:flex"
          )}>
            <AnimatePresence mode="wait">
              {selectedConversation ? (
                <motion.div
                  key="conversation"
                  className="flex flex-col h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Conversation Header */}
                  <CardHeader className="border-b pb-4 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="md:hidden"
                          onClick={handleBack}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedConversation.otherParticipant?.avatar_url || ''} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {selectedConversation.otherParticipant?.first_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          {isPartnerOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {selectedConversation.otherParticipant?.first_name || 'Utilisateur'}
                          </p>
                          <p className={cn(
                            "text-xs flex items-center gap-1",
                            isPartnerOnline ? "text-green-600" : "text-muted-foreground"
                          )}>
                            {isPartnerTyping ? (
                              <span className="text-primary italic">Écrit...</span>
                            ) : isPartnerOnline ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                En ligne
                              </>
                            ) : (
                              'Hors ligne'
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages List */}
                  <ScrollArea className="flex-1 p-4 bg-muted/10">
                    <div className="space-y-4">
                      {messages.map((msg, index) => (
                        <MessageBubble 
                          key={msg.id || index}
                          content={msg.content}
                          timestamp={msg.created_at}
                          isOwn={msg.sender_id === currentUserId}
                        />
                      ))}
                      {isPartnerTyping && <TypingIndicator />}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input — restreint avant paiement (CDC §4.3) */}
                  <div className="p-4 border-t bg-background">
                    {!hasConfirmedBooking ? (
                      <div className="max-w-4xl mx-auto space-y-3">
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                          <Lock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-amber-800 dark:text-amber-200">
                            <strong>Messagerie sécurisée DogWalking.</strong> Tant qu'aucune réservation
                            n'est confirmée, seuls les messages pré-enregistrés sont autorisés. Cela
                            protège les deux parties contre la fraude.
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {prewrittenMessages.map((msg) => (
                            <Button
                              key={msg}
                              variant="outline"
                              size="sm"
                              className="text-xs h-auto py-1.5"
                              disabled={sendingMessage}
                              onClick={async () => {
                                if (!selectedConversation?.otherParticipant?.id) return;
                                setSendingMessage(true);
                                await sendMessageHook(msg, selectedConversation.otherParticipant.id);
                                setSendingMessage(false);
                              }}
                            >
                              {msg}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2 max-w-4xl mx-auto">
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <ShieldCheck className="h-3 w-3" /> Conversation sécurisée — paiement séquestré
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 max-w-4xl mx-auto">
                          <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0">
                            <Smile className="h-5 w-5" />
                          </Button>
                          <Input
                            ref={inputRef}
                            placeholder="Votre message..."
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="flex-1"
                            disabled={sendingMessage}
                          />
                          <Button
                            size="icon"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || sendingMessage}
                            className="shrink-0 shadow-lg shadow-primary/20"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  className="flex flex-col items-center justify-center h-full text-center p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                    <MessageCircle className="h-10 w-10 text-primary opacity-40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Vos Messages Sécurisés</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Sélectionnez une conversation pour discuter avec un Accompagnateur Certifié et organiser votre prestation.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </main>
      
      <FloatingContact />
      <Footer />
    </div>
  );
};

export default Messages;
