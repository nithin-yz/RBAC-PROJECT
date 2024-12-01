import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const isTokenValid = decodedToken && decodedToken.exp * 1000 > Date.now(); // Check if the token is expired

    if (!token || !isTokenValid) {
        localStorage.removeItem('token')
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
