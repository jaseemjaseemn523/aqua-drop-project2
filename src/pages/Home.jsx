
import React from "react";
import { CheckCircle2, ArrowRight, Droplets, Truck, ShieldCheck, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-white py-20 px-6">
        <div className="mx-auto max-w-7xl grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
              <CheckCircle2 size={15} /> Trusted Water Logistics
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900">
              Fresh Water <span className="text-blue-700">Delivered</span> to Your Doorstep
            </h1>
            <p className="mt-6 text-base text-slate-600 sm:text-lg">
              Hydration made simple. Quality-tested water delivered instantly with live driver tracking.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/products")}
                className="flex items-center gap-2 rounded-lg bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800"
              >
                Order Now <ArrowRight size={17} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rounded-lg bg-cyan-700 px-7 py-3.5 text-sm font-bold text-white hover:bg-cyan-800"
              >
                Sign In / Register
              </button>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=1200&q=85"
              alt="Water delivery"
              className="rounded-2xl shadow-2xl h-[400px] w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}