import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilter from "@/components/products/ProductFilter";
import { toast } from "sonner";

interface Product {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  imageUrl: string | null;
  categorie: string | null;
  date_dernier_achat: string | null;
  prediction_rupture: number | null;
}

const Index = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    fetchProducts();
  }, [categoryParam]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("Début de la récupération des produits...");
      
      let query = supabase
        .from("produit")
        .select("*")
        .order("nom");

      if (categoryParam && categoryParam !== "all") {
        query = query.eq("categorie", categoryParam);
        console.log("Filtrage par catégorie:", categoryParam);
      }

      const { data, error } = await query;
      console.log("Réponse de Supabase:", { data, error });

      if (error) throw error;
      
      if (data) {
        console.log("Nombre de produits récupérés:", data.length);
        console.log("Premier produit:", data[0]);
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      toast.error("Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <section className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Notre Collection</h1>
            <p className="text-gray-600 mt-2">Des produits de qualité pour vos besoins quotidiens</p>
          </div>
          
          <ProductFilter />
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">Chargement des produits...</p>
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Aucun produit trouvé dans cette catégorie.</p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
