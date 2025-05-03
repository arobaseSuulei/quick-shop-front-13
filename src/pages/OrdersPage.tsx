
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Mock order data
const mockOrders = [
  {
    id: "123456",
    date: "2025-05-02",
    status: "Delivered",
    total: 129.98,
    items: 2
  },
  {
    id: "123455",
    date: "2025-04-27",
    status: "Shipped",
    total: 49.99,
    items: 1
  },
  {
    id: "123454",
    date: "2025-04-15",
    status: "Cancelled",
    total: 89.99,
    items: 1
  }
];

const OrdersPage = () => {
  const [orders] = useState(mockOrders);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        
        {orders.length > 0 ? (
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Items</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Delivered" 
                            ? "bg-green-100 text-green-800" 
                            : order.status === "Shipped" 
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/order/${order.id}`} className="text-black hover:text-gray-600">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white border rounded-lg">
            <h2 className="text-xl font-medium mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Link to="/" className="text-black underline hover:text-gray-600">
              Start Shopping
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default OrdersPage;
