import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import { notificationService, userService } from '../services/api';
import {
    Favorite as LikeIcon,
    Comment as CommentIcon,
    PersonAdd as FollowIcon,
    Chat as FriendCommentIcon,
    Circle as UnreadIcon,
} from '@mui/icons-material';

interface Notification {
    id: string;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'FRIEND_COMMENT';
    sourceUserId: string;
    postId?: string;
    content: string;
    read: boolean;
    createdAt: string;
}

interface NotificationWithUsername extends Notification {
    sourceUsername?: string;
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationWithUsername[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [hoveredNotification, setHoveredNotification] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();
    const userId = user?.id;

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            // Mark all notifications as read when visiting the page
            markAllAsRead();
        }
    }, [userId]);

    const fetchNotifications = async () => {
        if (!userId) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        try {
            setError(null); // Clear any previous errors
            const notifications = await notificationService.getUserNotifications(userId);
            
            // Fetch usernames for each notification
            const notificationsWithUsernames = await Promise.all(
                notifications.map(async (notification) => {
                    try {
                        const sourceUser = await userService.getUserById(notification.sourceUserId);
                        return {
                            ...notification,
                            sourceUsername: sourceUser.username
                        };
                    } catch (error) {
                        console.error(`Error fetching user for ID ${notification.sourceUserId}:`, error);
                        return {
                            ...notification,
                            sourceUsername: notification.sourceUserId // fallback to userId if username fetch fails
                        };
                    }
                })
            );
            
            setNotifications(notificationsWithUsernames);
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
            if (error.response) {
                if (error.response.status === 404) {
                    setNotFound(true);
                } else if (error.response.status === 401) {
                    setError('Authentication required. Please log in again.');
                } else if (error.response.status === 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError(`Error: ${error.response.status}. Please try again later.`);
                }
            } else if (error.request) {
                setError('Unable to connect to server. Please check your internet connection.');
            } else {
                setError('Unable to load notifications at this time. Please try again later.');
            }
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        if (!userId) return;
        
        try {
            await notificationService.markAllAsRead(userId);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const handleNotificationClick = (notification: NotificationWithUsername) => {
        switch (notification.type) {
            case 'LIKE':
            case 'COMMENT':
            case 'FRIEND_COMMENT':
                if (notification.postId) {
                    navigate(`/post/${notification.postId}`);
                }
                break;
            case 'FOLLOW':
                if (notification.sourceUsername) {
                    navigate(`/profile/${notification.sourceUsername}`);
                }
                break;
            default:
                if (notification.postId) {
                    navigate(`/post/${notification.postId}`);
                }
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'LIKE':
                return <LikeIcon sx={{ color: '#e91e63', fontSize: 20 }} />;
            case 'COMMENT':
                return <CommentIcon sx={{ color: '#2196f3', fontSize: 20 }} />;
            case 'FOLLOW':
                return <FollowIcon sx={{ color: '#4caf50', fontSize: 20 }} />;
            case 'FRIEND_COMMENT':
                return <FriendCommentIcon sx={{ color: '#ff9800', fontSize: 20 }} />;
            default:
                return <UnreadIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />;
        }
    };

    const getNotificationContent = (notification: NotificationWithUsername): string => {
        const username = notification.sourceUsername || notification.sourceUserId;
        
        switch (notification.type) {
            case 'LIKE':
                return `${username} liked your post`;
            case 'COMMENT':
                return `${username} commented on your post`;
            case 'FOLLOW':
                return `${username} started following you`;
            case 'FRIEND_COMMENT':
                return `${username} commented on a post`;
            default:
                return notification.content;
        }
    };

    const getNotificationCardStyle = (notification: NotificationWithUsername, isHovered: boolean) => ({
        backgroundColor: !notification.read ? 
            (theme.palette.mode === 'dark' ? '#1e3a8a' : '#eff6ff') : 
            theme.palette.background.paper,
        border: `1px solid ${!notification.read ? 
            (theme.palette.mode === 'dark' ? '#3b82f6' : '#93c5fd') : 
            (theme.palette.mode === 'dark' ? '#404040' : '#e5e7eb')}`,
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        boxShadow: isHovered ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderColor: isHovered ? 
            (theme.palette.mode === 'dark' ? '#606060' : '#9ca3af') : 
            (!notification.read ? 
                (theme.palette.mode === 'dark' ? '#3b82f6' : '#93c5fd') : 
                (theme.palette.mode === 'dark' ? '#404040' : '#e5e7eb')),
        marginBottom: '8px',
    });

    const containerStyle = {
        position: 'fixed' as const,
        top: '0',
        left: '260px', // Right after the sidebar
        width: 'calc(100vw - 260px)',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
        padding: '16px',
        overflowY: 'auto' as const,
        zIndex: 1,
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={{ maxWidth: '600px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '256px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                border: '2px solid #3b82f6',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <p style={{ marginTop: '16px', color: theme.palette.text.secondary }}>Loading notifications...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={{ maxWidth: '600px' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: theme.palette.text.primary, marginBottom: '32px' }}>Notifications</h1>
                    <div style={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#dc2626' : '#fef2f2', 
                        border: `1px solid ${theme.palette.mode === 'dark' ? '#ef4444' : '#fecaca'}`, 
                        borderRadius: '8px', 
                        padding: '24px' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flexShrink: 0 }}>
                                <svg style={{ height: '20px', width: '20px', color: theme.palette.mode === 'dark' ? '#fca5a5' : '#b91c1c' }} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div style={{ marginLeft: '12px' }}>
                                <p style={{ fontSize: '0.875rem', color: theme.palette.mode === 'dark' ? '#fca5a5' : '#b91c1c' }}>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || notifications.length === 0) {
        return (
            <div style={containerStyle}>
                <div style={{ maxWidth: '600px' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: theme.palette.text.primary, marginBottom: '32px' }}>Notifications</h1>
                    <div style={{ 
                        backgroundColor: theme.palette.background.paper, 
                        borderRadius: '8px', 
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', 
                        border: `1px solid ${theme.palette.mode === 'dark' ? '#404040' : '#e5e7eb'}`, 
                        padding: '48px' 
                    }}>
                        <div style={{ textAlign: 'left' }}>
                            <svg style={{ height: '64px', width: '64px', color: theme.palette.text.secondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <h3 style={{ marginTop: '16px', fontSize: '1.125rem', fontWeight: 'medium', color: theme.palette.text.primary }}>No notifications yet</h3>
                            <p style={{ marginTop: '8px', color: theme.palette.text.secondary }}>You're all caught up! Check back later for new updates.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={{ maxWidth: '600px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: theme.palette.text.primary, marginBottom: '32px' }}>Notifications</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            style={{
                                ...getNotificationCardStyle(notification, hoveredNotification === notification.id),
                                width: '100%',
                                maxWidth: '600px'
                            }}
                            onClick={() => handleNotificationClick(notification)}
                            onMouseEnter={() => setHoveredNotification(notification.id)}
                            onMouseLeave={() => setHoveredNotification(null)}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{ flexShrink: 0, marginTop: '4px' }}>
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 'medium', color: theme.palette.text.primary }}>
                                            {getNotificationContent(notification)}
                                        </p>
                                        {!notification.read && (
                                            <div style={{ flexShrink: 0 }}>
                                                <UnreadIcon sx={{ color: '#3b82f6', fontSize: 8 }} />
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: theme.palette.text.secondary, marginTop: '4px' }}>
                                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Notifications; 