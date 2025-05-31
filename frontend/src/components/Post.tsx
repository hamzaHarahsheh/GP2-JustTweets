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
    Slide,
    Divider,
    Paper,
    Fade,
    InputAdornment,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ChatBubbleOutline as ChatIcon,
    Share as ShareIcon,
    Send as SendIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { TransitionProps } from '@mui/material/transitions';

interface PostProps {
    post: PostType;
}

const SlideTransition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

            <Dialog 
                open={commentDialogOpen} 
                onClose={() => setCommentDialogOpen(false)}
                TransitionComponent={SlideTransition}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden',
                        maxHeight: '85vh',
                        background: 'linear-gradient(135deg, rgba(29, 161, 242, 0.05) 0%, rgba(29, 161, 242, 0.02) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(29, 161, 242, 0.1)',
                    }
                }}
                BackdropProps={{
                    sx: {
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(0,0,0,0.3)'
                    }
                }}
            >
                <Box sx={{ 
                    position: 'sticky', 
                    top: 0, 
                    background: 'inherit', 
                    zIndex: 1,
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(29, 161, 242, 0.1)'
                }}>
                    <DialogTitle sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        py: 2,
                        px: 3,
                        background: 'transparent'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ChatIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="h6" fontWeight="600">
                                Comments
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ 
                                backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 10,
                                fontWeight: 500
                            }}>
                                {comments.length}
                            </Typography>
                        </Box>
                        <IconButton 
                            onClick={() => setCommentDialogOpen(false)}
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                    color: 'primary.main'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                </Box>
                
                <DialogContent sx={{ px: 0, py: 0 }}>
                    <Box sx={{ px: 3, py: 2 }}>
                        {comments.length === 0 ? (
                            <Box sx={{ 
                                textAlign: 'center', 
                                py: 6,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <ChatIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                                <Typography variant="body1" color="text.secondary">
                                    No comments yet
                                </Typography>
                                <Typography variant="body2" color="text.disabled">
                                    Be the first to share your thoughts!
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ maxHeight: '40vh', overflowY: 'auto', pr: 1 }}>
                                {comments.map((comment, index) => (
                                    <Fade in={true} timeout={300 + (index * 100)} key={comment.id}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                backgroundColor: 'background.paper',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    backgroundColor: 'rgba(29, 161, 242, 0.02)',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 12px rgba(29, 161, 242, 0.15)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <Avatar
                                                    src={comment.profilePictureUrl ? `http://localhost:8081${comment.profilePictureUrl}` : undefined}
                                                    alt={comment.username}
                                                    sx={{ 
                                                        width: 40, 
                                                        height: 40, 
                                                        bgcolor: comment.profilePictureUrl ? 'transparent' : 'primary.light', 
                                                        cursor: 'pointer',
                                                        border: '2px solid',
                                                        borderColor: 'primary.main',
                                                        transition: 'transform 0.2s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.05)'
                                                        }
                                                    }}
                                                    onClick={() => navigate(`/profile/${comment.username}`)}
                                                >
                                                    {!comment.profilePictureUrl && comment.username[0].toUpperCase()}
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography 
                                                        variant="subtitle2" 
                                                        fontWeight="600"
                                                        sx={{ 
                                                            cursor: 'pointer',
                                                            color: 'primary.main',
                                                            '&:hover': {
                                                                textDecoration: 'underline'
                                                            }
                                                        }}
                                                        onClick={() => navigate(`/profile/${comment.username}`)}
                                                    >
                                                        @{comment.username}
                                                    </Typography>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            mt: 0.5,
                                                            lineHeight: 1.6,
                                                            wordBreak: 'break-word'
                                                        }}
                                                    >
                                                        {comment.content}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Fade>
                                ))}
                            </Box>
                        )}
                    </Box>
                    
                    <Divider sx={{ borderColor: 'rgba(29, 161, 242, 0.2)' }} />
                    
                    <Box sx={{ p: 3, backgroundColor: 'rgba(29, 161, 242, 0.02)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar
                                src={user?.profilePicture?.data 
                                    ? `data:${user.profilePicture.type};base64,${user.profilePicture.data}` 
                                    : undefined}
                                alt={user?.username}
                                sx={{ 
                                    width: 40, 
                                    height: 40,
                                    border: '2px solid',
                                    borderColor: 'primary.main',
                                    bgcolor: user?.profilePicture ? 'transparent' : 'primary.light'
                                }}
                            >
                                {!user?.profilePicture && user?.username?.[0].toUpperCase()}
                            </Avatar>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Share your thoughts..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleAddComment}
                                                disabled={!newComment.trim()}
                                                sx={{
                                                    color: 'primary.main',
                                                    '&:disabled': {
                                                        color: 'text.disabled'
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(29, 161, 242, 0.1)'
                                                    }
                                                }}
                                            >
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'background.paper',
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main'
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2
                                        }
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mt: 2 
                        }}>
                            <Typography variant="caption" color="text.secondary">
                                {newComment.length}/280 characters
                            </Typography>
                            <Button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                variant="contained"
                                startIcon={<SendIcon />}
                                sx={{
                                    borderRadius: 20,
                                    px: 3,
                                    py: 1,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #1DA1F2 30%, #1976d2 90%)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(29, 161, 242, 0.3)'
                                    },
                                    '&:disabled': {
                                        background: 'rgba(0,0,0,0.12)',
                                        transform: 'none',
                                        boxShadow: 'none'
                                    }
                                }}
                            >
                                Comment
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
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