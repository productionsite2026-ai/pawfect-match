import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, LayoutDashboard, X, MessageCircle, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [hasActiveService, setHasActiveService] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) return;

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", session.user.id)
          .single();
        setUserType(profile?.user_type || null);

        const { data: bookings } = await supabase
          .from("bookings")
          .select("id")
          .or(`owner_id.eq.${session.user.id},walker_id.eq.${session.user.id}`)
          .in("status", ["confirmed", "in_progress"])
          .limit(1);

        setHasActiveService(!!bookings && bookings.length > 0);
      }
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        setUserType(null);
        setHasActiveService(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const dashboardPath = userType === "walker" ? "/walker/dashboard" : "/dashboard";

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-6 right-6 z-50"
      style={{ touchAction: "none" }}
      whileDrag={{ scale: 1.02 }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-card rounded-xl shadow-2xl border p-4 min-w-[220px]"
          >
            <p className="font-semibold mb-3 text-sm">
              {isAuthenticated ? "Mon espace" : "Commencer"}
            </p>
            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigate(dashboardPath)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-sm text-left"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                    </div>
                    <span>Mon Dashboard</span>
                  </button>

                  {hasActiveService && (
                    <button
                      onClick={() => handleNavigate(`${dashboardPath}?tab=messages`)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-sm text-left"
                    >
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-accent" />
                      </div>
                      <span>Messagerie</span>
                    </button>
                  )}

                  {!hasActiveService && (
                    <p className="text-[11px] text-muted-foreground px-2 py-1 bg-muted/50 rounded-lg">
                      💡 La messagerie s'active dès qu'un service est réservé et payé.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate("/auth")}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-sm text-left"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <LogIn className="h-4 w-4 text-primary" />
                    </div>
                    <span>Connexion</span>
                  </button>
                  <button
                    onClick={() => handleNavigate("/auth?type=owner")}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-sm text-left"
                  >
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <UserPlus className="h-4 w-4 text-accent" />
                    </div>
                    <span>S'inscrire</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Home className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};
