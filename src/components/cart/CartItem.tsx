
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    updateQuantity(item.id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };
  
  return (
    <div className="flex items-center py-4 border-b">
      <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
        <img 
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <h3 className="text-sm font-medium">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center ml-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="w-10 text-center">{item.quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="ml-6 text-right min-w-[80px]">
        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="ml-2"
        onClick={() => removeItem(item.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
