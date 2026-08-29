import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Save, MapPin, Phone, Mail } from "lucide-react";
import api from "../services/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // യൂസർ പ്രൊഫൈൽ ഡാറ്റ ബാക്ക്എൻഡിൽ നിന്ന് ഫെച്ച് ചെയ്യുന്നു
    api.get("accounts/profile/")
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("accounts/profile/", user);
      setUser(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/login");
  };

  if (loading) return <div className="p-10 text-center text-slate-600">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="mx-auto max-w-2xl bg-white rounded-3xl shadow-md p-8 border border-slate-200">
        <div className="flex items-center justify-between border-b pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
              {user.first_name ? user.first_name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{user.first_name} {user.last_name}</h1>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <h2 className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wider">Edit Profile & Delivery Details</h2>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={user.first_name || ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={user.last_name || ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={user.phone_number || ""}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Delivery Address (Building, Pincode, State)</label>
            <textarea
              rows="3"
              name="address"
              value={user.address || ""}
              onChange={handleChange}
              placeholder="Enter your complete address..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-800 text-white py-3.5 rounded-xl font-semibold shadow hover:bg-blue-900 transition mt-4"
          >
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}