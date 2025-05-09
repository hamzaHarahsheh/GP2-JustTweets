import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { postService } from '../services/api';
import { Post as PostType } from '../types';
import Post from './Post';
import TweetBox from './TweetBox';

const Timeline: React.FC = () => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await postService.getAllPosts();
                // Sort posts by createdAt (most recent first)
                data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPosts(data);
                setError(null);
            } catch (err) {
                setError('Failed to load posts');
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

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
            <TweetBox onPostCreated={handleNewPost} />
            {posts.length === 0 ? (
                <Box sx={{ p: 2 }}>
                    <Typography>No posts yet. Be the first to post!</Typography>
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