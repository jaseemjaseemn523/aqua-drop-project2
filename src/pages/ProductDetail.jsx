import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Minus, Plus, ArrowLeft, ShoppingCart, Zap } from "lucide-react";
import api from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`products/${id}/`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details.");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post("cart/add/", {
        product_id: product.id,
        quantity: qty
      });
      alert("Product added to cart successfully!");
    } catch (err) {
      alert("Please login first to add items to cart.");
    }
  };

  const handleBuyNow = async () => {
    try {
      // ആദ്യം കാർട്ടിലേക്ക് ആഡ് ചെയ്യുക, എന്നിട്ട് ചെക്ക്ഔട്ട് പേജിലേക്ക് പോവുക
      await api.post("cart/add/", {
        product_id: product.id,
        quantity: qty
      });
      navigate("/checkout");
    } catch (err) {
      alert("Please login first to proceed with purchase.");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=400";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  if (loading) return <div className="p-10 text-center text-slate-600">Loading product details...</div>;
  if (error || !product) return <div className="p-10 text-center text-red-600">{error || "Product not found"}</div>;

  // ക്വാണ്ടിറ്റി മാറുന്നതനുസരിച്ച് ടോട്ടൽ പ്രൈസ് ഓട്ടോമാറ്റിക്കായി കാൽക്കുലേറ്റ് ചെയ്യുന്നു
  const totalPrice = (parseFloat(product.price) * qty).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </button>

        <div className="bg-white rounded-3xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border border-slate-200">
          <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-square">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                {product.category?.name || "General"}
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-3">{product.name}</h1>
              
              {/* ഓട്ടോ അപ്ഡേറ്റ് ആകുന്ന പ്രൈസ് */}
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-blue-900">${totalPrice}</span>
                <span className="text-xs text-slate-400">(${product.price} / unit)</span>
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed mt-4">{product.description}</p>
              
              <p className="text-xs text-slate-400 mt-4">
                Stock Available: <strong className="text-slate-700">{product.stock} units</strong>
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-600">Quantity:</span>
                <div className="flex items-center border rounded-xl bg-slate-50">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 text-slate-600 hover:text-slate-900">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-2.5 text-slate-600 hover:text-slate-900">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-blue-50 text-blue-800 border border-blue-200 py-3 rounded-xl font-semibold text-sm hover:bg-blue-100 transition"
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 bg-blue-800 text-white py-3 rounded-xl font-semibold text-sm shadow hover:bg-blue-900 transition"
                >
                  <Zap className="h-4 w-4" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}