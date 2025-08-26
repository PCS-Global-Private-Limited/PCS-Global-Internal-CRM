import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import {Link} from "react-router-dom"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-extrabold text-blue-600">
            PCS GLOBAL CRM
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-2">
          <a href="#" className="block text-gray-700 hover:text-gray-900">
            Home
          </a>
          <a href="#" className="block text-gray-700 hover:text-gray-900">
            Features
          </a>
          <a href="#" className="block text-gray-700 hover:text-gray-900">
            Resources
          </a>
          <a href="#" className="block text-gray-700 hover:text-gray-900">
            Support
          </a>
          <a
            href="#"
            className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <a
            href="#"
            className="block px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-center hover:bg-blue-50 transition"
          >
            Login
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
