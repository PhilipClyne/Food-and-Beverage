import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDropdown = ({ selectedUser, setSelectedUser, setUserStats }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser !== 'none') {
            fetchUserStats(selectedUser);
        }
    }, [selectedUser]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${window.location.origin}/api/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchUserStats = async (userId) => {
        try {
            const response = await axios.get(`${window.location.origin}/api/users/${userId}/stats`);
            setUserStats({
                successfulOrders: response.data.successfulOrders,
                canceledOrders: response.data.canceledOrders
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    return (
        <div className="user-dropdown">
            <label>Select User:</label>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="none">None</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>
                        {user.username} ({user.email})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default UserDropdown;
