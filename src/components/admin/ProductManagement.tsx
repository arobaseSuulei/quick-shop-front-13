import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface Product {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  imageUrl: string | null;
  categorie: string | null;
}

interface ProductFormData {
  nom: string;
  prix: string;
  quantite: string;
  imageUrl: string;
  categorie: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    nom: "",
    prix: "",
    quantite: "",
    imageUrl: "",
    categorie: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("produit")
        .select("*")
        .order("nom");
      if (error) throw error;
      setProducts((data || []).map(p => ({ categorie: null, ...p, categorie: p.categorie ?? null })));
    } catch (error) {
      toast.error("Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ nom: "", prix: "", quantite: "", imageUrl: "", categorie: "" });
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        nom: formData.nom,
        prix: parseFloat(formData.prix),
        quantite: parseInt(formData.quantite),
        imageUrl: formData.imageUrl || null,
        categorie: formData.categorie || null,
      };
      const { error } = await supabase.from("produit").insert([productData]);
      if (error) throw error;
      toast.success("Produit ajouté avec succès!");
      setIsAddDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du produit.");
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    try {
      const productData = {
        nom: formData.nom,
        prix: parseFloat(formData.prix),
        quantite: parseInt(formData.quantite),
        imageUrl: formData.imageUrl || null,
        categorie: formData.categorie || null,
      };
      const { error } = await supabase.from("produit").update(productData).eq("id", selectedProduct.id);
      if (error) throw error;
      toast.success("Produit mis à jour avec succès!");
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du produit.");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    try {
      const { error } = await supabase.from("produit").delete().eq("id", productId);
      if (error) throw error;
      toast.success("Produit supprimé avec succès!");
      fetchProducts();
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit.");
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      nom: product.nom,
      prix: product.prix.toString(),
      quantite: product.quantite?.toString() || "0",
      imageUrl: product.imageUrl || "",
      categorie: product.categorie || "",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Produits</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Ajouter un produit
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Chargement des produits...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.nom} className="w-full h-48 object-cover rounded-md" />
              )}
              <h3 className="text-lg font-semibold">{product.nom}</h3>
              <div className="space-y-2">
                <p>Prix: {product.prix}€</p>
                <p>Stock: {product.quantite || 0}</p>
                {product.categorie && <p>Catégorie: {product.categorie}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Dialog d'ajout de produit */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom du produit</Label>
              <Input id="nom" name="nom" value={formData.nom} onChange={handleInputChange} placeholder="Nom du produit" />
            </div>
            <div>
              <Label htmlFor="prix">Prix (€)</Label>
              <Input id="prix" name="prix" type="number" step="0.01" value={formData.prix} onChange={handleInputChange} placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="quantite">Quantité en stock</Label>
              <Input id="quantite" name="quantite" type="number" value={formData.quantite} onChange={handleInputChange} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="imageUrl">URL de l'image</Label>
              <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://..." />
            </div>
            <div>
              <Label htmlFor="categorie">Catégorie</Label>
              <Input id="categorie" name="categorie" value={formData.categorie} onChange={handleInputChange} placeholder="Catégorie du produit" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddProduct}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog de modification de produit */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-nom">Nom du produit</Label>
              <Input id="edit-nom" name="nom" value={formData.nom} onChange={handleInputChange} placeholder="Nom du produit" />
            </div>
            <div>
              <Label htmlFor="edit-prix">Prix (€)</Label>
              <Input id="edit-prix" name="prix" type="number" step="0.01" value={formData.prix} onChange={handleInputChange} placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="edit-quantite">Quantité en stock</Label>
              <Input id="edit-quantite" name="quantite" type="number" value={formData.quantite} onChange={handleInputChange} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="edit-imageUrl">URL de l'image</Label>
              <Input id="edit-imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://..." />
            </div>
            <div>
              <Label htmlFor="edit-categorie">Catégorie</Label>
              <Input id="edit-categorie" name="categorie" value={formData.categorie} onChange={handleInputChange} placeholder="Catégorie du produit" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditProduct}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement; 