import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      let response;
      if (filter === "all") {
        response = await axios.get(`${window.location.origin}/api/orders`);
      } else if (filter === "pending") {
        response = await axios.get(
          `${window.location.origin}/api/orders/status?status=1`
        );
      } else if (filter === "confirmed") {
        response = await axios.get(
          `${window.location.origin}/api/orders/status?status=2`
        );
      } else if (filter === "canceled") {
        response = await axios.get(
          `${window.location.origin}/api/orders/status?status=3`
        );
      }
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleConfirm = async (orderId) => {
    try {
      await axios.put(
        `${window.location.origin}/api/orders/${orderId}/confirm`
      );
      fetchOrders();
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`${window.location.origin}/api/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  return (
    <div className="order-management">
      <h1>Order Management</h1>
      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
        <button onClick={() => setFilter("confirmed")}>Confirmed</button>
        <button onClick={() => setFilter("canceled")}>Canceled</button>
      </div>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <h2>Order: #{order._id}</h2>
            <p>Customer: {order.customerName}</p>
            <p>
              Status: <span className="status"> {order.statusValue}</span>
            </p>
            <p>Total Price: {order.total}</p>
            <p>
              Purchase Date: {new Date(order.purchaseDate).toLocaleString()}
            </p>
            {order.orderComplete && (
              <p>
                Order Complete Date:{" "}
                {new Date(order.orderComplete).toLocaleString()}
              </p>
            )}
            <Link to={`/orders/${order._id}`}>View Details</Link>
            <div className="order-actions">
              {order.status === 1 && (
                <button onClick={() => handleConfirm(order._id)}>
                  Confirm
                </button>
              )}
              <Link to={`/invoice/${order._id}`}>
                <button className="print-btn">Print Order</button>
              </Link>
              {order.status !== 3 && (
                <button onClick={() => handleCancelOrder(order._id)}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
