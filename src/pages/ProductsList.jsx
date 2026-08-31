import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("products/")
      .then((res) => {
        const productData = res.data.results || res.data;
        setProducts(productData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products from server.");
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation(); 
    try {
      await api.post("cart/add/", {
        product_id: productId,
        quantity: 1
      });
      alert("Product added to cart successfully!");
    } catch (err) {
      alert("Please login first to add items to cart.");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=400";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  if (loading) return <div className="p-10 text-center text-slate-600">Loading products from database...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Available Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              onClick={() => navigate(`/products/${product.id}`)} // പ്രൊഡക്റ്റിൽ ക്ലിക്ക് ചെയ്താൽ ഡീറ്റെയിൽസ് പേജിലേക്ക് പോകും
              className="bg-white rounded-2xl shadow-md p-4 border border-slate-200 flex flex-col justify-between cursor-pointer hover:shadow-lg transition"
            >
              <div>
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="h-48 w-full object-cover rounded-xl mb-4"
                />
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                  {product.category?.name || "General"}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-2">{product.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-lg font-bold text-blue-900">${product.price}</span>
                <button
                  onClick={(e) => handleAddToCart(e, product.id)}
                  className="bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-950 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200 mt-6">
            <p className="text-slate-500 font-medium">No available products found in database.</p>
            <p className="text-xs text-slate-400 mt-1">Please add products via Django Admin and ensure 'Is Available' is checked.</p>
          </div>
        )}
      </div>
    </div>
  );
}