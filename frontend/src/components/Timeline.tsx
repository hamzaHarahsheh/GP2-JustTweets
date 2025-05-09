import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { postService, userService } from '../services/api';
import { Post as PostType, User } from '../types';
import Post from './Post';
import TweetBox from './TweetBox';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const Timeline: React.FC = () => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [following, setFollowing] = useState<User[]>([]);
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (!user) return;
                // Get following list (user objects)
                const followingList: User[] = await userService.getFollowing(user.id);
                setFollowing(followingList);
                setFollowingIds(new Set(followingList.map(u => u.id)));
                // Include current user id
                const allowedUserIds = new Set([user.id, ...followingList.map(u => u.id)]);
                // Fetch all posts
                const data = await postService.getAllPosts();
                // Filter posts by allowed user ids
                const filtered = data.filter(post => allowedUserIds.has(post.userId));
                // Sort posts by createdAt (most recent first)
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPosts(filtered);
                setError(null);
            } catch (err) {
                setError('Failed to load posts');
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [user]);

    // User search logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setSearchError(null);
            return;
        }
        setSearchLoading(true);
        setSearchError(null);
        const timer = setTimeout(async () => {
            try {
                const results = await userService.searchUsers(searchQuery.trim());
                setSearchResults(results);
            } catch (err) {
                setSearchError('Failed to search users');
            } finally {
                setSearchLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleFollow = async (userId: string) => {
        try {
            if (followingIds.has(userId)) {
                const res: any = await userService.unfollowUser(userId);
                setFollowingIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(userId);
                    return newSet;
                });
                if (res && typeof res.followersCount === 'number') {
                    setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, followers: res.followersCount } : u));
                }
            } else {
                const res: any = await userService.followUser(userId);
                setFollowingIds(prev => new Set(prev).add(userId));
                if (res && typeof res.followersCount === 'number') {
                    setSearchResults(prev => prev.map(u => u.id === userId ? { ...u, followers: res.followersCount } : u));
                }
            }
        } catch (err) {
            // Optionally show error
        }
    };

    const handleNewPost = (newPost: PostType) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography>Loading posts...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* User Search Bar */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search users by username or email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setSearchQuery('')}>
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                {searchQuery && (
                    <Box sx={{ position: 'relative', zIndex: 10, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2, mt: 1 }}>
                        {searchLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : searchError ? (
                            <Typography color="error" sx={{ p: 2 }}>{searchError}</Typography>
                        ) : searchResults.length === 0 && searchQuery.trim() !== '' && !searchLoading ? (
                            <Typography variant="body2" color="textSecondary" sx={{ px: 2, py: 1 }}>
                                No users found.
                            </Typography>
                        ) : (
                            <List>
                                {searchResults.map(result => (
                                    <ListItem key={result.id} secondaryAction={
                                        result.id !== user?.id && (
                                            <Button
                                                variant={followingIds.has(result.id) ? 'contained' : 'outlined'}
                                                color={followingIds.has(result.id) ? 'primary' : 'inherit'}
                                                size="small"
                                                onClick={() => handleFollow(result.id)}
                                            >
                                                {followingIds.has(result.id) ? 'Following' : 'Follow'}
                                            </Button>
                                        )
                                    }>
                                        <ListItemAvatar>
                                            <Avatar src={result.profilePicture?.data ? `data:${result.profilePicture.type};base64,${result.profilePicture.data}` : undefined} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<span style={{ cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate(`/profile/${result.username}`)}>{result.username}</span>}
                                            secondary={result.email}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                )}
            </Box>
            <TweetBox onPostCreated={handleNewPost} />
            {posts.length === 0 ? (
                <Box sx={{ p: 2 }}>
                    {following.length === 0 ? (
                        <Typography>You're not following anyone yet. Start following users to see their posts!</Typography>
                    ) : (
                        <Typography>No posts yet from you or people you follow.</Typography>
                    )}
                </Box>
            ) : (
                posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))
            )}
        </Box>
    );
};

export default Timeline; 