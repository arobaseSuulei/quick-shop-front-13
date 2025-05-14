import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const ProductFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<string[]>([]);
  const currentCategory = searchParams.get("category") || "all";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('produit')
        .select('categorie')
        .not('categorie', 'is', null);

      if (error) throw error;

      // Récupérer les catégories uniques
      const uniqueCategories = Array.from(new Set(data.map(item => item.categorie))).filter(Boolean);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };
  
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };
  
  return (
    <div className="flex overflow-x-auto pb-2 mb-6 space-x-2">
      <Button
        variant={currentCategory === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => handleCategoryChange("all")}
        className="whitespace-nowrap"
      >
        Tous les produits
      </Button>

      {categories.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(category)}
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default ProductFilter;
