import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./UserDetail.css"; // Import the CSS file

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/users/${id}`
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [id, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedUserDetails = {
        ...userDetails,
        password: newPassword || undefined,
      };

      await axios.put(
        `${window.location.origin}/api/users/${id}`,
        updatedUserDetails
      );
      navigate("/usermanagement");
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-detail">
      <h1>User Detail</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={userDetails.username || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, username: e.target.value })
            }
            readOnly={userDetails.isAdmin} // Không cho phép chỉnh sửa nếu là admin
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={userDetails.email || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
            readOnly={userDetails.isAdmin} // Không cho phép chỉnh sửa nếu là admin
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            value={userDetails.phoneNumber || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, phoneNumber: e.target.value })
            }
            readOnly={userDetails.isAdmin} // Không cho phép chỉnh sửa nếu là admin
          />
        </div>
        {showPasswordFields && (
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        )}
        {!userDetails.isAdmin && (
          <div>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              {showPasswordFields
                ? "Hide Password Fields"
                : "Show Password Fields"}
            </button>
          </div>
        )}
        <div>
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export default UserDetail;
