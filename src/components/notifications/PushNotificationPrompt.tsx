import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { getSafeLocalStorage } from '@/lib/safeStorage';

const DISMISSED_KEY = 'dogwalking_push_dismissed';

export const PushNotificationPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isSupported, permission, requestPermission } = usePushNotifications();

  useEffect(() => {
    // Only show if supported, not already granted/denied, and not previously dismissed
    const storage = getSafeLocalStorage();
    const dismissed = storage.getItem(DISMISSED_KEY);
    
    if (isSupported && permission === 'default' && !dismissed) {
      // Delay showing the prompt
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleEnable = async () => {
    await requestPermission();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    const storage = getSafeLocalStorage();
    storage.setItem(DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <Card className="border-primary/30 shadow-xl bg-gradient-to-br from-background to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    Activer les notifications ?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Recevez des alertes pour les réservations, messages et mises à jour de missions.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleEnable}
                      className="flex-1"
                    >
                      Activer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleDismiss}
                      className="px-3"
                    >
                      Plus tard
                    </Button>
                  </div>
                </div>
                <button 
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PushNotificationPrompt;
