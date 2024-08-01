import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  const navigateToCategoryMenu = () => {
    navigate("/categorymenu");
  };

  return (
    <div className="welcome-page">
      <h1>Xin chào quý khách</h1>
      <button onClick={navigateToCategoryMenu}>Tiến hành đặt món</button>
    </div>
  );
};

export default WelcomePage;
