import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
} from '@mui/material';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
        { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
        { text: 'Profile', icon: <PersonIcon />, path: `/profile/${user?.username}` },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const profilePicUrl = user?.profilePicture?.data ? `data:${user.profilePicture.type};base64,${user.profilePicture.data}` : undefined;

    return (
        <Box sx={{ width: 250, bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ cursor: profilePicUrl ? 'pointer' : 'default' }} onClick={() => profilePicUrl && setDialogOpen(true)}>
                    <Avatar
                        src={profilePicUrl}
                        alt={user?.username}
                        sx={{ width: 40, height: 40 }}
                    />
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {user?.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user?.email}
                    </Typography>
                </Box>
            </Box>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#e3f2fd', // light blue
                                    color: '#1976d2', // blue text
                                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                        color: '#1976d2', // blue for icon and text
                                    },
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                    color: '#1976d2',
                                },
                            },
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
            {/* Dialog for full-size profile picture */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs">
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        src={profilePicUrl}
                        alt={user?.username}
                        sx={{ width: 300, height: 300 }}
                    />
                </Box>
            </Dialog>
        </Box>
    );
};

export default Sidebar; 