import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Conversation } from "@/hooks/useRealtimeMessages";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  isOnline: boolean;
  isTyping: boolean;
  currentUserId: string | null;
  onClick: () => void;
  index: number;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  isOnline,
  isTyping,
  currentUserId,
  onClick,
  index
}) => {
  const formatTime = (date: string) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return msgDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return msgDate.toLocaleDateString('fr-FR', { weekday: 'short' });
    }
    return msgDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "p-4 cursor-pointer transition-all duration-200",
        isSelected 
          ? "bg-primary/10 border-l-4 border-l-primary" 
          : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={conversation.otherParticipant?.avatar_url || ''} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {conversation.otherParticipant?.first_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          
          {/* Online indicator */}
          {isOnline && (
            <motion.span 
              className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          )}
          
          {/* Unread badge */}
          {conversation.unreadCount > 0 && (
            <motion.span 
              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </motion.span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={cn(
              "font-semibold truncate",
              conversation.unreadCount > 0 && "text-foreground"
            )}>
              {conversation.otherParticipant?.first_name || 'Utilisateur'}
            </p>
            {conversation.lastMessage && (
              <span className="text-xs text-muted-foreground">
                {formatTime(conversation.lastMessage.created_at)}
              </span>
            )}
          </div>
          
          {isTyping ? (
            <p className="text-sm text-primary italic">
              Écrit...
            </p>
          ) : conversation.lastMessage ? (
            <p className={cn(
              "text-sm truncate",
              conversation.unreadCount > 0 
                ? "text-foreground font-medium" 
                : "text-muted-foreground"
            )}>
              {conversation.lastMessage.sender_id === currentUserId && (
                <span className="text-primary">Vous: </span>
              )}
              {conversation.lastMessage.content}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Nouvelle conversation
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationItem;
