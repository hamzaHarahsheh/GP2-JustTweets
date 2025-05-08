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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await userService.getUserByUsername(username || '');
                setProfileUser(userData);
                setBio(userData.bio || '');
                
                const postsData = await postService.getPostsByUserId(userData.id);
                // Sort posts by creation date (most recent first)
                const sortedPosts = postsData.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setPosts(sortedPosts);
                setError(null);
            } catch (err) {
                setError('Failed to load profile');
                console.error('Error fetching profile:', err);
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
            console.error('Failed to update profile:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography>Loading profile...</Typography>
            </Box>
        );
    }

    if (error || !profileUser) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="error">{error || 'Profile not found'}</Typography>
            </Box>
        );
    }

    const isCurrentUser = currentUser?.id === profileUser.id;

    return (
        <Box>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={profileUser.profilePicture?.data}
                            alt={profileUser.username}
                            sx={{ width: 100, height: 100, mb: 2 }}
                        />
                        {isCurrentUser && (
                            <Button
                                startIcon={<EditIcon />}
                                onClick={() => setEditDialogOpen(true)}
                                sx={{ position: 'absolute', top: 0, right: 0 }}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>
                    <Typography variant="h5" gutterBottom>
                        {profileUser.username}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        {profileUser.email}
                    </Typography>
                    {profileUser.bio && (
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {profileUser.bio}
                        </Typography>
                    )}
                    <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                        <Box>
                            <Typography variant="h6">{profileUser.followers || 0}</Typography>
                            <Typography variant="body2" color="text.secondary">Followers</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6">{profileUser.following || 0}</Typography>
                            <Typography variant="body2" color="text.secondary">Following</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Typography variant="h6" gutterBottom>
                Posts
            </Typography>
            {posts.length === 0 ? (
                <Typography>No posts yet.</Typography>
            ) : (
                posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))
            )}

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditProfile} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Profile; 