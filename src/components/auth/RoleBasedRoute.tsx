
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/context/AuthContext";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
}

const RoleBasedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = "/auth" 
}: RoleBasedRouteProps) => {
  const { user, userRoles, isLoading } = useAuth();
  
  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Vérifier si l'utilisateur a au moins un des rôles autorisés
  const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
  
  if (!hasRequiredRole) {
    // Rediriger vers la page d'accueil si l'utilisateur n'a pas les permissions
    return <Navigate to="/" replace />;
  }
  
  // Afficher le contenu de la route si l'utilisateur a les permissions
  return <>{children}</>;
};

export default RoleBasedRoute;
