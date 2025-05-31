import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, postService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { User, Post as PostType } from '../types';
import Post from './Post';
import { Box, Typography, CircularProgress, Paper, TextField, InputAdornment, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const Explore: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
    const [posts, setPosts] = useState<PostType[]>([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setPostsLoading(true);
                const allPosts = await postService.getAllPosts();
                allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPosts(allPosts);
                setPostsError(null);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
                setPostsError('Failed to load posts');
            } finally {
                setPostsLoading(false);
            }
        };

        fetchPosts();
    }, []);

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
            console.error('Error following/unfollowing user:', err);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(180deg, rgba(29, 161, 242, 0.02) 0%, transparent 100%)',
            pb: 4
        }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Box sx={{
                    mb: 4,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backdropFilter: 'blur(20px)',
                    background: `${theme.palette.background.default}95`,
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Paper
                        elevation={0}
                        sx={{
                            background: theme.palette.mode === 'dark'
                                ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.3) 0%, rgba(21, 32, 43, 0.2) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(29, 161, 242, 0.1)',
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Discover amazing people..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'primary.main' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton 
                                            onClick={() => setSearchQuery('')}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                                    color: 'primary.main'
                                                }
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    border: 'none',
                                    '& fieldset': { border: 'none' },
                                    '&:hover fieldset': { border: 'none' },
                                    '&.Mui-focused fieldset': { border: 'none' },
                                    backgroundColor: 'transparent',
                                    fontSize: '1.1rem'
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: theme.palette.text.secondary,
                                    opacity: 0.8
                                }
                            }}
                        />
                    </Paper>
                    
                    {searchQuery && (
                        <Paper
                            elevation={8}
                            sx={{
                                position: 'relative',
                                zIndex: 20,
                                background: theme.palette.mode === 'dark'
                                    ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.95) 0%, rgba(21, 32, 43, 0.95) 100%)'
                                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 3,
                                mt: 1,
                                border: '1px solid rgba(29, 161, 242, 0.1)',
                                overflow: 'hidden'
                            }}
                        >
                            {searchLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                                    <CircularProgress size={24} />
                                    <Typography variant="body2" sx={{ ml: 2 }}>
                                        Searching...
                                    </Typography>
                                </Box>
                            ) : searchError ? (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography color="error" variant="body2">{searchError}</Typography>
                                </Box>
                            ) : searchResults.length === 0 && searchQuery.trim() !== '' && !searchLoading ? (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No users found for "{searchQuery}"
                                    </Typography>
                                </Box>
                            ) : (
                                <List sx={{ py: 0 }}>
                                    {searchResults.map((result, index) => (
                                        <ListItem 
                                            key={result.id} 
                                            sx={{
                                                borderBottom: index < searchResults.length - 1 ? '1px solid' : 'none',
                                                borderColor: 'rgba(29, 161, 242, 0.1)',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(29, 161, 242, 0.05)',
                                                    transform: 'translateX(4px)'
                                                }
                                            }}
                                            secondaryAction={
                                                result.id !== user?.id && (
                                                    <Button
                                                        variant={followingIds.has(result.id) ? 'contained' : 'outlined'}
                                                        size="small"
                                                        onClick={() => handleFollow(result.id)}
                                                        sx={{
                                                            borderRadius: 20,
                                                            px: 3,
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            minWidth: 100,
                                                            background: followingIds.has(result.id) 
                                                                ? 'linear-gradient(45deg, #1DA1F2 30%, #1976d2 90%)'
                                                                : 'transparent',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: followingIds.has(result.id) 
                                                                    ? '0 4px 12px rgba(29, 161, 242, 0.3)'
                                                                    : '0 2px 8px rgba(0,0,0,0.1)'
                                                            }
                                                        }}
                                                    >
                                                        {followingIds.has(result.id) ? 'Following' : 'Follow'}
                                                    </Button>
                                                )
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar 
                                                    src={result.profilePicture?.data ? `data:${result.profilePicture.type};base64,${result.profilePicture.data}` : undefined}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        border: '2px solid',
                                                        borderColor: 'primary.main',
                                                        transition: 'transform 0.2s ease',
                                                        '&:hover': { transform: 'scale(1.05)' }
                                                    }}
                                                >
                                                    {!result.profilePicture && result.username[0].toUpperCase()}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="600"
                                                        sx={{ 
                                                            cursor: 'pointer',
                                                            color: 'primary.main',
                                                            '&:hover': { textDecoration: 'underline' }
                                                        }}
                                                        onClick={() => navigate(`/profile/${result.username}`)}
                                                    >
                                                        @{result.username}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {result.email}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Paper>
                    )}
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.9) 0%, rgba(21, 32, 43, 0.9) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(29, 161, 242, 0.1)',
                        borderRadius: 4,
                        p: 3
                    }}
                >
                    <Typography variant="h5" fontWeight="700" sx={{ 
                        mb: 3,
                        background: 'linear-gradient(45deg, #1DA1F2 30%, #1976d2 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Explore Posts
                    </Typography>
                    
                    {postsLoading ? (
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            minHeight: '300px',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            <CircularProgress size={40} thickness={4} />
                            <Typography variant="body1" color="text.secondary">
                                Loading posts...
                            </Typography>
                        </Box>
                    ) : postsError ? (
                        <Box sx={{ 
                            p: 4, 
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
                            borderRadius: 3,
                            border: '1px solid rgba(244, 67, 54, 0.2)'
                        }}>
                            <Typography color="error" variant="h6" gutterBottom>
                                Oops! Something went wrong
                            </Typography>
                            <Typography color="text.secondary">
                                {postsError}
                            </Typography>
                        </Box>
                    ) : posts.length === 0 ? (
                        <Box sx={{ 
                            p: 6, 
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(29, 161, 242, 0.05) 0%, rgba(29, 161, 242, 0.02) 100%)',
                            borderRadius: 3,
                            border: '2px dashed rgba(29, 161, 242, 0.2)'
                        }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                No posts yet 📝
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Be the first to share something amazing!
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            {posts.map((post, index) => (
                                <Box
                                    key={post.id}
                                    sx={{
                                        opacity: 0,
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                                        '@keyframes fadeInUp': {
                                            from: {
                                                opacity: 0,
                                                transform: 'translateY(20px)'
                                            },
                                            to: {
                                                opacity: 1,
                                                transform: 'translateY(0)'
                                            }
                                        }
                                    }}
                                >
                                    <Post post={post} />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Paper>
            </div>
        </Box>
    );
};

export default Explore; 