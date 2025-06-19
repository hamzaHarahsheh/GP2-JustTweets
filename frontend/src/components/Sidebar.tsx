import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/api';
import { chatService } from '../services/chatService';
import {
    Home as HomeIcon,
    Explore as ExploreIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    School as SchoolIcon,
    Message as MessageIcon,
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
    Paper,
    Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [showWelcome, setShowWelcome] = useState(true);
    const theme = useTheme();
    const userId = user?.id;

    useEffect(() => {
        if (userId) {
            fetchUnreadCount();
            fetchUnreadMessagesCount();
            const interval = setInterval(() => {
                fetchUnreadCount();
                fetchUnreadMessagesCount();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [userId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 5000);
        
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (location.pathname === '/notifications' && userId) {
            setTimeout(() => {
                fetchUnreadCount();
            }, 1000); 
        }
    }, [location.pathname, userId]);

    const fetchUnreadCount = async () => {
        if (!userId) return;
        
        try {
            const unreadCount = await notificationService.getUnreadCount(userId);
            setUnreadCount(unreadCount);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchUnreadMessagesCount = async () => {
        if (!userId) return;
        
        try {
            const unreadMessagesCount = await chatService.getTotalUnreadCount();
            setUnreadMessagesCount(unreadMessagesCount);
        } catch (error) {
            console.error('Error fetching unread messages count:', error);
        }
    };

    const handleMenuItemClick = (path: string) => {
        if (path === '/notifications' && unreadCount > 0) {
            setUnreadCount(0);
        }
        if (path === '/messages' && unreadMessagesCount > 0) {
            setTimeout(() => fetchUnreadMessagesCount(), 1000);
        }
        navigate(path);
    };

    const menuItems = [
        { name: 'Home', icon: <HomeIcon />, path: '/' },
        { name: 'Explore', icon: <ExploreIcon />, path: '/explore' },
        { 
            name: 'Messages', 
            icon: unreadMessagesCount > 0 ? (
                <Badge badgeContent={unreadMessagesCount} color="error">
                    <MessageIcon />
                </Badge>
            ) : (
                <MessageIcon />
            ), 
            path: '/messages' 
        },
        { name: 'Resources', icon: <SchoolIcon />, path: '/resources' },
        { 
            name: 'Notifications', 
            icon: unreadCount > 0 ? (
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            ) : (
                <NotificationsIcon />
            ), 
            path: '/notifications' 
        },
        { name: 'Profile', icon: <PersonIcon />, path: `/profile/${user?.username}` }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const profilePicUrl = user?.profilePicture?.data ? `data:${user.profilePicture.type};base64,${user.profilePicture.data}` : undefined;

    const isActive = (path: string) => location.pathname === path;

    return (
        <Paper
            elevation={0}
            sx={{
                width: 280,
                minHeight: '100vh',
                background: 'linear-gradient(180deg, rgba(29, 161, 242, 0.05) 0%, rgba(29, 161, 242, 0.02) 50%, transparent 100%)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(29, 161, 242, 0.1)',
                p: 3,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                p: 2,
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.8) 0%, rgba(21, 32, 43, 0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(29, 161, 242, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 32px rgba(29, 161, 242, 0.15)'
                }
            }}>
                <Avatar
                    src={profilePicUrl}
                    onClick={() => profilePicUrl && setDialogOpen(true)}
                    sx={{
                        width: 50,
                        height: 50,
                        cursor: profilePicUrl ? 'pointer' : 'default',
                        border: '3px solid',
                        borderColor: 'primary.main',
                        background: 'linear-gradient(135deg, #1DA1F2 0%, #1976d2 100%)',
                        boxShadow: '0 4px 20px rgba(29, 161, 242, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                            transform: 'scale(1.1)',
                            boxShadow: '0 6px 25px rgba(29, 161, 242, 0.4)'
                        }
                    }}
                >
                    {!profilePicUrl && user?.username?.[0].toUpperCase()}
                </Avatar>
                <Box>
                    <Typography 
                        variant="h6" 
                        fontWeight="700"
                        sx={{ 
                            background: 'linear-gradient(45deg, #1DA1F2 30%, #1976d2 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5,
                            fontSize: '1.1rem'
                        }}
                    >
                        {user?.username}
                    </Typography>
                    {showWelcome && (
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                                transition: 'opacity 0.5s ease',
                                opacity: showWelcome ? 1 : 0
                            }}
                        >
                            Welcome back! 👋
                        </Typography>
                    )}
                </Box>
            </Box>
            
            <List sx={{ flex: 1, py: 0 }}>
                {menuItems.map((item, index) => (
                    <ListItem 
                        disablePadding 
                        key={item.name}
                        sx={{
                            mb: 1,
                            opacity: 0,
                            animation: `slideIn 0.5s ease-out ${index * 0.1}s forwards`,
                            '@keyframes slideIn': {
                                from: {
                                    opacity: 0,
                                    transform: 'translateX(-30px)'
                                },
                                to: {
                                    opacity: 1,
                                    transform: 'translateX(0)'
                                }
                            }
                        }}
                    >
                        <ListItemButton
                            selected={isActive(item.path)}
                            onClick={() => handleMenuItemClick(item.path)}
                            sx={{
                                borderRadius: 3,
                                p: 2,
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                backgroundColor: isActive(item.path) 
                                    ? 'rgba(29, 161, 242, 0.1)' 
                                    : 'transparent',
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: isActive(item.path) ? 4 : 0,
                                    background: 'linear-gradient(180deg, #1DA1F2 0%, #1976d2 100%)',
                                    borderRadius: '0 2px 2px 0',
                                    transition: 'width 0.3s ease'
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(29, 161, 242, 0.08)',
                                    transform: 'translateX(8px)',
                                    boxShadow: '0 4px 20px rgba(29, 161, 242, 0.15)',
                                    '&:before': {
                                        width: 4
                                    }
                                }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                                    minWidth: 48,
                                    transition: 'all 0.3s ease',
                                    transform: isActive(item.path) ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.name}
                                primaryTypographyProps={{
                                    fontWeight: isActive(item.path) ? 700 : 500,
                                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                                    fontSize: '1.1rem'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
                
                <Divider sx={{ my: 3, borderColor: 'rgba(29, 161, 242, 0.2)' }} />
                
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 3,
                            p: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                transform: 'translateX(8px)',
                                boxShadow: '0 4px 20px rgba(244, 67, 54, 0.15)',
                                '& .MuiListItemIcon-root': {
                                    color: 'error.main',
                                    transform: 'scale(1.1)'
                                },
                                '& .MuiListItemText-primary': {
                                    color: 'error.main'
                                }
                            }
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: 'text.secondary',
                                minWidth: 48,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Logout"
                            primaryTypographyProps={{
                                fontWeight: 500,
                                fontSize: '1.1rem'
                            }}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    transition: 'color 0.3s ease'
                                }
                            }}
                        />
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
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
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
                        sx={{ 
                            width: 320, 
                            height: 320, 
                            boxShadow: '0 20px 60px rgba(29, 161, 242, 0.3)',
                            border: '4px solid',
                            borderColor: 'primary.main'
                        }}
                    />
                </Box>
            </Dialog>
        </Paper>
    );
};

export default Sidebar; 