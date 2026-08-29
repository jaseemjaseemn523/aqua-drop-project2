import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductsList from "./pages/ProductsList";
import ProductDetail from "./pages/ProductDetail";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ProfilePage from "./pages/ProfilePage"; // പുതിയ പ്രൊഫൈൽ പേജ് ഇമ്പോർട്ട് ചെയ്യുക

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/tracking" element={<OrderTrackingPage />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* പ്രൊഫൈൽ റൂട്ട് */}
      </Routes>
    </Router>
  );
}

export default App;