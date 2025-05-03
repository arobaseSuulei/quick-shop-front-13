
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    
    toast.success(`${product.name} added to cart`);
  };
  
  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group"
    >
      <div className="overflow-hidden rounded-md bg-gray-100 aspect-square">
        <img 
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="flex justify-between items-start mt-4">
        <div>
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-600">
            ${product.price.toFixed(2)}
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </div>
      
      {!product.inStock && (
        <span className="mt-2 inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
          Out of stock
        </span>
      )}
    </Link>
  );
};

export default ProductCard;
