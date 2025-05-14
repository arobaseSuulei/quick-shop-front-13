import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Product {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  imageUrl: string | null;
  date_dernier_achat: string | null;
  prediction_rupture: number | null;
}

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("produit")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      toast.error("Impossible de charger le produit.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity < 1) return;
    if (product && product.quantite !== null && newQuantity > product.quantite) {
      toast.error("Quantité non disponible en stock");
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.nom,
      price: product.prix,
      image: product.imageUrl || ""
    }, quantity);

    toast.success(`${product.nom} ajouté au panier`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-16 flex-grow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Chargement du produit...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-16 flex-grow">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">Produit non trouvé</h1>
            <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas.</p>
            <Button asChild>
              <Link to="/">Retour à la boutique</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl}
                alt={product.nom}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-gray-500">Pas d'image disponible</p>
              </div>
            )}
          </div>
          
          <div>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-block">
              ← Retour aux produits
            </Link>
            
            <h1 className="text-2xl font-medium">{product.nom}</h1>
            <p className="text-xl mt-2">{product.prix.toFixed(2)}€</p>
            
            {product.quantite !== null && product.quantite <= 5 && (
              <p className="mt-2 text-red-600">
                Plus que {product.quantite} en stock !
              </p>
            )}
            
            <div className="mt-6 space-y-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="text-lg font-medium">{quantity}</span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={product.quantite !== null && quantity >= product.quantite}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.quantite !== null && product.quantite < 1}
              >
                {product.quantite !== null && product.quantite < 1 ? (
                  "Rupture de stock"
                ) : (
                  "Ajouter au panier"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
