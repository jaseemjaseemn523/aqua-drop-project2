import React, { useState } from "react";
import { Droplet, MapPin } from "lucide-react";
import api from "../services/api";

export default function Login() {
  const [activeTab, setActiveTab] = useState("register");
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    building: "",
    pincode: "",
    state: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            building: data.address.road || data.address.suburb || "Detected Location",
            pincode: data.address.postcode || "",
            state: data.address.state || "",
          }));
        } catch {
          alert(`Lat: ${latitude}, Lon: ${longitude} (Address lookup failed, coordinates saved)`);
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setLoadingLocation(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (activeTab === "register") {
      if (formData.password !== formData.confirmPassword) {
        setError("Both passwords must match.");
        return;
      }
    }

    try {
      if (activeTab === "register") {
        await api.post("accounts/register/", {
          email: formData.email,
          username: formData.email.split("@")[0],
          first_name: formData.firstName,
          last_name: formData.secondName,
          password: formData.password,
          role: "CUSTOMER", 
          address: `${formData.building}, Pincode: ${formData.pincode}, State: ${formData.state}`,
        });
        alert("Registration successful! Please sign in now.");
        setActiveTab("login");
      } else {
        const response = await api.post("accounts/login/", {
          email: formData.email,
          password: formData.password,
        });
        
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        
        const userData = response.data.user || {};
        localStorage.setItem("user", JSON.stringify(userData));
        
        alert("Login Successful!");

        // Role-based redirection
        const userRole = userData.role;
        if (userData.is_staff || userRole === "ADMIN") {
          window.location.href = "/admin-dashboard"; 
        } else if (userRole === "DELIVERY") {
          window.location.href = "/tracking"; 
        } else {
          window.location.href = "/products"; 
        }
      }
    } catch (err) {
      console.error(err.response?.data);
      const errData = err.response?.data;
      if (typeof errData === 'object' && errData !== null) {
        const firstKey = Object.keys(errData)[0];
        setError(`${firstKey}: ${errData[firstKey]}`);
      } else {
        setError("Authentication validation failed. Check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <div className="flex flex-col items-center mb-5">
          <div className="h-12 w-12 rounded-xl bg-blue-700 flex items-center justify-center mb-2 text-white">
            <Droplet className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-blue-800">AquaDrop Portal</h1>
        </div>

        <div className="grid grid-cols-2 gap-1 bg-slate-100 rounded-full p-1 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`py-2 rounded-full text-xs font-semibold ${activeTab === "register" ? "bg-white text-blue-700 shadow" : "text-slate-500"}`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`py-2 rounded-full text-xs font-semibold ${activeTab === "login" ? "bg-white text-blue-700 shadow" : "text-slate-500"}`}
          >
            Login
          </button>
        </div>

        {error && <p className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {activeTab === "register" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none"
                />
                <input
                  type="text"
                  name="secondName"
                  value={formData.secondName}
                  onChange={handleChange}
                  placeholder="Second Name"
                  required
                  className="rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none"
                />
              </div>

              <input
                type="text"
                name="building"
                value={formData.building}
                onChange={handleChange}
                placeholder="Building / Street Address"
                required
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                  className="rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                  className="rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAutoLocation}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200 hover:bg-sky-100 transition"
              >
                <MapPin className="h-3.5 w-3.5" />
                {loadingLocation ? "Detecting Location..." : "Auto Detect Current Location"}
              </button>
            </>
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none"
          />

          {activeTab === "register" && (
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password (Type again)"
              required
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none"
            />
          )}

          <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded-xl font-semibold text-sm shadow hover:bg-blue-900 transition mt-2">
            {activeTab === "register" ? "Register Account" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}