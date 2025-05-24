import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/notifications/user/${userId}`);
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setNotFound(true);
            } else {
                setError('Unable to load notifications at this time. Please try again later.');
            }
            setLoading(false);
        }
    };

    const handleNotificationClick = (notification) => {
        if (notification.postId) {
            navigate(`/post/${notification.postId}`);
        }
    };

    const getNotificationContent = (notification) => {
        switch (notification.type) {
            case 'LIKE':
                return `${notification.sourceUserId} liked your post`;
            case 'COMMENT':
                return `${notification.sourceUserId} commented on your post`;
            case 'FOLLOW':
                return `${notification.sourceUserId} started following you`;
            case 'FRIEND_COMMENT':
                return `${notification.sourceUserId} commented on a post`;
            default:
                return notification.content;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading notifications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || notifications.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">You're all caught up! Check back later for new updates.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            notification.read ? 'bg-white' : 'bg-blue-50'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <p className="text-gray-800">{getNotificationContent(notification)}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications; 