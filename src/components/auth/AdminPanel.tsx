import { useAuth } from "@/context/AuthContext";
import ProductManagement from "@/components/admin/ProductManagement";

const AdminPanel = () => {
  const { hasRole } = useAuth();

  // Vérification si l'utilisateur est admin
  if (!hasRole("admin")) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Accès non autorisé</h3>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Panneau d'administration</h1>
      <ProductManagement />
    </div>
  );
};

export default AdminPanel;
