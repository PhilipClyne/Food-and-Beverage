/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./InvoicePage.css";

const InvoicePage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `${window.location.origin}/api/orders/${orderId}`
      );
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="invoice-page">
      <h1>Order</h1>
      <h2>Order ID: {order._id}</h2>
      <div className="invoice-items">
        <div>
          <p>Customer: {order.customerName}</p>
          <p>Total Price: {order.total}</p>
          <div>
            {order.orderDetails.map((detail) => (
              <div key={detail._id}>
                <p>Product ID: {detail.productId}</p>
                <p>Price: {detail.price}</p>
                <p>Quantity: {detail.quantity}</p>
                <img
                  src={detail.productImage || "default-image.png"}
                  className="cart-item-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={handlePrint} className="print-button">
        Print Invoice
      </button>
      <Link to="/shopping">
        <button className="print-button">Back</button>
      </Link>
      {/* <h2>Total: {order.totalPrice} VND</h2> */}
    </div>
  );
};

export default InvoicePage;
