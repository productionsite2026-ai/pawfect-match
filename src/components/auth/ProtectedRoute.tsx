import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "owner" | "walker" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  // Role check (soft — allows 'both' to access either)
  if (requiredRole && requiredRole !== "admin" && profile?.user_type) {
    if (profile.user_type !== requiredRole && profile.user_type !== "both") {
      return <Navigate to={profile.user_type === "walker" ? "/walker/dashboard" : "/dashboard"} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
