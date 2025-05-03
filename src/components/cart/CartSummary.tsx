
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

const CartSummary = () => {
  const { getTotalPrice } = useCart();
  
  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + shipping;
  
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Order Summary</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3 mt-3 flex justify-between font-medium text-base">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-6">
        <Button asChild className="w-full" disabled={subtotal <= 0}>
          <Link to="/checkout">
            Proceed to Checkout
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="w-full mt-3">
          <Link to="/">
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
