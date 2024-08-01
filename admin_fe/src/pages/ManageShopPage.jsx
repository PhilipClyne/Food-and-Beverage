import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ManageShopPage.css";

const ManageShopPage = () => {
  const { user } = useAuth();

  return (
    <div className="manage-shop-page">
      <div>
        <button>
          <Link to="/orders">Order Management</Link>
        </button>
        <button>
          <Link to="/categorymanagement">Category Management</Link>
        </button>
        {user && user.isAdmin && (
          <>
            <button>
              <Link to="/dashboard">Dashboard</Link>
            </button>
            <button>
              <Link to="/userManagement">User Management</Link>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageShopPage;
