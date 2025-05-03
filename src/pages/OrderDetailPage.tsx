
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

// Mock order details
const mockOrderItems = [
  {
    id: 2,
    name: "Premium Wireless Headphones",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    quantity: 1
  },
  {
    id: 1,
    name: "Minimalist Leather Watch",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    quantity: 1
  }
];

const OrderDetailPage = () => {
  const { id } = useParams();
  const [orderItems, setOrderItems] = useState(mockOrderItems);
  const [orderStatus, setOrderStatus] = useState("Delivered");
  const [orderDate, setOrderDate] = useState("2025-05-02");
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate order totals
  const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 4.99;
  const total = subtotal + shipping;
  
  useEffect(() => {
    // Simulate loading order data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If order ID is 123454, show canceled status
  useEffect(() => {
    if (id === "123454") {
      setOrderStatus("Cancelled");
      setOrderDate("2025-04-15");
    } else if (id === "123455") {
      setOrderStatus("Shipped");
      setOrderDate("2025-04-27");
    }
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center py-16">
            <p>Loading order details...</p>
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
        <div className="mb-6">
          <Link to="/orders" className="text-sm text-gray-500 hover:text-gray-800 inline-block">
            ← Back to my orders
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold">Order #{id}</h1>
          
          <div className="mt-2 md:mt-0">
            <span className="text-sm text-gray-500">
              Placed on {new Date(orderDate).toLocaleDateString()}
            </span>
            <span className={`ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              orderStatus === "Delivered" 
                ? "bg-green-100 text-green-800" 
                : orderStatus === "Shipped" 
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}>
              {orderStatus}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="font-medium">Order Items</h2>
              </div>
              
              {orderItems.map((item) => (
                <div key={item.id} className="p-6 border-b flex items-center">
                  <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {orderStatus === "Delivered" && (
              <div className="mt-6 bg-white border rounded-lg p-6">
                <h2 className="font-medium mb-4">Need Help?</h2>
                <div className="flex space-x-4">
                  <Button variant="outline">Return Item</Button>
                  <Button variant="outline">Contact Support</Button>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                
                <div className="pt-2 mt-2 border-t flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-6 mt-6">
              <h2 className="font-medium mb-4">Shipping Address</h2>
              
              <address className="text-sm text-gray-600 not-italic">
                John Doe<br />
                123 Main St<br />
                Apt 4B<br />
                New York, NY 10001<br />
                United States
              </address>
            </div>
            
            {orderStatus === "Shipped" && (
              <div className="bg-white border rounded-lg p-6 mt-6">
                <h2 className="font-medium mb-4">Tracking</h2>
                <p className="text-sm mb-3">Carrier: FedEx</p>
                <p className="text-sm">Tracking #: FX123456789US</p>
                <Button className="mt-4 w-full" variant="outline">Track Package</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderDetailPage;
