import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-300 mt-4">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span className="text-slate-700">Ubanto</span>
              <span className="text-slate-500">Estate</span>
            </Link>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed">
              Your trusted partner in finding the perfect property. We
              specialize in buying, selling, and renting properties in the most
              desirable neighborhoods with exceptional service and expertise.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-700 hover:text-white hover:border-slate-700 transition-all duration-300"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-700 hover:text-white hover:border-slate-700 transition-all duration-300"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-700 hover:text-white hover:border-slate-700 transition-all duration-300"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-700 hover:text-white hover:border-slate-700 transition-all duration-300"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-600 hover:text-slate-800 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/search?type=sale"
                  className="text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Buy Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/search?type=rent"
                  className="text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Rent Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/search?offer=true"
                  className="text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start">
                <FaMapMarkerAlt className="w-4 h-4 mr-3 mt-1 text-slate-500 flex-shrink-0" />
                <span>123 Real Estate Ave, Business District, City 12345</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="w-4 h-4 mr-3 text-slate-500 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="w-4 h-4 mr-3 text-slate-500 flex-shrink-0" />
                <span>info@ubantoestate.com</span>
              </li>
              <li className="flex items-center">
                <FaClock className="w-4 h-4 mr-3 text-slate-500 flex-shrink-0" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Ubanto Estate. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6">
          <p className="text-sm text-center w-full text-slate-700">
            Made By{" "}
            <a
              className="text-slate-700 font-bold hover:underline"
              href="https://www.linkedin.com/in/hamzanazir1/"
            >
              Hamza Nazir
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
