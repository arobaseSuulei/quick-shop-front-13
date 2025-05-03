
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/context/AuthContext";

const roleColors = {
  client: "bg-blue-100 text-blue-800",
  employe: "bg-green-100 text-green-800",
  admin: "bg-red-100 text-red-800",
  fournisseur: "bg-amber-100 text-amber-800",
};

const roleFrench = {
  client: "Client",
  employe: "Employé",
  admin: "Administrateur",
  fournisseur: "Fournisseur",
};

interface UserRoleProps {
  role?: Role;
}

const UserRole = ({ role }: UserRoleProps) => {
  const { userRoles } = useAuth();
  const rolesToDisplay = role ? [role] : userRoles;
  
  return (
    <div className="flex flex-wrap gap-2">
      {rolesToDisplay.map((userRole) => (
        <Badge 
          key={userRole} 
          className={roleColors[userRole]}
          variant="outline"
        >
          {roleFrench[userRole]}
        </Badge>
      ))}
    </div>
  );
};

export default UserRole;
