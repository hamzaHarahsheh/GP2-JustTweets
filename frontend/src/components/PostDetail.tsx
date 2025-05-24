import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import { postService } from '../services/api';
import { Post as PostType } from '../types';
import Post from './Post';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const PostDetail: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();
    const [post, setPost] = useState<PostType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) {
                setError('Post ID not found');
                setLoading(false);
                return;
            }

            try {
                const postData = await postService.getPostById(postId);
                setPost(postData);
                setLoading(false);
            } catch (error: any) {
                console.error('Error fetching post:', error);
                if (error.response && error.response.status === 404) {
                    setError('Post not found');
                } else {
                    setError('Failed to load post');
                }
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const containerStyle = {
        position: 'fixed' as const,
        top: '0',
        left: '260px', 
        width: 'calc(100vw - 260px)',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
        padding: '16px',
        overflowY: 'auto' as const,
        zIndex: 1,
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={{ maxWidth: '600px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '256px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <CircularProgress />
                            <Typography style={{ marginTop: '16px', color: theme.palette.text.secondary }}>Loading post...</Typography>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div style={containerStyle}>
                <div style={{ maxWidth: '600px' }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        style={{ marginBottom: '16px', color: '#1DA1F2' }}
                    >
                        Back
                    </Button>
                    <div style={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#dc2626' : '#fef2f2', 
                        border: `1px solid ${theme.palette.mode === 'dark' ? '#ef4444' : '#fecaca'}`, 
                        borderRadius: '8px', 
                        padding: '24px' 
                    }}>
                        <Typography variant="h6" style={{ color: theme.palette.mode === 'dark' ? '#fca5a5' : '#b91c1c' }}>
                            {error || 'Post not found'}
                        </Typography>
                        <Typography style={{ color: theme.palette.mode === 'dark' ? '#fca5a5' : '#b91c1c', marginTop: '8px' }}>
                            The post you're looking for might have been deleted or moved.
                        </Typography>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={{ maxWidth: '600px' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: '16px', color: '#1DA1F2' }}
                >
                    Back
                </Button>
                <Post post={post} />
            </div>
        </div>
    );
};

export default PostDetail; 