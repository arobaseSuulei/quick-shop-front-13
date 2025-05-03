
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

const CartPage = () => {
  const { items } = useCart();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <div>
              <CartSummary />
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-6">
              <ShoppingCart className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild>
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
