import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderUpdate.css"; // Import the CSS file

const OrderUpdate = () => {
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Create an updated order object excluding product-related fields
    const updatedOrder = {
      customerName: order.customerName,
      historyNote: order.historyNote,
      status: order.status,
      // Add other non-product related fields as needed
    };

    try {
      const response = await axios.put(
        `${window.location.origin}/api/orders/${orderId}`,
        updatedOrder
      );
      setOrder(response.data);
      navigate(`/orders/${orderId}`);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  if (order.status === 2) {
    return <div>Order already confirmed. Cannot update.</div>;
  }

  return (
    <div className="order-update">
      <h1>Update Order #{order._id}</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            value={order.customerName}
            onChange={(e) =>
              setOrder({ ...order, customerName: e.target.value })
            }
          />
        </div>
        <div>
          <label>History Note:</label>
          <textarea
            value={order.historyNote}
            onChange={(e) =>
              setOrder({ ...order, historyNote: e.target.value })
            }
          ></textarea>
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default OrderUpdate;
