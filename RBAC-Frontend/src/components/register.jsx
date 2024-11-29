import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    // Redirect user to dashboard if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');  // If user is already logged in, redirect to dashboard
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/register', { name, email, password });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: data.message || 'Registration successful',
            });
            navigate('/login'); // Redirect to login page after successful registration
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-teal-500 to-orange-400 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-indigo-600 text-center">Register</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
