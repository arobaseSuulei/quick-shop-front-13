
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + shipping;
  
  // Mock order submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Generate random order ID
      const orderId = Math.floor(100000 + Math.random() * 900000);
      
      clearCart();
      setIsSubmitting(false);
      toast.success("Order placed successfully!");
      navigate(`/order/${orderId}`);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmitOrder}>
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" required />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" required />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" required />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" required />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <h2 className="text-lg font-medium mb-4">Payment Information</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Payment integration will be added later.
                  </p>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </form>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} <span className="text-gray-500">x{item.quantity}</span>
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t mt-4 pt-4 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">You need to add items to your cart before checkout.</p>
            <Button asChild>
              <a href="/">Go to Shop</a>
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
