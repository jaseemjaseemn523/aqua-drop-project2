import React, { useState, useEffect } from "react";
import { Truck, MapPin, Navigation, CheckCircle } from "lucide-react";
import api from "../services/api";

export default function OrderTrackingPage() {
  const [orders, setOrders] = useState([]);
  const [isDeliveryBoy, setIsDeliveryBoy] = useState(false);
  const [trackingActive, setTrackingActive] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role === "DELIVERY") {
      setIsDeliveryBoy(true);
    }

    // Fetch orders assigned to delivery personnel or user
    api.get(user.role === "DELIVERY" ? "delivery/my-orders/" : "orders/")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error loading delivery items", err));
  }, []);

  // Broadcast live location if user is a delivery boy
  useEffect(() => {
    let interval;
    if (isDeliveryBoy && trackingActive) {
      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          api.post("delivery/location/", { latitude, longitude }).catch(() => {});
        });
      }, 10000); // Ping every 10 seconds
    }
    return () => clearInterval(interval);
  }, [isDeliveryBoy, trackingActive]);

  const openMapDirections = (address) => {
    setTrackingActive(true);
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
  };

  const markDelivered = async (orderId) => {
    try {
      if (isDeliveryBoy) {
        await api.patch(`delivery/orders/${orderId}/status/`, { status: "DELIVERED" });
      } else {
        await api.patch(`orders/${orderId}/update_status/`, { status: "DELIVERED" });
      }
      alert("Order marked as Delivered!");
      window.location.reload();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">
            {isDeliveryBoy ? "Delivery Boy Logistics & Live Tracking" : "My Order Live Tracking"}
          </h1>
          {isDeliveryBoy && (
            <button
              onClick={() => setTrackingActive(!trackingActive)}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow ${trackingActive ? "bg-emerald-600" : "bg-slate-600"}`}
            >
              {trackingActive ? "GPS Broadcasting ACTIVE" : "Start Live Location Ping"}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow p-5 border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                    Order #{order.id}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Status: <strong className="text-blue-800">{order.status}</strong></p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">${order.total_amount}</span>
                  <p className="text-[11px] font-semibold text-emerald-600">{order.payment_method}</p>
                </div>
              </div>

              <p className="text-xs text-slate-700 mb-4">
                <strong>Delivery Address:</strong> {order.shipping_address}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => openMapDirections(order.shipping_address)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-900 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-950 transition"
                >
                  <Navigation className="h-4 w-4" /> Go to Map Route (Direct Nav)
                </button>
                {isDeliveryBoy && order.status !== "DELIVERED" && (
                  <button
                    onClick={() => markDelivered(order.id)}
                    className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4" /> Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-slate-400 py-10">No active deliveries assigned.</p>}
        </div>
      </div>
    </div>
  );
}