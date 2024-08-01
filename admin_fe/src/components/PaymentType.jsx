import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCartId, removeCartId } from "../utils/localStorage";
import { useAuth } from "../context/AuthContext";
import "./PaymentType.css";
import QRcode from "../assets/img/qr.jpg";

const PaymentType = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false); // State to show QR code
  const [countdown, setCountdown] = useState(3); // Countdown timer in seconds
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePaymentTypeSelect = (paymentType) => {
    if (paymentType === "Cash") {
      setShowConfirm(true); // Show confirmation modal
    } else if (paymentType === "Bank Transfer") {
      setShowQRCode(true); // Show QR code
    } else {
      alert("Other payment methods are not implemented yet.");
    }
  };

  const handleConfirmOrder = async () => {
    const cartId = getCartId();

    if (!cartId) {
      console.error("No cart ID found in localStorage");
      return;
    }

    try {
      const response = await axios.post(
        `${window.location.origin}/api/orders`,
        { cartId, userId: user ? user._id : null, paymentType: "Cash" }
      );
      console.log("Order created successfully:", response.data);

      // Clear the cart
      await axios.delete(`${window.location.origin}/api/carts/${cartId}`);
      removeCartId(); // Remove cart ID from localStorage
      setShowConfirm(false); // Hide confirmation modal
      setShowThankYou(true); // Show thank you message

      // Set countdown timer for automatic redirection
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer); // Stop timer when countdown reaches 0
            setShowThankYou(false); // Hide the modal
            navigate("/shopping"); // Navigate to shopping page
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000); // Update every second

      // Cleanup on component unmount
      return () => clearInterval(timer);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="payment-type">
      <h1>Select Payment Type</h1>
      <div className="payment-buttons">
        <button onClick={() => handlePaymentTypeSelect("Credit Card")}>
          Credit Card
        </button>
        <button onClick={() => handlePaymentTypeSelect("Debit Card")}>
          Debit Card
        </button>
        <button onClick={() => handlePaymentTypeSelect("Bank Transfer")}>
          Bank Transfer
        </button>
        <button onClick={() => handlePaymentTypeSelect("Cash")}>Cash</button>
      </div>

      {showQRCode && (
        <div className="qr-code">
          <h2>Scan the QR code to complete your payment</h2>
          <img src={QRcode} alt="QR Code" className="qr" />
          <button className="qr-btn" onClick={() => setShowQRCode(false)}>
            Close
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="confirm-modal">
          <h2>Confirm Your Order</h2>
          <button onClick={handleConfirmOrder}>Confirm</button>
          <button onClick={() => setShowConfirm(false)}>Cancel</button>
        </div>
      )}

      {showThankYou && (
        <div className="thank-you-modal">
          <h2>Thank you for your order!</h2>
          <p>back to site in{countdown}s...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentType;
