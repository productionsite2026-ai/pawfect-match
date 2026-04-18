import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);

  // Check if app is installed
  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    checkInstalled();
    window.matchMedia("(display-mode: standalone)").addEventListener("change", checkInstalled);
  }, []);

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Listen for app installed
  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast({
        title: "Application installée !",
        description: "DogWalking est maintenant disponible sur votre écran d'accueil."
      });
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connexion rétablie",
        description: "Vous êtes de nouveau en ligne."
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Mode hors ligne",
        description: "Certaines fonctionnalités peuvent être limitées.",
        variant: "destructive"
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Install app
  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      toast({
        title: "Installation non disponible",
        description: "Utilisez le menu de votre navigateur pour installer l'application.",
        variant: "destructive"
      });
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsInstallable(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error installing app:", error);
      return false;
    }
  }, [deferredPrompt]);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!("serviceWorker" in navigator)) {
      console.log("Service workers not supported");
      return null;
    }

    const shouldDisableInEditorPreview =
      !import.meta.env.PROD || window.location.hostname.endsWith("lovableproject.com");

    if (shouldDisableInEditorPreview) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));

        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
        }
      } catch (error) {
        console.warn("Service worker cleanup skipped:", error);
      }

      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/"
      });

      console.log("Service worker registered:", registration.scope);

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              toast({
                title: "Mise à jour disponible",
                description: "Rechargez la page pour appliquer la mise à jour.",
                action: (
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md"
                  >
                    Recharger
                  </button>
                )
              });
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error("Service worker registration failed:", error);
      return null;
    }
  }, []);

  // Request push notification permission
  const requestPushPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications non supportées",
        description: "Votre navigateur ne supporte pas les notifications push.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        toast({
          title: "Notifications activées",
          description: "Vous recevrez les notifications importantes."
        });
        return true;
      } else {
        toast({
          title: "Notifications refusées",
          description: "Vous pouvez les activer plus tard dans les paramètres.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async (publicKey: string) => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await (registration as any).pushManager?.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      setPushSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error("Error subscribing to push:", error);
      return null;
    }
  }, []);

  // Send a local notification
  const sendNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (!("Notification" in window)) return false;
    
    if (Notification.permission !== "granted") {
      const granted = await requestPushPermission();
      if (!granted) return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        ...options
      });
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }, [requestPushPermission]);

  return {
    isInstallable,
    isInstalled,
    isOnline,
    pushSubscription,
    installApp,
    registerServiceWorker,
    requestPushPermission,
    subscribeToPush,
    sendNotification
  };
};

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray.buffer as ArrayBuffer;
}