
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

const Navbar = () => {
  const { getTotalItems } = useCart();
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">ShopSimple</Link>
        
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
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/orders" className="text-sm hover:text-gray-600 transition-colors">
                  My Orders
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
