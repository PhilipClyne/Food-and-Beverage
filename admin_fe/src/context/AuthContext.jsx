import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; // Đảm bảo axios gửi cookie trong các yêu cầu

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get(`${window.location.origin}/api/users/profile`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post(`${window.location.origin}/api/users/logout`);
            setUser(null);
            window.location.href = '/login'; // Redirect to login page after logout
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
