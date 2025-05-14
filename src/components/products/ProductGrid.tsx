import { Link } from "react-router-dom";

interface Product {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  imageUrl: string | null;
  date_dernier_achat: string | null;
  prediction_rupture: number | null;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="group"
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
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
      ))}
    </div>
  );
};

export default ProductGrid;
