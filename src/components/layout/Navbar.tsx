import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import UserProfileButton from "@/components/auth/UserProfileButton";

const Navbar = () => {
  const { getTotalItems } = useCart();
  const { user, hasRole } = useAuth();
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-green-700">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="14" cy="14" rx="13" ry="13" fill="#27ae60"/>
            <path d="M10 18C10 13 18 10 18 10C18 15 12 18 10 18Z" fill="#eafaf1"/>
          </svg>
          ElectronikShop
        </Link>
        
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className="text-sm hover:text-gray-600 transition-colors">
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/?category=electronics" className="text-sm hover:text-gray-600 transition-colors">
                  Electronics
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/?category=home" className="text-sm hover:text-gray-600 transition-colors">
                  Home & Living
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/?category=accessories" className="text-sm hover:text-gray-600 transition-colors">
                  Accessories
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            {user && hasRole('admin') && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/admin" className="text-sm hover:text-gray-600 transition-colors">
                    Administration
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            
            {user && (hasRole('admin') || hasRole('employe') || hasRole('fournisseur')) && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/group-chat" className="text-sm hover:text-gray-600 transition-colors">
                    Messagerie
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>
          
          <UserProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
