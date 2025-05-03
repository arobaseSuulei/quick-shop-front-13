
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "@/data/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductPage = () => {
  const { id } = useParams();
  const product = getProductById(Number(id));
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-16 flex-grow">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Go Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    }, quantity);
    
    toast.success(`${product.name} added to cart`);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          
          <div>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-block">
              ← Back to products
            </Link>
            
            <h1 className="text-2xl font-medium">{product.name}</h1>
            <p className="text-xl mt-2">${product.price.toFixed(2)}</p>
            
            <div className="mt-6">
              <h3 className="font-medium text-sm mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="mt-8">
              {product.inStock ? (
                <>
                  <div className="flex items-center mb-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <span className="w-12 text-center">{quantity}</span>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </>
              ) : (
                <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg text-center">
                  <p className="font-medium">Out of Stock</p>
                  <p className="text-sm mt-1">Check back soon!</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center mb-2">
                <span className="font-medium text-sm mr-2">Category:</span>
                <Link 
                  to={`/?category=${product.category}`}
                  className="text-sm text-gray-600 capitalize hover:text-gray-900"
                >
                  {product.category}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
