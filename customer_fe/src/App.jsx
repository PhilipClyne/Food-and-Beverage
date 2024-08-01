import React from "react";
import { Routes, Route } from "react-router-dom";
import ShoppingPage from "./pages/ShoppingPage";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
import WelcomePage from "./pages/WelcomePage";
import PaymentType from "./components/PaymentType";
import CategoryMenu from "./components/CategoryMenu";
import InvoicePage from "./pages/InvoicePage";
import "./App.css";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/categorymenu" element={<CategoryMenu />} />
      <Route path="/payment-type" element={<PaymentType />} />
      <Route path="/shopping" element={<ShoppingPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/invoice/:orderId" element={<InvoicePage />} />
    </Routes>
  );
};

export default App;
