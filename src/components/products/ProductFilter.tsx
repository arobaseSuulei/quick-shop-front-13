
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", name: "All Products" },
  { id: "electronics", name: "Electronics" },
  { id: "home", name: "Home & Living" },
  { id: "accessories", name: "Accessories" },
  { id: "furniture", name: "Furniture" },
  { id: "fitness", name: "Fitness" }
];

const ProductFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  
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
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={currentCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(category.id)}
          className="whitespace-nowrap"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default ProductFilter;
