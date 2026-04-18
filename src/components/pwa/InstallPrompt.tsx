import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone, Bell, Wifi, WifiOff } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import { getSafeLocalStorage } from "@/lib/safeStorage";

export const InstallPrompt: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);
  
  const {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    registerServiceWorker,
    requestPushPermission
  } = usePWA();

  // Register service worker on mount
  useEffect(() => {
    // In some sandboxed contexts (e.g. preview iframes), SW registration can be denied.
    void registerServiceWorker().catch(() => {});
  }, [registerServiceWorker]);

  // Check if prompt was dismissed before
  useEffect(() => {
    const storage = getSafeLocalStorage();
    const dismissedAt = storage.getItem("pwa-prompt-dismissed");
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const now = new Date();
      // Show again after 7 days
      if (now.getTime() - dismissedDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
      }
    }
  }, []);

  // Show offline indicator briefly
  useEffect(() => {
    if (!isOnline) {
      setShowOfflineIndicator(true);
    } else {
      const timeout = setTimeout(() => setShowOfflineIndicator(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isOnline]);

  const handleDismiss = () => {
    setDismissed(true);
    getSafeLocalStorage().setItem("pwa-prompt-dismissed", new Date().toISOString());
  };

  const handleInstall = async () => {
    try {
      const success = await installApp();
      if (success) {
        // Ask for notification permission after install
        await requestPushPermission();
      }
    } catch {
      // Swallow any unexpected browser permission errors in sandboxed contexts.
    }
  };

  // Offline indicator
  if (showOfflineIndicator) {
    return (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground px-4 py-2"
      >
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
          <WifiOff className="h-4 w-4" />
          <span>Mode hors ligne - Certaines fonctionnalités sont limitées</span>
        </div>
      </motion.div>
    );
  }

  // Don't show if installed, dismissed, or not installable
  if (isInstalled || dismissed || !isInstallable) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
      >
        <div className="bg-card border shadow-lg rounded-xl p-4 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
          
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-4 relative">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">
                Installer DogWalking
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Accès rapide, notifications et fonctionnement hors ligne.
              </p>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Installer
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                >
                  Plus tard
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bell className="h-3.5 w-3.5" />
              <span>Notifications</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="h-3.5 w-3.5" />
              <span>Mode hors ligne</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;