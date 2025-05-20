import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilter from "@/components/products/ProductFilter";
import { toast } from "sonner";
import gsap from "gsap";

interface Product {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  imageUrl: string | null;
  categorie: string | null;
}

const Index = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryParam = searchParams.get("category");

  // Refs pour les sections à animer
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const recycleRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryParam]);

  useEffect(() => {
    // Animation d'apparition fluide des sections
    const sections = [heroRef, aboutRef, recycleRef, howRef, productsRef, ctaRef];
    sections.forEach((ref, i) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.9, delay: 0.2 + i * 0.15, ease: "power3.out" }
        );
      }
    });
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("produit")
        .select("*")
        .order("nom");
      if (categoryParam && categoryParam !== "all") {
        query = query.eq("categorie", categoryParam);
      }
      const { data, error } = await query;
      if (error) throw error;
      setProducts((data || []).map(p => ({ categorie: null, ...p, categorie: p.categorie ?? null })));
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      toast.error("Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar animateLogo />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Hero Section */}
        <section ref={heroRef} className="mb-16 flex flex-col md:flex-row items-center gap-8 bg-white rounded-xl shadow p-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">ElectronikShop, l'e-commerce engagé pour la planète</h1>
            <p className="text-lg text-gray-700 mb-6">Achetez responsable, recyclez malin. Découvrez des produits éco-conçus et participez à la réduction des déchets !</p>
            <a href="#products" className="btn-primary px-6 py-3 rounded font-semibold text-lg">Découvrir la boutique</a>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Recyclage vert" className="rounded-xl shadow-lg w-full max-w-xs object-cover" />
          </div>
        </section>

        {/* Nos produits */}
        <section ref={productsRef} id="products" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-700">Nos produits</h2>
            <p className="text-gray-600 mt-2">Découvrez notre sélection éco-responsable</p>
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

        {/* Qui sommes-nous */}
        <section ref={aboutRef} className="mb-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 flex justify-center order-2 md:order-1">
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" alt="Notre équipe" className="rounded-xl shadow-lg w-full max-w-xs object-cover" />
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Qui sommes-nous ?</h2>
            <p className="text-gray-700 text-lg">ElectronikShop est une équipe passionnée par l'économie circulaire et le développement durable. Nous croyons qu'un e-commerce peut être responsable, transparent et bénéfique pour la planète. Notre mission : rendre le recyclage accessible à tous, tout en proposant des produits de qualité.</p>
          </div>
        </section>

        {/* Engagement recyclage */}
        <section ref={recycleRef} className="mb-16 flex flex-col md:flex-row items-center gap-8 bg-green-50 rounded-xl p-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Notre engagement pour le recyclage</h2>
            <p className="text-gray-700 text-lg mb-4">Chaque produit vendu sur ElectronikShop contribue à la réduction des déchets. Nous privilégions les matériaux recyclés, les emballages éco-responsables et la seconde vie des objets. Ensemble, faisons la différence !</p>
            <ul className="list-disc pl-6 text-green-800">
              <li>Produits issus du recyclage ou recyclables</li>
              <li>Partenariats avec des acteurs locaux du recyclage</li>
              <li>Programme de reprise et de revalorisation</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" alt="Recyclage" className="rounded-xl shadow-lg w-full max-w-xs object-cover" />
          </div>
        </section>

        {/* Comment ça marche */}
        <section ref={howRef} className="mb-16">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/2909/2909769.png" alt="Choisissez" className="w-20 h-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-green-700">1. Je choisis</h3>
              <p className="text-gray-700 text-center">Parcourez notre sélection de produits éco-responsables et trouvez ce qu'il vous faut.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Commande" className="w-20 h-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-green-700">2. Je commande</h3>
              <p className="text-gray-700 text-center">Commandez en toute simplicité, nous préparons votre colis avec soin et dans le respect de l'environnement.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" alt="Recyclez" className="w-20 h-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-green-700">3. Je recycle</h3>
              <p className="text-gray-700 text-center">Profitez de nos solutions de recyclage et de reprise pour donner une seconde vie à vos produits.</p>
            </div>
          </div>
        </section>

        {/* Appel à l'action */}
        <section ref={ctaRef} className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Rejoignez le mouvement ElectronikShop !</h2>
          <p className="text-lg text-gray-700 mb-6">Ensemble, consommons mieux et recyclons plus. Découvrez nos produits ou contactez-nous pour en savoir plus sur notre démarche.</p>
          <a href="#products" className="btn-primary px-8 py-3 rounded font-semibold text-lg">Voir la boutique</a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
