import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getCartId, removeCartId } from "../utils/localStorage";
import "./PaymentType.css";
import QRcode from "../assets/img/qr.jpg";

const PaymentType = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false); // State to show QR code
  const [countdown, setCountdown] = useState(3); // Countdown timer in seconds
  const navigate = useNavigate();

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
        { cartId, paymentType: "Cash" }
      );
      console.log("Order created successfully:", response.data);

      // Clear the cart
      await axios.delete(`${window.location.origin}/api/carts/${cartId}`);
      removeCartId(); // Remove cart ID from localStorage
      // navigate(`/invoice/${response.data._id}`); // Navigate to the invoice page
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
      // Navigate back to shopping page after 3 seconds
      setTimeout(() => {
        setShowThankYou(false);
        navigate("/shopping");
      }, 3000);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="payment-type">
      <h1>Vui lòng chọn phương thức thanh toán</h1>
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
        <Link to="/cart">
          <button>Back</button>
        </Link>
      </div>
      {showQRCode && (
        <div className="qr-code">
          <h2>Scan the QR code to complete your payment</h2>
          <img src={QRcode} alt="QR Code" className="qr" />
          <button className="qr-btn" onClick={handleConfirmOrder}>
            Confirm
          </button>
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
          <p>back to site in {countdown}s...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentType;
