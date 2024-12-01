import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const isTokenValid = (token) => {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode the token
            const expirationTime = decodedToken.exp * 1000;  // Convert exp to milliseconds
            return Date.now() < expirationTime;  // Check if token is not expired
        } catch (error) {


            return false; // If decoding fails, consider the token invalid
        }
    };


    // Redirect user to dashboard if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {

           const valu =isTokenValid (token)

          if(valu){

            navigate('/dashboard');  // If user is already logged in, redirect to dashboard


          }else{

            localStorage.removeItem("token")
            navigate('/login')

          }


        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: data.message || 'Login successful',
            });

            if (data.token) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard'); // Navigate to the dashboard after login
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Token Missing',
                    text: 'Login successful, but no token received.',
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong';

            if (errorMessage === 'User not found. Please register.') {
                Swal.fire({
                    icon: 'info',
                    title: 'User Not Found',
                    text: 'Redirecting you to the registration page...',
                    timer: 3000,
                }).then(() => {
                    navigate('/register'); // Redirect to registration page
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-teal-500 to-orange-400 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-indigo-600 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
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
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
