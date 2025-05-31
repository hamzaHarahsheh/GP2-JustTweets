import React, { useState } from 'react';
import { Box, Button, TextField, Avatar, Paper, Typography, IconButton, Chip, Fade, LinearProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/api';
import { PhotoCamera, Send, EmojiEmotions } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface TweetBoxProps {
    onPostCreated: (newPost: any) => void;
}

const TweetBox: React.FC<TweetBoxProps> = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const theme = useTheme();

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        setLoading(true);
        try {
            const newPost = await postService.createPost(
                { content },
                image ? [image] : undefined
            );
            setContent('');
            setImage(null);
            setFocused(false);
            onPostCreated(newPost);
        } finally {
            setLoading(false);
        }
    };

    const profilePicUrl = user?.profilePicture?.data
        ? `data:${user.profilePicture.type};base64,${user.profilePicture.data}`
        : undefined;

    const charCount = content.length;
    const maxChars = 280;
    const isNearLimit = charCount > maxChars * 0.8;
    const isOverLimit = charCount > maxChars;

    return (
        <Paper
            elevation={0}
            sx={{
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.8) 0%, rgba(21, 32, 43, 0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(29, 161, 242, 0.1)',
                borderRadius: 4,
                p: 3,
                mb: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 32px rgba(29, 161, 242, 0.15)',
                    border: '1px solid rgba(29, 161, 242, 0.2)'
                }
            }}
        >
            <Box
                component="form"
                onSubmit={handlePost}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar
                        src={profilePicUrl}
                        alt={user?.username}
                        sx={{
                            width: 64,
                            height: 64,
                            border: '3px solid',
                            borderColor: 'primary.main',
                            background: 'linear-gradient(135deg, #1DA1F2 0%, #1976d2 100%)',
                            boxShadow: '0 4px 20px rgba(29, 161, 242, 0.3)',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 25px rgba(29, 161, 242, 0.4)'
                            }
                        }}
                    >
                        {!profilePicUrl && user?.username?.[0].toUpperCase()}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={focused ? 3 : 2}
                            maxRows={8}
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onFocus={() => setFocused(true)}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? 'rgba(25, 39, 52, 0.7)'
                                        : 'rgba(255, 255, 255, 0.7)',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s ease',
                                    fontSize: '1.1rem',
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? 'rgba(25, 39, 52, 0.9)'
                                            : 'rgba(255, 255, 255, 0.9)',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(29, 161, 242, 0.3)'
                                        }
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? 'rgba(25, 39, 52, 1)'
                                            : 'rgba(255, 255, 255, 1)',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: '2px'
                                        }
                                    }
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: theme.palette.text.secondary,
                                    opacity: 0.7,
                                    fontSize: '1.1rem'
                                }
                            }}
                        />
                        
                        {image && (
                            <Fade in={true}>
                                <Box sx={{ 
                                    mt: 2, 
                                    position: 'relative',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Button
                                        onClick={() => setImage(null)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            minWidth: 32,
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(244, 67, 54, 0.8)'
                                            }
                                        }}
                                    >
                                        ×
                                    </Button>
                                </Box>
                            </Fade>
                        )}
                    </Box>
                </Box>

                <Fade in={focused || content.length > 0}>
                    <Box>
                        {charCount > 0 && (
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min((charCount / maxChars) * 100, 100)}
                                    sx={{
                                        flex: 1,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 2,
                                            background: isOverLimit 
                                                ? 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)'
                                                : isNearLimit
                                                ? 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)'
                                                : 'linear-gradient(45deg, #1DA1F2 30%, #1976d2 90%)'
                                        }
                                    }}
                                />
                                <Typography 
                                    variant="caption" 
                                    color={isOverLimit ? 'error' : isNearLimit ? 'warning.main' : 'text.secondary'}
                                    fontWeight="600"
                                >
                                    {maxChars - charCount}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="tweet-image-upload"
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                />
                                <label htmlFor="tweet-image-upload">
                                    <IconButton 
                                        component="span"
                                        sx={{
                                            color: 'primary.main',
                                            backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(29, 161, 242, 0.2)',
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                                
                                <IconButton
                                    sx={{
                                        color: 'primary.main',
                                        backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(29, 161, 242, 0.2)',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <EmojiEmotions />
                                </IconButton>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading || !content.trim() || isOverLimit}
                                startIcon={<Send />}
                                sx={{
                                    borderRadius: 25,
                                    px: 4,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    minWidth: 120,
                                    background: 'linear-gradient(45deg, #1DA1F2 30%, #1976d2 90%)',
                                    boxShadow: '0 4px 15px rgba(29, 161, 242, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(29, 161, 242, 0.4)'
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                        boxShadow: '0 2px 10px rgba(29, 161, 242, 0.3)'
                                    },
                                    '&:disabled': {
                                        background: 'rgba(0,0,0,0.12)',
                                        transform: 'none',
                                        boxShadow: 'none'
                                    }
                                }}
                            >
                                {loading ? 'Posting...' : 'Share'}
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Box>
        </Paper>
    );
};

export default TweetBox; 