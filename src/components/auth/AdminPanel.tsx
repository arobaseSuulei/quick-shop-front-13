
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Role } from "@/context/AuthContext";

interface UserProfile {
  id: string;
  email: string;
  nom: string;
  roles: Role[];
}

const AdminPanel = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleChanges, setRoleChanges] = useState<Record<Role, boolean>>({
    client: false,
    employe: false,
    admin: false,
    fournisseur: false,
  });

  // Vérification si l'utilisateur est admin
  if (!hasRole("admin")) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Accès non autorisé</h3>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Récupérer les profils utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, nom");
        
      if (profilesError) throw profilesError;
      
      // Pour chaque profil, récupérer ses rôles
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roles, error: rolesError } = await supabase.rpc(
            "get_user_roles",
            { user_uuid: profile.id }
          );
          
          if (rolesError) {
            console.error(`Erreur lors de la récupération des rôles pour ${profile.id}:`, rolesError);
            return { ...profile, roles: [] };
          }
          
          return {
            ...profile,
            roles: roles as Role[],
          };
        })
      );
      
      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };
  
  const openUserDialog = (user: UserProfile) => {
    setSelectedUser(user);
    
    // Initialiser les cases à cocher basées sur les rôles actuels de l'utilisateur
    const initialRoleState = {
      client: user.roles.includes("client"),
      employe: user.roles.includes("employe"),
      admin: user.roles.includes("admin"),
      fournisseur: user.roles.includes("fournisseur"),
    };
    
    setRoleChanges(initialRoleState);
    setDialogOpen(true);
  };
  
  const handleRoleChange = (role: Role, checked: boolean) => {
    setRoleChanges((prev) => ({
      ...prev,
      [role]: checked,
    }));
  };
  
  const saveRoleChanges = async () => {
    if (!selectedUser) return;
    
    try {
      const rolesToAdd: Role[] = [];
      const rolesToRemove: Role[] = [];
      
      // Déterminer les rôles à ajouter et à supprimer
      (Object.entries(roleChanges) as [Role, boolean][]).forEach(([role, isChecked]) => {
        const hasRole = selectedUser.roles.includes(role as Role);
        
        if (isChecked && !hasRole) {
          rolesToAdd.push(role as Role);
        } else if (!isChecked && hasRole) {
          rolesToRemove.push(role as Role);
        }
      });
      
      // Ajouter des rôles
      for (const role of rolesToAdd) {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: selectedUser.id, role });
          
        if (error) throw error;
      }
      
      // Supprimer des rôles
      for (const role of rolesToRemove) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", selectedUser.id)
          .eq("role", role);
          
        if (error) throw error;
      }
      
      toast.success("Rôles mis à jour avec succès.");
      setDialogOpen(false);
      fetchUsers(); // Recharger la liste des utilisateurs
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour des rôles:", error);
      toast.error("Erreur lors de la mise à jour des rôles.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Panneau d'administration</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4">Chargement des utilisateurs...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôles
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.nom || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <span 
                                key={role} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {role}
                              </span>
                            ))}
                            {user.roles.length === 0 && "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => openUserDialog(user)}
                          >
                            Gérer les rôles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gérer les rôles de l'utilisateur</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={selectedUser.email} disabled />
              </div>
              
              <div className="space-y-4">
                <Label>Rôles</Label>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="client" 
                      checked={roleChanges.client}
                      onCheckedChange={(checked) => handleRoleChange("client", checked as boolean)}
                    />
                    <label
                      htmlFor="client"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Client
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="employe" 
                      checked={roleChanges.employe}
                      onCheckedChange={(checked) => handleRoleChange("employe", checked as boolean)}
                    />
                    <label
                      htmlFor="employe"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Employé
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin" 
                      checked={roleChanges.admin}
                      onCheckedChange={(checked) => handleRoleChange("admin", checked as boolean)}
                    />
                    <label
                      htmlFor="admin"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Administrateur
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fournisseur" 
                      checked={roleChanges.fournisseur}
                      onCheckedChange={(checked) => handleRoleChange("fournisseur", checked as boolean)}
                    />
                    <label
                      htmlFor="fournisseur"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Fournisseur
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={saveRoleChanges}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
