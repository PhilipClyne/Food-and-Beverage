import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/categorymenu">Shopping</Link>
      <Link to="/">Manage</Link>
      {user && (
        <>
          <Link to="/profile">
            <span>Hello, {user.username}</span>
          </Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
