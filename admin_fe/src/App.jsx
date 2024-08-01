import React from "react";
import { Routes, Route } from "react-router-dom";
import ShoppingPage from "./pages/ShoppingPage";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
import OrderManagement from "./components/OrderManagement";
import OrderDetail from "./components/OrderDetail";
import OrderUpdate from "./components/OrderUpdate";
import LoginPage from "./pages/LoginPage";
import ManageShopPage from "./pages/ManageShopPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import UserManagement from "./pages/UserManagement";
import UserDetail from "./pages/UserDetail";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CategoryManagement from "./pages/CategoryManagement";
import PaymentType from "./components/PaymentType";
import CategoryMenu from "./components/CategoryMenu";
import InvoicePage from "./pages/InvoicePage";
const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ManageShopPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/categorymenu"
          element={
            <PrivateRoute>
              <CategoryMenu />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment-type"
          element={
            <PrivateRoute>
              <PaymentType />
            </PrivateRoute>
          }
        />
        <Route
          path="/shopping"
          element={
            <PrivateRoute>
              <ShoppingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoice/:orderId"
          element={
            <PrivateRoute>
              <InvoicePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:orderId/update"
          element={
            <PrivateRoute>
              <OrderUpdate />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/usermanagement"
          element={
            <PrivateRoute adminOnly={true}>
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <PrivateRoute adminOnly={true}>
              <UserDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/categorymanagement"
          element={
            <PrivateRoute>
              <CategoryManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PrivateRoute adminOnly={true}>
              <RegisterPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute adminOnly={true}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
