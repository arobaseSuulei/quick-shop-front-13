
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Minimalist Leather Watch",
    description: "Classic design with premium leather strap and stainless steel casing. Water resistant up to 30m.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    category: "accessories",
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Premium Wireless Headphones",
    description: "Superior sound quality with active noise cancellation and 20-hour battery life.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "electronics",
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "Modern Desk Lamp",
    description: "Adjustable LED desk lamp with touch controls and multiple brightness settings.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    category: "home",
    inStock: true
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    description: "Comfortable design with adjustable height, armrests, and lumbar support.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    category: "furniture",
    inStock: true
  },
  {
    id: 5,
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handcrafted ceramic mugs with minimalist design.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1572520796921-dc4eb6292b18",
    category: "home",
    inStock: true
  },
  {
    id: 6,
    name: "Smartphone Stand",
    description: "Aluminum stand compatible with all smartphones. Perfect for desk or bedside.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1541345023926-55d6e0853f4b",
    category: "electronics",
    inStock: true
  },
  {
    id: 7,
    name: "Leather Wallet",
    description: "Genuine leather with multiple card slots and RFID protection.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531",
    category: "accessories",
    inStock: true
  },
  {
    id: 8,
    name: "Smart Water Bottle",
    description: "Track your hydration with LED reminders. App connectivity and temperature display.",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1559839914-17aae19cec71",
    category: "fitness",
    inStock: false
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};
