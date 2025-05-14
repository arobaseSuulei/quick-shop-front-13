import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.nom,
      price: product.prix,
      image: product.imageUrl || ""
    }, 1);

    toast.success(`${product.nom} ajouté au panier`);
  };

  return (
    <div className="group">
      <Link to={`/product/${product.id}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 group-hover:scale-105">
          {product.imageUrl && (
            <div className="aspect-square overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.nom}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="font-medium text-gray-900 group-hover:text-primary">
              {product.nom}
            </h3>
            <p className="mt-1 text-gray-600">
              {product.prix.toFixed(2)}€
            </p>
            {product.quantite !== null && product.quantite <= 5 && (
              <p className="mt-1 text-sm text-red-600">
                Plus que {product.quantite} en stock !
              </p>
            )}
          </div>
        </div>
      </Link>
      <div className="mt-2">
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
  );
};

export default ProductCard;
