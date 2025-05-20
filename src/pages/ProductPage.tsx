import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface Product {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  imageUrl: string | null;
  date_dernier_achat: string | null;
  prediction_rupture: number | null;
}

interface Review {
  id: number;
  note: number;
  commentaire: string;
  client_id: string;
  produit_id: number;
}

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { user, userRoles } = useAuth();
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const isClient = user && userRoles.includes("client");

  useEffect(() => {
    fetchProduct();
    if (id) {
      fetchReviews();
    }
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

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("avis")
        .select("*")
        .eq("produit_id", parseInt(id || "0"));

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des avis:", error);
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
      
      {/* Section des avis */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Avis clients</h2>
        
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.note ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.commentaire}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Aucun avis pour ce produit pour le moment.
          </p>
        )}
      </section>
      
      {/* Formulaire d'avis client */}
      {isClient && product && (
        <section className="container mx-auto px-4 py-8 max-w-xl">
          <h2 className="text-lg font-semibold mb-2">Laisser un avis</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                // Vérifier si l'utilisateur existe dans la table client
                const { data: existingClient, error: clientCheckError } = await supabase
                  .from('client')
                  .select('id')
                  .eq('id', user.id)
                  .single();

                if (clientCheckError && clientCheckError.code !== 'PGRST116') {
                  throw clientCheckError;
                }

                // Si l'utilisateur n'existe pas dans la table client, le créer
                if (!existingClient) {
                  const { error: insertClientError } = await supabase
                    .from('client')
                    .insert([{
                      id: user.id,
                      adresse: null
                    }]);
                  
                  if (insertClientError) {
                    throw insertClientError;
                  }
                }

                // Ajouter l'avis
                const { error } = await supabase.from("avis").insert([
                  {
                    client_id: user.id,
                    produit_id: product.id,
                    note,
                    commentaire,
                  },
                ]);
                if (error) throw error;
                toast.success("Merci pour votre avis !");
                setNote(5);
                setCommentaire("");
                // Rafraîchir la liste des avis
                await fetchReviews();
              } catch (error) {
                console.error("Erreur détaillée:", error);
                toast.error("Erreur lors de l'envoi de l'avis.");
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="space-y-4 bg-white rounded shadow p-4 mt-8"
          >
            <div>
              <label className="block mb-1 font-medium">Note</label>
              <select
                className="border rounded px-2 py-1"
                value={note}
                onChange={(e) => setNote(Number(e.target.value))}
                required
              >
                {[5,4,3,2,1].map((n) => (
                  <option key={n} value={n}>{n} / 5</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Commentaire</label>
              <textarea
                className="border rounded px-2 py-1 w-full"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows={3}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Envoi..." : "Envoyer mon avis"}
            </Button>
          </form>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default ProductPage;
