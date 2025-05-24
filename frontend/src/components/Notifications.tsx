import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import { Avatar, Button } from '@mui/material';
import { notificationService, userService } from '../services/api';
import {
    Favorite as LikeIcon,
    Comment as CommentIcon,
    PersonAdd as FollowIcon,
    Chat as FriendCommentIcon,
    PostAdd as NewPostIcon,
    Circle as UnreadIcon,
    DoneAll as MarkAllReadIcon,
} from '@mui/icons-material';

interface Notification {
    id: string;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'FRIEND_COMMENT' | 'NEW_POST';
    sourceUserId: string;
    postId?: string;
    content: string;
    read: boolean;
    createdAt: string;
}

interface NotificationWithUserData extends Notification {
    sourceUsername?: string;
    sourceUserProfilePicture?: {
        type: string;
        data: string;
    };
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationWithUserData[]>([]);
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
            // Don't mark all as read automatically - let users click individual notifications
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
            
            // Fetch usernames and profile pictures for each notification
            const notificationsWithUserData = await Promise.all(
                notifications.map(async (notification) => {
                    try {
                        const sourceUser = await userService.getUserById(notification.sourceUserId);
                        return {
                            ...notification,
                            sourceUsername: sourceUser.username,
                            sourceUserProfilePicture: sourceUser.profilePicture
                        };
                    } catch (error) {
                        console.error(`Error fetching user for ID ${notification.sourceUserId}:`, error);
                        return {
                            ...notification,
                            sourceUsername: notification.sourceUserId, // fallback to userId if username fetch fails
                            sourceUserProfilePicture: undefined
                        };
                    }
                })
            );
            
            setNotifications(notificationsWithUserData);
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
            // Update local state to mark all notifications as read
            setNotifications(prev => 
                prev.map(n => ({ ...n, read: true }))
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const handleNotificationClick = async (notification: NotificationWithUserData) => {
        // Mark this specific notification as read when clicked
        if (!notification.read) {
            try {
                await notificationService.markAsRead(notification.id);
                // Update local state to reflect the notification as read
                setNotifications(prev => 
                    prev.map(n => 
                        n.id === notification.id 
                            ? { ...n, read: true }
                            : n
                    )
                );
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }

        // Navigate based on notification type
        switch (notification.type) {
            case 'LIKE':
            case 'COMMENT':
            case 'FRIEND_COMMENT':
            case 'NEW_POST':
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
            case 'NEW_POST':
                return <NewPostIcon sx={{ color: '#9c27b0', fontSize: 20 }} />;
            default:
                return <UnreadIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />;
        }
    };

    const getNotificationContent = (notification: NotificationWithUserData): string => {
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
            case 'NEW_POST':
                return `${username} shared a new post`;
            default:
                return notification.content;
        }
    };

    const getUserAvatar = (notification: NotificationWithUserData) => {
        const profilePicUrl = notification.sourceUserProfilePicture?.data 
            ? `data:${notification.sourceUserProfilePicture.type};base64,${notification.sourceUserProfilePicture.data}`
            : undefined;

        return (
            <Avatar
                src={profilePicUrl}
                alt={notification.sourceUsername}
                sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.75rem',
                    bgcolor: theme.palette.mode === 'dark' ? '#404040' : '#e5e7eb',
                    color: theme.palette.text.secondary,
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#606060' : '#d1d5db'}`,
                }}
            >
                {!profilePicUrl && notification.sourceUsername ? notification.sourceUsername[0].toUpperCase() : '?'}
            </Avatar>
        );
    };

    const getNotificationCardStyle = (notification: NotificationWithUserData, isHovered: boolean) => ({
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: theme.palette.text.primary, margin: 0 }}>Notifications</h1>
                    {notifications.some(n => !n.read) && (
                        <Button
                            startIcon={<MarkAllReadIcon />}
                            onClick={markAllAsRead}
                            variant="outlined"
                            size="small"
                            sx={{
                                color: theme.palette.text.secondary,
                                borderColor: theme.palette.mode === 'dark' ? '#404040' : '#e5e7eb',
                                '&:hover': {
                                    borderColor: theme.palette.mode === 'dark' ? '#606060' : '#9ca3af',
                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(64, 64, 64, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                                }
                            }}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
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
                                <div style={{ 
                                    flexShrink: 0, 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    gap: '4px',
                                    marginTop: '4px'
                                }}>
                                    {getNotificationIcon(notification.type)}
                                    {getUserAvatar(notification)}
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