import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/api';
import { Post as PostType } from '../types';
import {
    Box,
    TextField,
    Button,
    IconButton,
    Avatar,
    Stack,
} from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';

interface TweetBoxProps {
    onPostCreated?: (post: PostType) => void;
}

const TweetBox: React.FC<TweetBoxProps> = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            setImages([...images, ...newImages]);
            
            // Create preview URLs
            const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
            setPreviewUrls([...previewUrls, ...newPreviewUrls]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && images.length === 0) return;

        try {
            await postService.createPost({ content }, images);
            setContent('');
            setImages([]);
            setPreviewUrls([]);
            if (onPostCreated) {
                onPostCreated({ content } as PostType);
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        const newPreviewUrls = [...previewUrls];
        newImages.splice(index, 1);
        newPreviewUrls.splice(index, 1);
        setImages(newImages);
        setPreviewUrls(newPreviewUrls);
    };

    return (
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Avatar
                        src={user?.profilePicture?.data}
                        alt={user?.username}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="What's happening?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        variant="outlined"
                    />
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {previewUrls.map((url, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                            <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                            />
                            <Button
                                size="small"
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    minWidth: 'auto',
                                    p: 0.5,
                                }}
                            >
                                ×
                            </Button>
                        </Box>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        color="primary"
                    >
                        <ImageIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!content.trim() && images.length === 0}
                    >
                        Tweet
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default TweetBox; 