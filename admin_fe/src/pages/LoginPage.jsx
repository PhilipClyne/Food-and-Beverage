import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${window.location.origin}/api/users/login`,
        { email, password }
      );
      const data = response.data;

      if (data._id) {
        login(data);
        navigate("/");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
