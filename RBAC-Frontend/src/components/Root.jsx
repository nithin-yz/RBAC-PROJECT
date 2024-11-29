import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Root = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the token exists and is valid
        const token = localStorage.getItem('token');
        
        if (token && isTokenValid(token)) {
            // Redirect to the dashboard if the user is logged in
            navigate('/dashboard');
        }
    }, [navigate]);

    // Function to validate the token expiration
    const isTokenValid = (token) => {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode the token
            const expirationTime = decodedToken.exp * 1000;  // Convert exp to milliseconds
            return Date.now() < expirationTime;  // Check if token is not expired
        } catch (error) {
            return false; // If decoding fails, consider the token invalid
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-6">Welcome to RBAC System</h1>
                <p className="text-lg text-gray-200 mb-8">Secure your application with Role-Based Access Control</p>
                <div className="space-x-4">
                    <Link to="/login">
                        <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-200">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="px-6 py-3 bg-white text-pink-600 font-semibold rounded-lg shadow hover:bg-gray-200">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Root;
