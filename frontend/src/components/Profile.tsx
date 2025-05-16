import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    CircularProgress,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

// Lazy load components
const Post = lazy(() => import('./Post'));
const EditProfileDialog = lazy(() => import('./dialogs/EditProfileDialog'));
const FollowersDialog = lazy(() => import('./dialogs/FollowersDialog'));
const FollowingDialog = lazy(() => import('./dialogs/FollowingDialog'));

const LoadingFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
    </Box>
);

const Profile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const { user: currentUser, setUser } = useAuth();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [pictureDialogOpen, setPictureDialogOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
    const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
    const [followersList, setFollowersList] = useState<User[]>([]);
    const [followingList, setFollowingList] = useState<User[]>([]);

    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await userService.getUserByUsername(username || '');
                setProfileUser(userData);
                setBio(userData.bio || '');
                const postsData = await postService.getPostsByUserId(userData.id);
                setPosts(postsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                setError(null);
                // Check if current user is following this profile
                if (currentUser && userData.id !== currentUser.id) {
                    const following = await userService.getFollowing(currentUser.id);
                    setIsFollowing(following.some(u => u.id === userData.id));
                }
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username, currentUser]);

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

    const handleFollow = async () => {
        if (!profileUser) return;
        setFollowLoading(true);
        try {
            if (isFollowing) {
                await userService.unfollowUser(profileUser.id);
                setIsFollowing(false);
            } else {
                await userService.followUser(profileUser.id);
                setIsFollowing(true);
            }
            // Always fetch the latest user data after follow/unfollow
            const updatedUser = await userService.getUserByUsername(username || '');
            setProfileUser(updatedUser);
            // If current user, also update their state
            if (currentUser && currentUser.id === updatedUser.id) {
                setUser(updatedUser);
            }
        } catch (err) {
            // handle error
        } finally {
            setFollowLoading(false);
        }
    };

    const handleOpenFollowers = async () => {
        if (!profileUser) return;
        const users = await userService.getFollowers(profileUser.id);
        setFollowersList(users);
        setFollowersDialogOpen(true);
    };

    const handleOpenFollowing = async () => {
        if (!profileUser) return;
        const users = await userService.getFollowing(profileUser.id);
        setFollowingList(users);
        setFollowingDialogOpen(true);
    };

    const handleNavigateToProfile = (username: string, closeDialog: () => void) => {
        closeDialog();
        navigate(`/profile/${username}`);
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
                        <Box sx={{ cursor: 'pointer' }} onClick={handleOpenFollowers}>
                            <Typography variant="subtitle1" fontWeight={600} align="center">
                                {profileUser.followers ?? 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Followers</Typography>
                        </Box>
                        <Box sx={{ cursor: 'pointer' }} onClick={handleOpenFollowing}>
                            <Typography variant="subtitle1" fontWeight={600} align="center">
                                {profileUser.following ?? 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Following</Typography>
                        </Box>
                    </Stack>
                </Box>
                {isCurrentUser ? (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        sx={{ ml: 'auto', borderRadius: 3, textTransform: 'none' }}
                        onClick={() => setEditDialogOpen(true)}
                    >
                        Edit
                    </Button>
                ) : (
                    <Button
                        variant={isFollowing ? 'contained' : 'outlined'}
                        color={isFollowing ? 'primary' : 'inherit'}
                        sx={{ ml: 'auto', borderRadius: 3, textTransform: 'none' }}
                        onClick={handleFollow}
                        disabled={followLoading}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
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
                <Suspense fallback={<LoadingFallback />}>
                    {posts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))}
                </Suspense>
            )}

            {/* Edit Profile Dialog */}
            <Suspense fallback={null}>
                <EditProfileDialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    profileUser={profileUser}
                    bio={bio}
                    setBio={setBio}
                    profilePicture={profilePicture}
                    setProfilePicture={setProfilePicture}
                    onSave={handleEditProfile}
                />
            </Suspense>

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

            {/* Followers Dialog */}
            <Suspense fallback={null}>
                <FollowersDialog
                    open={followersDialogOpen}
                    onClose={() => setFollowersDialogOpen(false)}
                    followers={followersList}
                    onProfileClick={handleNavigateToProfile}
                />
            </Suspense>

            {/* Following Dialog */}
            <Suspense fallback={null}>
                <FollowingDialog
                    open={followingDialogOpen}
                    onClose={() => setFollowingDialogOpen(false)}
                    following={followingList}
                    onProfileClick={handleNavigateToProfile}
                />
            </Suspense>
        </Box>
    );
};

export default Profile; 