import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/notifications/unread/count/${userId}`);
            setUnreadCount(response.data);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
            <div className="p-4">
                <h1 className="text-2xl font-bold text-blue-500">Jitter</h1>
            </div>
            <nav className="mt-8">
                <Link to="/home" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <span className="mx-4">Home</span>
                </Link>
                <Link to="/explore" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <span className="mx-4">Explore</span>
                </Link>
                <Link to="/notifications" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 relative">
                    <span className="mx-4">Notifications</span>
                    {unreadCount > 0 && (
                        <span className="absolute right-4 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {unreadCount}
                        </span>
                    )}
                </Link>
                <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <span className="mx-4">Profile</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                    <span className="mx-4">Logout</span>
                </button>
            </nav>
        </div>
    );
};

export default Sidebar; 