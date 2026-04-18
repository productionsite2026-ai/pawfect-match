import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, lazy, Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { PushNotificationPrompt } from "@/components/notifications/PushNotificationPrompt";
import { AuthProvider } from "@/contexts/AuthContext";

// Critical pages loaded eagerly
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages
const OwnerDashboard = lazy(() => import("./pages/dashboard/OwnerDashboard"));
const WalkerDashboardPage = lazy(() => import("./pages/dashboard/WalkerDashboard"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const BookingDetails = lazy(() => import("./pages/BookingDetails"));
const BookWalk = lazy(() => import("./pages/BookWalk"));
const WalkerRegister = lazy(() => import("./pages/WalkerRegister"));
const Tarifs = lazy(() => import("./pages/Tarifs"));
const Messages = lazy(() => import("./pages/Messages"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const RessourcesLegales = lazy(() => import("./pages/RessourcesLegales"));
const WalkerProfile = lazy(() => import("./pages/WalkerProfile"));
const Support = lazy(() => import("./pages/Support"));
const FindWalkers = lazy(() => import("./pages/FindWalkers"));
const NousSommesPresents = lazy(() => import("./pages/NousSommesPresents"));
const DashboardPreview = lazy(() => import("./pages/DashboardPreview"));
const ServicePromenade = lazy(() => import("./pages/services/ServicePromenade"));
const ServiceGarde = lazy(() => import("./pages/services/ServiceGarde"));
const ServiceVisite = lazy(() => import("./pages/services/ServiceVisite"));
const ServiceDogSitting = lazy(() => import("./pages/services/ServiceDogSitting"));
const ServicePetSitting = lazy(() => import("./pages/services/ServicePetSitting"));
const ServiceMarcheReguliere = lazy(() => import("./pages/services/ServiceMarcheReguliere"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <span className="text-sm text-muted-foreground font-medium">Chargement...</span>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <InstallPrompt />
          <PushNotificationPrompt />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/index" element={<Navigate to="/" replace />} />
              <Route path="/dashboard-preview" element={<DashboardPreview />} />
              <Route path="/services/promenade" element={<ServicePromenade />} />
              <Route path="/services/garde" element={<ServiceGarde />} />
              <Route path="/services/visite" element={<ServiceVisite />} />
              <Route path="/services/garde-domicile" element={<ServiceDogSitting />} />
              <Route path="/services/garde-multi-animaux" element={<ServicePetSitting />} />
              <Route path="/services/marche-reguliere" element={<ServiceMarcheReguliere />} />
              {/* Redirections anciennes URLs anglaises */}
              <Route path="/services/dog-sitting" element={<Navigate to="/services/garde-domicile" replace />} />
              <Route path="/services/pet-sitting" element={<Navigate to="/services/garde-multi-animaux" replace />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              {/* Owner Dashboard */}
              <Route path="/dashboard" element={<ProtectedRoute requiredRole="owner"><OwnerDashboard /></ProtectedRoute>} />
              <Route path="/dashboard-proprietaire" element={<ProtectedRoute requiredRole="owner"><OwnerDashboard /></ProtectedRoute>} />
              <Route path="/mon-espace" element={<ProtectedRoute requiredRole="owner"><OwnerDashboard /></ProtectedRoute>} />
              <Route path="/dogs/add" element={<Navigate to="/dashboard?tab=chiens" replace />} />
              <Route path="/bookings" element={<Navigate to="/dashboard?tab=reservations" replace />} />
              <Route path="/referral" element={<Navigate to="/dashboard?tab=parrainage" replace />} />
              <Route path="/profile" element={<Navigate to="/dashboard?tab=profil" replace />} />
              {/* Walker Dashboard */}
              <Route path="/walker/dashboard" element={<ProtectedRoute requiredRole="walker"><WalkerDashboardPage /></ProtectedRoute>} />
              <Route path="/dashboard-promeneur" element={<ProtectedRoute requiredRole="walker"><WalkerDashboardPage /></ProtectedRoute>} />
              <Route path="/espace-promeneur" element={<ProtectedRoute requiredRole="walker"><WalkerDashboardPage /></ProtectedRoute>} />
              <Route path="/walker/earnings" element={<Navigate to="/walker/dashboard?tab=gains" replace />} />
              {/* Standalone pages */}
              <Route path="/walkers" element={<FindWalkers />} />
              <Route path="/find-walkers" element={<FindWalkers />} />
              <Route path="/nous-sommes-presents" element={<NousSommesPresents />} />
              <Route path="/walker/:walkerId" element={<WalkerProfile />} />
              <Route path="/bookings/:id" element={<BookingDetails />} />
              <Route path="/book/:walkerId" element={<BookWalk />} />
              <Route path="/walker/register" element={<WalkerRegister />} />
              <Route path="/tarifs" element={<Tarifs />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* Support Center (FAQ + About + Contact) */}
              <Route path="/support" element={<Support />} />
              <Route path="/qui-sommes-nous" element={<Navigate to="/support?tab=a-propos" replace />} />
              <Route path="/contact" element={<Navigate to="/support?tab=contact" replace />} />
              <Route path="/aide" element={<Navigate to="/support" replace />} />
              <Route path="/faq" element={<Navigate to="/support" replace />} />
              <Route path="/help" element={<Navigate to="/support" replace />} />
              {/* Legal Resources */}
              <Route path="/ressources-legales" element={<RessourcesLegales />} />
              <Route path="/mentions-legales" element={<Navigate to="/ressources-legales?tab=mentions" replace />} />
              <Route path="/cgu" element={<Navigate to="/ressources-legales?tab=cgu" replace />} />
              <Route path="/confidentialite" element={<Navigate to="/ressources-legales?tab=confidentialite" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
