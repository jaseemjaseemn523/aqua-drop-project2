import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function CheckoutPage() {
  const [cart, setCart] = useState({ items: [] });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("cart/")
      .then((res) => setCart(res.data))
      .catch((err) => console.error("Error fetching cart", err));
  }, []);

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await api.patch(`cart/item/${itemId}/`, { quantity: newQty });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to update quantity");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!shippingAddress.trim()) {
      setError("Please provide your delivery address details before placing the order.");
      return;
    }

    try {
      const response = await api.post("orders/", {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      });
      alert(`Order #${response.data.id} placed successfully! Saved to admin and customer records.`);
      window.location.href = "/tracking"; 
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place order.");
    }
  };

  const subtotal = cart.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto max-w-2xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-bold text-blue-900 mb-4">Water Bottle Checkout & Logistics</h1>

        {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-xs font-semibold">{error}</div>}

        <div className="divide-y mb-6">
          {cart.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{item.product.name}</p>
                <p className="text-xs text-slate-500">${item.product.price} / unit</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded">
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-xs">-</button>
                  <span className="px-3 text-xs font-bold">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-xs">+</button>
                </div>
                <span className="text-sm font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Address Details (Required)</label>
            <textarea
              rows="3"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter exact street, landmark, house/office number..."
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`border p-3 rounded-xl flex items-center gap-2 cursor-pointer ${paymentMethod === 'ONLINE' ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' : ''}`}>
                <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} />
                Online Payment
              </label>
              <label className={`border p-3 rounded-xl flex items-center gap-2 cursor-pointer ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' : ''}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                Cash on Delivery (COD)
              </label>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between text-base font-bold">
            <span>Total Payable:</span>
            <span className="text-blue-900">${subtotal.toFixed(2)}</span>
          </div>

          <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded-xl font-semibold shadow hover:bg-blue-900 transition">
            Confirm & Place Order
          </button>
        </form>
      </div>
    </div>
  );
}