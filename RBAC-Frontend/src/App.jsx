import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Root from './components/Root';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/Notfound';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Root />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    
                    
                    <PrivateRoute>
               
                    <Dashboard />
                    
                    </PrivateRoute>
                    
                    } />
                      <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
