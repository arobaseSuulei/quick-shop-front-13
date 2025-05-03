
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilter from "@/components/products/ProductFilter";
import { products } from "@/data/products";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const categoryParam = searchParams.get("category");
  
  useEffect(() => {
    if (!categoryParam || categoryParam === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === categoryParam));
    }
  }, [categoryParam]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <section className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Shop Our Collection</h1>
            <p className="text-gray-600 mt-2">Quality products for your everyday needs</p>
          </div>
          
          <ProductFilter />
          
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No products found in this category.</p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
