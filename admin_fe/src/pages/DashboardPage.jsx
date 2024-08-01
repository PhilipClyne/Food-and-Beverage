import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './DashboardPage.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import UserDropdown from '../components/UserDropdown';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [revenue, setRevenue] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState('none');
  const [userStats, setUserStats] = useState({ successfulOrders: 0, canceledOrders: 0 });
  const [loading, setLoading] = useState(true);
  const orderDetailRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    setStartDate(new Date());
    setEndDate(new Date());
  }, []);

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchRevenue();
    } else {
      setLoading(false);
    }
  }, [startDate, endDate, selectedUser, user]);

  const handleOrderDetail = async (order) => {
    setSelectedOrder(order);
    try {
      const response = await axios.get(`${window.location.origin}/api/orders/${order._id}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (orderDetailRef.current && !orderDetailRef.current.contains(event.target)) {
        setSelectedOrder(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/api/orders/revenue/date`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          userId: selectedUser !== 'none' ? selectedUser : undefined,
        },
      });
      setRevenue(response.data.totalRevenue);
      setConfirmedOrders(response.data.confirmedOrders);
      setCancelledOrders(response.data.cancelledOrders);
      setPendingOrders(response.data.pendingOrders);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="revenue-container">
        <div className="revenue-summary">
          <h2>Revenue</h2>
          <div className="date-picker-container">
            <div>
              <label>Start Date:</label>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </div>
            <div>
              <label>End Date:</label>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>
          </div>
          <UserDropdown selectedUser={selectedUser} setSelectedUser={setSelectedUser} setUserStats={setUserStats} />
          <div className="revenue-display">
            <p>Total Revenue: ${revenue}</p>
            <p>Confirmed Orders: {confirmedOrders.length}</p>
            <p>Cancelled Orders: {cancelledOrders.length}</p>
            <p>Pending Orders: {pendingOrders.length}</p>
          </div>
          <div>
            <p>------------------------------------------</p>
            {selectedUser !== 'none' && (
              <div className="user-stats">
                <h3>User Stats</h3>
                <p>Successful Orders: {userStats.successfulOrders}</p>
                <p>Canceled Orders: {userStats.canceledOrders}</p>
              </div>
            )}
          </div>
        </div>
        <div className="orders-list">
          <h3>Confirmed Orders</h3>
          {confirmedOrders.map(order => (
            <div key={order._id} className="order-item">
              <p>Order ID: {order._id}</p>
              <p>Total: ${order.total}</p>
              <button onClick={() => handleOrderDetail(order)}>View Detail</button>
              {selectedOrder && selectedOrder._id === order._id && (
                <div className="order-detail-panel" ref={orderDetailRef}>
                  <h3>Order Detail</h3>
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Total:</strong> ${selectedOrder.total}</p>
                  <p><strong>Status:</strong> {selectedOrder.statusValue}</p>
                  <h4>Order Details</h4>
                  {selectedOrder.orderDetails.map(detail => (
                    <div key={detail._id} className="order-detail-item">
                      <p><strong>Product ID:</strong> {detail.productId}</p>
                      <p><strong>Product name:</strong> {detail.productName}</p>
                      <p><strong>Price:</strong> ${detail.price}</p>
                      <p><strong>Quantity:</strong> {detail.quantity}</p>
                      <p><strong>Note:</strong> {detail.note}</p>
                    </div>
                  ))}
                  <button onClick={() => setSelectedOrder(null)}>Close</button>
                </div>
              )}
            </div>
          ))}
          <h3>Cancelled Orders</h3>
          {cancelledOrders.map(order => (
            <div key={order._id} className="order-item">
              <p>Order ID: {order._id}</p>
              <p>Total: ${order.total}</p>
              <button onClick={() => handleOrderDetail(order)}>View Detail</button>
              {selectedOrder && selectedOrder._id === order._id && (
                <div className="order-detail-panel" ref={orderDetailRef}>
                  <h3>Order Detail</h3>
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Total:</strong> ${selectedOrder.total}</p>
                  <p><strong>Status:</strong> {selectedOrder.statusValue}</p>
                  <h4>Order Details</h4>
                  {selectedOrder.orderDetails.map(detail => (
                    <div key={detail._id} className="order-detail-item">
                      <p><strong>Product ID:</strong> {detail.productId}</p>
                      <p><strong>Product name:</strong> {detail.productName}</p>
                      <p><strong>Price:</strong> ${detail.price}</p>
                      <p><strong>Quantity:</strong> {detail.quantity}</p>
                      <p><strong>Note:</strong> {detail.note}</p>
                    </div>
                  ))}
                  <button onClick={() => setSelectedOrder(null)}>Close</button>
                </div>
              )}
            </div>
          ))}
          <h3>Pending Orders</h3>
          {pendingOrders.map(order => (
            <div key={order._id} className="order-item">
              <p>Order ID: {order._id}</p>
              <p>Total: ${order.total}</p>
              <button onClick={() => handleOrderDetail(order)}>View Detail</button>
              {selectedOrder && selectedOrder._id === order._id && (
                <div className="order-detail-panel" ref={orderDetailRef}>
                  <h3>Order Detail</h3>
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Total:</strong> ${selectedOrder.total}</p>
                  <p><strong>Status:</strong> {selectedOrder.statusValue}</p>
                  <h4>Order Details</h4>
                  {selectedOrder.orderDetails.map(detail => (
                    <div key={detail._id} className="order-detail-item">
                      <p><strong>Product ID:</strong> {detail.productId}</p>
                      <p><strong>Product name:</strong> {detail.productName}</p>
                      <p><strong>Price:</strong> ${detail.price}</p>
                      <p><strong>Quantity:</strong> {detail.quantity}</p>
                      <p><strong>Note:</strong> {detail.note}</p>
                    </div>
                  ))}
                  <button onClick={() => setSelectedOrder(null)}>Close</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
