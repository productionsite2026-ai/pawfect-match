import { useEffect, useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission | 'default';
  isSubscribed: boolean;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false
  });

  useEffect(() => {
    // Check browser support
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    
    if (isSupported) {
      setState(prev => ({
        ...prev,
        isSupported: true,
        permission: Notification.permission
      }));
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      toast({
        title: "Non supporté",
        description: "Les notifications push ne sont pas supportées par votre navigateur.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      setState(prev => ({ ...prev, permission }));

      if (permission === 'granted') {
        toast({
          title: "Notifications activées",
          description: "Vous recevrez les notifications de DogWalking."
        });
        return true;
      } else if (permission === 'denied') {
        toast({
          title: "Notifications refusées",
          description: "Vous pouvez les activer dans les paramètres de votre navigateur.",
          variant: "destructive"
        });
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [state.isSupported]);

  const sendLocalNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (state.permission !== 'granted') {
      console.log('Notifications not permitted');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options?.data?.link) {
          window.location.href = options.data.link;
        }
      };

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [state.permission]);

  const notifyMissionStart = useCallback((dogName: string, walkerName: string) => {
    sendLocalNotification(
      `🐕 Promenade démarrée !`,
      {
        body: `${walkerName} a pris en charge ${dogName}. Photo de départ reçue.`,
        tag: 'mission-start',
        data: { link: '/dashboard?tab=bookings' }
      }
    );
  }, [sendLocalNotification]);

  const notifyMissionEnd = useCallback((dogName: string, walkerName: string) => {
    sendLocalNotification(
      `✅ Promenade terminée !`,
      {
        body: `${walkerName} a ramené ${dogName}. Consultez le rapport de mission.`,
        tag: 'mission-end',
        data: { link: '/dashboard?tab=bookings' }
      }
    );
  }, [sendLocalNotification]);

  const notifyNewBooking = useCallback((ownerName: string, dogName: string, date: string) => {
    sendLocalNotification(
      `📅 Nouvelle demande de réservation`,
      {
        body: `${ownerName} souhaite réserver une promenade pour ${dogName} le ${date}.`,
        tag: 'new-booking',
        data: { link: '/walker-dashboard?tab=missions' }
      }
    );
  }, [sendLocalNotification]);

  const notifyBookingConfirmed = useCallback((walkerName: string, date: string) => {
    sendLocalNotification(
      `🎉 Réservation confirmée !`,
      {
        body: `${walkerName} a accepté votre réservation pour le ${date}.`,
        tag: 'booking-confirmed',
        data: { link: '/dashboard?tab=bookings' }
      }
    );
  }, [sendLocalNotification]);

  const notifyNewMessage = useCallback((senderName: string) => {
    sendLocalNotification(
      `💬 Nouveau message`,
      {
        body: `${senderName} vous a envoyé un message.`,
        tag: 'new-message',
        data: { link: '/messages' }
      }
    );
  }, [sendLocalNotification]);

  const notifyProofReceived = useCallback((dogName: string, proofType: 'start' | 'end') => {
    const title = proofType === 'start' 
      ? `📸 Photo de prise en charge reçue`
      : `📸 Photo de fin de mission reçue`;
    
    sendLocalNotification(title, {
      body: `Nouvelle preuve visuelle pour la promenade de ${dogName}.`,
      tag: `proof-${proofType}`,
      data: { link: '/dashboard?tab=bookings' }
    });
  }, [sendLocalNotification]);

  return {
    ...state,
    requestPermission,
    sendLocalNotification,
    notifyMissionStart,
    notifyMissionEnd,
    notifyNewBooking,
    notifyBookingConfirmed,
    notifyNewMessage,
    notifyProofReceived
  };
};
