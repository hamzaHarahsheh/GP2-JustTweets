import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService, postService } from '../services/api';
import { User, Post as PostType } from '../types';
import {
    Box,
    Typography,
    Avatar,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Divider,
    useTheme,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import Post from './Post';

const Profile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const { user: currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [pictureDialogOpen, setPictureDialogOpen] = useState(false);

    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await userService.getUserByUsername(username || '');
                setProfileUser(userData);
                setBio(userData.bio || '');
                const postsData = await postService.getPostsByUserId(userData.id);
                setPosts(postsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                setError(null);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    const handleEditProfile = async () => {
        if (!profileUser) return;
        try {
            if (profilePicture) {
                await userService.updateProfilePicture(profileUser.id, profilePicture);
            }
            setEditDialogOpen(false);
            const updatedUser = await userService.getUserByUsername(username || '');
            setProfileUser(updatedUser);
        } catch (error) {
            // handle error
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography variant="h6" color="text.secondary">Loading profile...</Typography>
            </Box>
        );
    }

    if (error || !profileUser) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography color="error">{error || 'Profile not found'}</Typography>
            </Box>
        );
    }

    const isCurrentUser = currentUser?.id === profileUser.id;
    const profilePicUrl = profileUser.profilePicture?.data
        ? `data:${profileUser.profilePicture.type};base64,${profileUser.profilePicture.data}`
        : undefined;

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: 'auto',
                mt: 6,
                bgcolor: theme.palette.background.paper,
                borderRadius: 4,
                boxShadow: '0 4px 32px 0 rgba(0,0,0,0.08)',
                p: { xs: 2, sm: 4 },
                minHeight: '70vh',
            }}
        >
            {/* Profile Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar
                    src={profilePicUrl}
                    alt={profileUser.username}
                    sx={{
                        width: 90,
                        height: 90,
                        border: `4px solid ${theme.palette.primary.main}`,
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
                        transition: 'box-shadow 0.2s',
                        '&:hover': {
                            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
                        },
                        cursor: 'pointer',
                        backgroundColor: theme.palette.grey[100],
                    }}
                    onClick={() => setPictureDialogOpen(true)}
                />
                <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: 1 }}>
                        {profileUser.username}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        {profileUser.email}
                    </Typography>
                    {profileUser.bio && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            {profileUser.bio}
                        </Typography>
                    )}
                    <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} align="center">
                                {profileUser.followers ?? 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Followers</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} align="center">
                                {profileUser.following ?? 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Following</Typography>
                        </Box>
                    </Stack>
                </Box>
                {isCurrentUser && (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        sx={{ ml: 'auto', borderRadius: 3, textTransform: 'none' }}
                        onClick={() => setEditDialogOpen(true)}
                    >
                        Edit
                    </Button>
                )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Posts Section */}
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Posts
            </Typography>
            {posts.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                    No posts yet.
                </Typography>
            ) : (
                posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))
            )}

            {/* Edit Profile Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                            style={{ marginBottom: 16 }}
                        />
                        {/* Add more fields as needed */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditProfile} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Profile Picture Dialog */}
            <Dialog
                open={pictureDialogOpen}
                onClose={() => setPictureDialogOpen(false)}
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
                        alt={profileUser.username}
                        sx={{ width: 300, height: 300, boxShadow: 3 }}
                    />
                </Box>
            </Dialog>
        </Box>
    );
};

export default Profile; 