import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService, likeService, commentService } from '../services/api';
import { Post as PostType, User, Like, Comment } from '../types';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    Avatar,
    Stack,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ChatBubbleOutline as ChatIcon,
    Share as ShareIcon,
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';

interface PostProps {
    post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [postUser, setPostUser] = useState<User | null>(null);
    const [likes, setLikes] = useState<Like[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLiked, setIsLiked] = useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [likesDialogOpen, setLikesDialogOpen] = useState(false);
    const [likeUsers, setLikeUsers] = useState<User[]>([]);
    const [loadingLikes, setLoadingLikes] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [dialogImageUrl, setDialogImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await userService.getUserById(post.userId);
                setPostUser(userData);

                const likesData = await likeService.getLikesByPostId(post.id);
                setLikes(likesData);
                setIsLiked(likesData.some(like => like.userId === user?.id));

                const commentsData = await commentService.getCommentsByPostId(post.id);
                setComments(commentsData);
            } catch (error) {
                console.error('Failed to fetch post data:', error);
            }
        };

        fetchData();
    }, [post.id, post.userId, user?.id]);

    const handleLike = async () => {
        if (!user) return;

        try {
            if (isLiked) {
                const like = likes.find(l => l.userId === user.id);
                if (like) {
                    await likeService.removeLike(like.id);
                    setLikes(likes.filter(l => l.id !== like.id));
                }
            } else {
                const newLike = await likeService.addLike({
                    postId: post.id,
                    userId: user.id,
                });
                setLikes([...likes, newLike]);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const handleAddComment = async () => {
        if (!user || !newComment.trim()) return;

        try {
            const comment = await commentService.addComment({
                postId: post.id,
                content: newComment,
            });
            setComments([...comments, comment]);
            setNewComment('');
            setCommentDialogOpen(false);
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleOpenLikesDialog = async () => {
        setLikesDialogOpen(true);
        setLoadingLikes(true);
        try {
            const users = await Promise.all(
                likes.map(async (like) => {
                    try {
                        return await userService.getUserById(like.userId);
                    } catch {
                        return null;
                    }
                })
            );
            setLikeUsers(users.filter(Boolean) as User[]);
        } finally {
            setLoadingLikes(false);
        }
    };

    const handleCloseLikesDialog = () => {
        setLikesDialogOpen(false);
        setLikeUsers([]);
    };

    const profilePicUrl = postUser?.profilePicture?.data
        ? `data:${postUser.profilePicture.type};base64,${postUser.profilePicture.data}`
        : undefined;

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Avatar
                        src={profilePicUrl}
                        alt={postUser?.username}
                        onClick={() => navigate(`/profile/${postUser?.username}`)}
                        sx={{ cursor: 'pointer' }}
                    />
                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            onClick={() => navigate(`/profile/${postUser?.username}`)}
                            sx={{ cursor: 'pointer' }}
                        >
                            {postUser?.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {new Date(post.createdAt).toLocaleString()}
                        </Typography>
                    </Box>
                </Stack>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {post.content}
                </Typography>
                {post.image && post.image.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto' }}>
                        {post.image.map((img, index) => {
                            const imageUrl = `http://localhost:8081/posts/${post.id}/image/${index}`;
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        maxWidth: 400,
                                        maxHeight: 400,
                                        width: '100%',
                                        height: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        background: '#f5f5f5',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        setDialogImageUrl(imageUrl);
                                        setOpenImageDialog(true);
                                    }}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Post image ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain',
                                            display: 'block',
                                            maxHeight: 400,
                                            maxWidth: 400,
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                )}
                <Stack direction="row" spacing={2}>
                    <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'}>
                        {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Typography
                        sx={{ cursor: 'pointer', fontWeight: 500 }}
                        onClick={handleOpenLikesDialog}
                    >
                        {likes.length}
                    </Typography>
                    <IconButton onClick={() => setCommentDialogOpen(true)}>
                        <ChatIcon />
                    </IconButton>
                    <Typography>{comments.length}</Typography>
                    <IconButton>
                        <ShareIcon />
                    </IconButton>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    {comments.map((comment) => (
                        <Box key={comment.id} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #eee', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                                src={comment.profilePictureUrl ? `http://localhost:8081${comment.profilePictureUrl}` : undefined}
                                alt={comment.username}
                                sx={{ width: 32, height: 32, bgcolor: comment.profilePictureUrl ? 'transparent' : 'grey.400', cursor: 'pointer' }}
                                onClick={() => navigate(`/profile/${comment.username}`)}
                            />
                            <Typography variant="body2" fontWeight="bold">
                                {comment.username}
                            </Typography>
                            <Typography variant="body2">{comment.content}</Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>

            <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)}>
                <DialogTitle>Comments</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        {comments.map((comment) => (
                            <Box key={comment.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar
                                    src={comment.profilePictureUrl ? `http://localhost:8081${comment.profilePictureUrl}` : undefined}
                                    alt={comment.username}
                                    sx={{ width: 32, height: 32, bgcolor: comment.profilePictureUrl ? 'transparent' : 'grey.400', cursor: 'pointer' }}
                                    onClick={() => navigate(`/profile/${comment.username}`)}
                                />
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {comment.username}
                                </Typography>
                                <Typography variant="body1">{comment.content}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddComment} variant="contained">
                        Comment
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={likesDialogOpen} onClose={handleCloseLikesDialog}>
                <DialogTitle>Liked by</DialogTitle>
                <DialogContent>
                    {loadingLikes ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box>
                            {likeUsers.length === 0 && (
                                <Typography variant="body2" color="text.secondary">No likes yet.</Typography>
                            )}
                            {likeUsers.map((likeUser) => (
                                <Box key={likeUser.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Avatar
                                        src={likeUser.profilePicture?.data
                                            ? `data:${likeUser.profilePicture.type};base64,${likeUser.profilePicture.data}`
                                            : undefined}
                                        alt={likeUser.username}
                                        sx={{ width: 32, height: 32, bgcolor: likeUser.profilePicture ? 'transparent' : 'grey.400', cursor: 'pointer' }}
                                        onClick={() => navigate(`/profile/${likeUser.username}`)}
                                    />
                                    <Typography variant="body2" fontWeight="bold">
                                        {likeUser.username}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseLikesDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openImageDialog}
                onClose={() => setOpenImageDialog(false)}
                maxWidth="md"
                PaperProps={{
                    sx: {
                        background: 'transparent',
                        boxShadow: 'none',
                        overflow: 'visible',
                    }
                }}
                BackdropProps={{
                    sx: {
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(0,0,0,0.2)'
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        minWidth: 300,
                        minHeight: 300,
                    }}
                >
                    {dialogImageUrl && (
                        <img
                            src={dialogImageUrl}
                            alt="Post"
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: 8,
                                boxShadow: 'none',
                                background: 'transparent'
                            }}
                        />
                    )}
                </Box>
            </Dialog>
        </Card>
    );
};

export default Post; 