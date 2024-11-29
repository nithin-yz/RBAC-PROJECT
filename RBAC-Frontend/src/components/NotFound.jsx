import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    // Redirect user to the home page after a few seconds (optional)
    setTimeout(() => {
        navigate('/');
    }, 5000);

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
            <div className="text-center p-8 rounded-lg bg-white shadow-xl">
                {/* Replace the placeholder image with the 404 error GIF */}
                <div className="w-96 h-96 mb-6 flex justify-center items-center">
                    <img
                        src="/5203299.jpg" // This is the Lottie error GIF link
                        alt="404 Error"
                        className=" ml-[150px] w-full h-full  object-contain rounded-lg"
                    />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
                <p className="text-xl text-gray-600 mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition"
                >
                    Go to Home Page
                </button>
            </div>
        </div>
    );
};

export default NotFound;
