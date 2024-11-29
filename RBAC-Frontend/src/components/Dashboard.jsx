import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../../services/api';

const Dashboard = () => {
    const [message, setMessage] = useState(null);
    const [username, setUsername] = useState(null);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await API.get('/auth/dashboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setMessage(data.message);
                setUsername(data.username);
                if (data.users) {
                    setUsers(data.users); // Set list of users for moderator and admin
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Something went wrong';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                });
                if (errorMessage === 'Invalid token') {
                    navigate('/login'); // Redirect if token is expired
                }
            }
        };

        fetchDashboardData();
    }, [token, navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handlePromotion = async (userId, newRole) => {
        try {
            const { data } = await API.put('/auth/promote', { userId, newRole }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: data.message,
            });

            // Optionally refresh the list of users
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error promoting user',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Dashboard</h1>
                {username && <p className="text-2xl text-gray-700 text-center mb-4">Welcome, {username}!</p>}
                {message && <p className="text-lg text-gray-500 text-center mb-8">{message}</p>}

                {users.length > 0 && (
                    <div className="overflow-x-auto">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users List</h2>
                        <table className="table-auto w-full bg-gray-100 rounded-lg shadow-md">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left text-gray-600 font-semibold">Name</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-semibold">Role</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-4 py-2 text-gray-700">{user.name}</td>
                                        <td className="px-4 py-2 text-gray-700">{user.role}</td>
                                        <td className="px-4 py-2 text-gray-700">
                                            <button
                                                onClick={() => handlePromotion(user._id, 'Moderator')}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 mr-2"
                                            >
                                                Promote to Moderator
                                            </button>
                                            <button
                                                onClick={() => handlePromotion(user._id, 'Admin')}
                                                className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
                                            >
                                                Promote to Admin
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={logout}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
