import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./OrderDetail.css";
const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

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

  const handleConfirm = async (orderId) => {
    try {
      await axios.put(
        `${window.location.origin}/api/orders/${orderId}/confirm`
      );
      fetchOrder();
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`${window.location.origin}/api/orders/${orderId}/cancel`);
      fetchOrder();
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  return (
    <div className="order-detail-container">
      <h1>Order Detail</h1>
      {order ? (
        <div className="order-details">
          <h2>Order: #{order._id}</h2>
          <p>Status: {order.statusValue}</p>
          <p>Total Price: {order.total}</p>
          <p>Purchase Date: {new Date(order.purchaseDate).toLocaleString()}</p>
          {order.orderComplete && (
            <p>
              Order Complete Date:{" "}
              {new Date(order.orderComplete).toLocaleString()}
            </p>
          )}
          <div>
            {order.orderDetails.map((detail) => (
              <div key={detail._id}>
                <p>Product ID: {detail.productId}</p>
                <img src={detail.productImage} alt={detail.productName} />
                <p>Product Name: {detail.productName}</p>
                <p>Quantity: {detail.quantity}</p>
                <p>Price: {detail.price}</p>
              </div>
            ))}
          </div>
          {order.status === 1 && (
            <button onClick={() => handleConfirm(order._id)}>Xác nhận</button>
          )}
          {order.status === 1 && (
            <button onClick={() => navigate(`/orders/${orderId}/update`)}>
              Update
            </button>
          )}
          {order.status !== 3 && (
            <button onClick={() => handleCancelOrder(order._id)}>
              Hủy đơn
            </button>
          )}
          <Link to="/shopping">
            <button>Back</button>
          </Link>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default OrderDetail;
