import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4 text-green-700">ElectronikShop</h3>
            <p className="text-sm text-gray-600">
              Quality products for your everyday needs. Shop with confidence.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=electronics" className="text-sm text-gray-600 hover:text-gray-900">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/?category=home" className="text-sm text-gray-600 hover:text-gray-900">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link to="/?category=accessories" className="text-sm text-gray-600 hover:text-gray-900">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-900">
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Email Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-green-700">
          <p>&copy; {new Date().getFullYear()} ElectronikShop. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
