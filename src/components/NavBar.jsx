

import React from "react";
import { Bell, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", path: "/" },
  { label: "Orders", path: "/tracking" },
  { label: "Products", path: "/products" },
  { label: "Checkout", path: "/checkout" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="w-full bg-gradient-to-r from-slate-100 to-blue-50 border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C12 2 5 11 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 11 12 2 12 2Z" />
          </svg>
          <span className="text-lg font-bold text-slate-800">AquaDrop</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm pb-1 transition-colors ${
                  isActive
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                    : "text-slate-600 font-medium hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <Link
            to="/tracking"
            aria-label="Notifications"
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Bell className="w-5 h-5" strokeWidth={1.75} />
          </Link>
          
          {/* Cart Icon -> Navigates to Checkout/Cart */}
          <Link
            to="/checkout"
            aria-label="Cart"
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
          </Link>
          
          {/* Profile Avatar -> Navigates to Profile Edit & Logout Page */}
          <Link to="/profile" title="My Profile & Settings">
            <img
              src="https://i.pravatar.cc/64?img=13"
              alt="User avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow cursor-pointer hover:opacity-90"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}