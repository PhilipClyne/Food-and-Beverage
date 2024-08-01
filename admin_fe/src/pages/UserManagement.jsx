import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./UserManagement.css"; // Import the CSS file

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("staff");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/users/`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchUsers();
    }
  }, [user]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${window.location.origin}/api/users/${userId}`);
        setUsers(users.filter((u) => u._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === "staff") return !u.isAdmin;
    if (filter === "admin") return u.isAdmin;
    return true;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <button onClick={() => setFilter("staff")}>Staff</button>
      <button onClick={() => setFilter("admin")}>Admin</button>
      <button onClick={() => (window.location.href = "/register")}>
        Register New Account
      </button>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.isAdmin ? "Admin" : "Staff"}</td>
              <td>
                <button
                  onClick={() => (window.location.href = `/user/${user._id}`)}
                >
                  View
                </button>
                {!user.isAdmin && (
                  <>
                    <button onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
