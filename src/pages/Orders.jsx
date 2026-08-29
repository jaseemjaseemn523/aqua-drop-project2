import React, { useState, useEffect } from "react";
import { Star, Minus, Plus, Droplet, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import api from "../services/api";

export default function OrdersPage() {
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch first available product as a showcase
    api.get("products/")
      .then((res) => {
        if (res.data.results && res.data.results.length > 0) {
          setProduct(res.data.results[0]);
        } else if (res.data.length > 0) {
          setProduct(res.data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, []);

  const addToCart = async () => {
    if (!product) return;
    try {
      await api.post("cart/add/", {
        product_id: product.id,
        quantity: qty
      });
      alert("Product added to cart successfully!");
    } catch (err) {
      alert("Failed to add product. Make sure you are logged in.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading product specifications...</div>;
  if (!product) return <div className="p-10 text-center">No products available. Add products via Django admin.</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative rounded-2xl overflow-hidden bg-teal-800 aspect-square">
            <img
              src={product.image || "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=400"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-sm text-slate-500 mt-1">Professional Hydration System</p>

            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-bold text-slate-900">${product.price}</span>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed mt-4">{product.description}</p>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center rounded-xl border border-slate-200 bg-white">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="flex h-10 w-10 items-center justify-center">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button 
                onClick={addToCart}
                className="flex-1 rounded-xl bg-blue-900 py-3 text-sm font-semibold text-white hover:bg-blue-950 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}