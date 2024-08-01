import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly }) => {
    const { user, loading } = useAuth();
    const [message, setMessage] = useState('');
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (adminOnly && !user.isAdmin) {
        if (!message) {
            setMessage('Admin only');
            setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
        }
        return (
            <div>
                {message && <div style={{ color: 'red' }}>{message}</div>}
                {children}
            </div>
        );
    }

    return children;
};

export default PrivateRoute;
