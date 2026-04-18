// Realtime messaging hook with presence & typing indicators
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  booking_id?: string | null;
}

export interface Conversation {
  id: string;
  otherParticipant: {
    id: string;
    first_name: string | null;
    last_name?: string | null;
    avatar_url: string | null;
  } | null;
  lastMessage: {
    content: string;
    created_at: string;
    read: boolean;
    sender_id: string;
  } | null;
  unreadCount: number;
}

interface TypingUser {
  id: string;
  name: string;
  isTyping: boolean;
}

interface OnlineUser {
  id: string;
  lastSeen: Date;
}

export const useRealtimeMessages = (selectedPartnerId?: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingUser>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(new Map());
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const presenceChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Initialize user session
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUserId(session.user.id);
      } else {
        setLoading(false);
      }
    };
    initSession();
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!messagesData || messagesData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Group messages by conversation partner
      const conversationMap = new Map<string, Message[]>();
      messagesData.forEach(msg => {
        const otherId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
        if (!conversationMap.has(otherId)) {
          conversationMap.set(otherId, []);
        }
        conversationMap.get(otherId)!.push(msg);
      });

      // Fetch participant profiles
      const otherIds = Array.from(conversationMap.keys());
      const { data: participantsData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', otherIds);

      const participantMap = new Map(participantsData?.map(p => [p.id, p]) || []);

      const convs: Conversation[] = Array.from(conversationMap.entries()).map(([otherId, msgs]) => {
        const lastMessage = msgs[0];
        const unreadCount = msgs.filter(m => m.receiver_id === currentUserId && !m.read).length;
        
        return {
          id: otherId,
          otherParticipant: participantMap.get(otherId) || null,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            created_at: lastMessage.created_at || new Date().toISOString(),
            read: lastMessage.read || false,
            sender_id: lastMessage.sender_id
          } : null,
          unreadCount
        };
      });

      // Sort by last message date
      convs.sort((a, b) => {
        const dateA = a.lastMessage?.created_at ? new Date(a.lastMessage.created_at).getTime() : 0;
        const dateB = b.lastMessage?.created_at ? new Date(b.lastMessage.created_at).getTime() : 0;
        return dateB - dateA;
      });

      setConversations(convs);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!currentUserId || !partnerId) return;

    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(messagesData || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', currentUserId)
        .eq('sender_id', partnerId);

      // Update conversation unread count
      setConversations(prev => 
        prev.map(conv => 
          conv.id === partnerId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive"
      });
    }
  }, [currentUserId]);

  // Send a message
  const sendMessage = useCallback(async (content: string, receiverId: string, bookingId?: string) => {
    if (!currentUserId || !content.trim()) return { success: false };

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: receiverId,
          content: content.trim(),
          booking_id: bookingId || null
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, message: data };
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
      return { success: false };
    }
  }, [currentUserId]);

  // Start typing indicator
  const startTyping = useCallback((receiverId: string) => {
    if (!currentUserId || !presenceChannelRef.current) return;

    presenceChannelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: currentUserId, receiverId, isTyping: true }
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(receiverId);
    }, 3000);
  }, [currentUserId]);

  // Stop typing indicator
  const stopTyping = useCallback((receiverId: string) => {
    if (!currentUserId || !presenceChannelRef.current) return;

    presenceChannelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: currentUserId, receiverId, isTyping: false }
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [currentUserId]);

  // Realtime messages subscription
  const selectedPartnerIdRef = useRef(selectedPartnerId);
  selectedPartnerIdRef.current = selectedPartnerId;

  useEffect(() => {
    if (!currentUserId) return;

    const messagesChannel = supabase
      .channel('messages-realtime-v2')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${currentUserId}` },
        (payload) => {
          const newMsg = payload.new as Message;
          if (selectedPartnerIdRef.current === newMsg.sender_id) {
            setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg]);
            supabase.from('messages').update({ read: true }).eq('id', newMsg.id);
          }
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${currentUserId}` },
        (payload) => {
          const newMsg = payload.new as Message;
          if (selectedPartnerIdRef.current === newMsg.receiver_id) {
            setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg]);
          }
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          const updatedMsg = payload.new as Message;
          setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
        }
      )
      .subscribe();

    fetchConversations();

    return () => { supabase.removeChannel(messagesChannel); };
  }, [currentUserId, fetchConversations]);

  // Separate presence channel (no presence callbacks after join)
  useEffect(() => {
    if (!currentUserId) return;

    const presenceChannel = supabase
      .channel('messaging-presence')
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { userId, receiverId, isTyping } = payload.payload;
        if (receiverId === currentUserId) {
          setTypingUsers(prev => {
            const newMap = new Map(prev);
            isTyping ? newMap.set(userId, { id: userId, name: '', isTyping: true }) : newMap.delete(userId);
            return newMap;
          });
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const online = new Map<string, OnlineUser>();
        Object.values(state).forEach((users: any) => {
          users.forEach((user: any) => {
            online.set(user.user_id, { id: user.user_id, lastSeen: new Date(user.online_at) });
          });
        });
        setOnlineUsers(online);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        newPresences.forEach((presence: any) => {
          setOnlineUsers(prev => new Map(prev).set(presence.user_id, { id: presence.user_id, lastSeen: new Date(presence.online_at) }));
        });
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        leftPresences.forEach((presence: any) => {
          setOnlineUsers(prev => { const m = new Map(prev); m.delete(presence.user_id); return m; });
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user_id: currentUserId, online_at: new Date().toISOString() });
        }
      });

    presenceChannelRef.current = presenceChannel;

    return () => {
      supabase.removeChannel(presenceChannel);
      presenceChannelRef.current = null;
    };
  }, [currentUserId]);

  // Fetch messages when partner changes
  useEffect(() => {
    if (selectedPartnerId) {
      fetchMessages(selectedPartnerId);
    } else {
      setMessages([]);
    }
  }, [selectedPartnerId, fetchMessages]);

  // Check if a user is typing
  const isUserTyping = useCallback((userId: string) => {
    return typingUsers.has(userId);
  }, [typingUsers]);

  // Check if a user is online
  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  // Get total unread count
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return {
    messages,
    conversations,
    loading,
    currentUserId,
    totalUnreadCount,
    sendMessage,
    fetchConversations,
    fetchMessages,
    startTyping,
    stopTyping,
    isUserTyping,
    isUserOnline
  };
};
