import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/api';
import {
    Home as HomeIcon,
    Explore as ExploreIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Avatar,
    Typography,
    Dialog,
    Badge,
} from '@mui/material';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const userId = user?.id;

    useEffect(() => {
        if (userId) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [userId]);

    const fetchUnreadCount = async () => {
        if (!userId) return;
        
        try {
            const unreadCount = await notificationService.getUnreadCount(userId);
            setUnreadCount(unreadCount);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
        { 
            text: 'Notifications', 
            icon: unreadCount > 0 ? (
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            ) : (
                <NotificationsIcon />
            ), 
            path: '/notifications' 
        },
        { text: 'Profile', icon: <PersonIcon />, path: `/profile/${user?.username}` },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const profilePicUrl = user?.profilePicture?.data ? `data:${user.profilePicture.type};base64,${user.profilePicture.data}` : undefined;

    const isActive = (path: string) => location.pathname === path;

    return (
        <Box sx={{ width: 260, bgcolor: 'background.paper', minHeight: '100vh', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                    src={profilePicUrl}
                    onClick={() => profilePicUrl && setDialogOpen(true)}
                    sx={{
                        width: 48,
                        height: 48,
                        cursor: profilePicUrl ? 'pointer' : 'default',
                        '&:hover': { opacity: 0.8 }
                    }}
                />
                <Box>
                    <Typography fontWeight="bold">
                        {user?.username}
                    </Typography>
                </Box>
            </Box>
            
            <List>
                {menuItems.map((item) => (
                    <ListItem disablePadding key={item.text}>
                        <ListItemButton
                            selected={isActive(item.path)}
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 8,
                                mb: 1,
                                backgroundColor: isActive(item.path) ? '#1a2733' : 'inherit',
                                color: isActive(item.path) ? '#1DA1F2' : 'inherit',
                            }}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{ borderRadius: 8, mb: 1 }}
                    >
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                PaperProps={{
                    sx: {
                        background: 'none !important',
                        boxShadow: 'none !important',
                        outline: 'none !important',
                        minWidth: 0,
                        minHeight: 0,
                        overflow: 'visible',
                    }
                }}
                BackdropProps={{
                    sx: {
                        background: 'transparent !important',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 0,
                        m: 0,
                        minWidth: 0,
                        minHeight: 0,
                        background: 'none !important',
                        boxShadow: 'none !important',
                    }}
                >
                    <Avatar
                        src={profilePicUrl}
                        alt={user?.username}
                        sx={{ width: 300, height: 300, boxShadow: 3 }}
                    />
                </Box>
            </Dialog>
        </Box>
    );
};

export default Sidebar; 