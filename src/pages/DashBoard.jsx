import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [userRole, setUserRole] = useState("CUSTOMER");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(storedUser.role || "CUSTOMER");

    api.get("orders/")
      .then((res) => setOrders(res.data.results || res.data))
      .catch((err) => console.error("Error fetching order logs", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          {userRole === "ADMIN" ? "Admin Panel: All User Orders" : "My Water Delivery History"}
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Persistent records showing Online Payments and Cash on Delivery choices.
        </p>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow p-5 border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                    Order #{order.id}
                  </span>
                  {userRole === "ADMIN" && (
                    <p className="text-xs text-slate-500 mt-1">Customer: {order.user}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">${order.total_amount}</span>
                  <p className="text-[11px] font-semibold text-emerald-600 uppercase">{order.payment_method}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-2"><strong>Address:</strong> {order.shipping_address}</p>
              <div className="flex justify-between items-center text-xs border-t pt-3 text-slate-500">
                <span>Status: <strong className="text-blue-800">{order.status}</strong></span>
                <span>Payment: <strong className={order.payment_status === 'PAID' ? 'text-green-600' : 'text-amber-600'}>{order.payment_status}</strong></span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-slate-400 py-10">No order records found.</p>}
        </div>
      </div>
    </div>
  );
}