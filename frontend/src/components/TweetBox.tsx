import React, { useState } from 'react';
import { Box, Button, TextField, Avatar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/api';

interface TweetBoxProps {
    onPostCreated: (newPost: any) => void;
}

const TweetBox: React.FC<TweetBoxProps> = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

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
            onPostCreated(newPost);
        } finally {
            setLoading(false);
        }
    };

    const profilePicUrl = user?.profilePicture?.data
        ? `data:${user.profilePicture.type};base64,${user.profilePicture.data}`
        : undefined;

    return (
        <Box
            component="form"
            onSubmit={handlePost}
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                mb: 3,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
            }}
        >
            <Avatar
                src={profilePicUrl}
                alt={user?.username}
                sx={{
                    width: 56,
                    height: 56,
                    border: (theme) => `3px solid ${theme.palette.primary.main}`,
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
                    backgroundColor: (theme) => theme.palette.grey[100],
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            />
            <Box sx={{ flex: 1 }}>
                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={6}
                    placeholder="What's happening?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="tweet-image-upload"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="tweet-image-upload">
                        <Button component="span" variant="outlined" size="small">
                            Add Image
                        </Button>
                    </label>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !content.trim()}
                        sx={{ ml: 'auto', borderRadius: 3, textTransform: 'none' }}
                    >
                        {loading ? 'Posting...' : 'Tweet'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default TweetBox; 