import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string | null;
  read: boolean | null;
  created_at: string | null;
  link: string | null;
}

export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { sendLocalNotification, permission } = usePushNotifications();

  const fetchNotifications = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Subscribe to realtime notifications
    const setupRealtimeSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const channel = supabase
        .channel('realtime-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            
            // Add to state
            setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });

            // Fire browser push notification
            if (permission === 'granted') {
              sendLocalNotification(newNotification.title, {
                body: newNotification.message,
                tag: newNotification.type || 'notification',
                data: { link: newNotification.link, type: newNotification.type },
              });
            }

            // Play notification sound
            try {
              const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczHj6NyN/Qu2k8JT2Hw9bQv3xMM0OFwtHOw4FVOUmKxNHMwIBWPEmKxM/JvX1VPEuMyM3FuXlUP1CQy8zDtXVTQFOUzsvBsHJSQViX0svBr3FPQlqa08zBrm5MQWCi18/ArWxKQWWt5NHArGlGP2iy59PBqWRDP3C46tfGplxAPnO87d3Mol5CP3fB8+LMn11BQHrF+OfQnFpAQH7K/ezUmldAQYDP//DYmFY/QYLR//PbllQ+QYTT//XdlFI9QIbV//fflVA8P4XX//nhl009PoXZ//rjlks8PoXZ//vjl0o7PYTa//zkmEk7PYPa//3lmUg6PILb//7nmkc5O4Hb///om0Y5O4Dc///pnEU4OoHc///qnUQ4On/d///snkM3OX7d///tn0I2OX3e///uoEE2OHze///voUA1OH3e///woT81N37e///xoj80N37e///yoz40Nn/e///0pD0zNn/e///1pTwyNoHe///2pjsxNYHe///4pzovNILe///5qDkuNILe///6qTgtM4Pe///7qjcsM4Pf///8qzYrMoPf///+rDUqMYTf///");
              audio.volume = 0.3;
              audio.play().catch(() => {});
            } catch {}
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const unsubscribe = setupRealtimeSubscription();
    
    return () => {
      unsubscribe.then(fn => fn?.());
    };
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', session.user.id)
      .eq('read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (!error) {
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications
  };
};
