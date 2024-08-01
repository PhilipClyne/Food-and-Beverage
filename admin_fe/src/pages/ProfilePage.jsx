import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updateData = { username, email, phoneNumber };

      if (showPasswordFields) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const response = await axios.put(
        `${window.location.origin}/api/users/profile`,
        updateData
      );

      setUser(response.data);
      setError(""); // Clear the error message
      alert("Profile updated successfully");
    } catch (error) {
      if (showPasswordFields) {
        setError("Error updating profile. Please check your current password.");
      } else {
        setError("Error updating profile.");
      }
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleUpdateProfile}>
        <div className="form-group-row">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group-row">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group-row">
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        {!showPasswordFields && (
          <button type="button" onClick={() => setShowPasswordFields(true)}>
            Change Password
          </button>
        )}

        {showPasswordFields && (
          <>
            <div className="form-group-row">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group-row">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button type="button" onClick={() => setShowPasswordFields(false)}>
              Collapse
            </button>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
