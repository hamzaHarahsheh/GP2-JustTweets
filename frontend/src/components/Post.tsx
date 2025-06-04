import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService, likeService, commentService, roleService } from '../services/api';
import { Post as PostType, User, Like, Comment, Role } from '../types';
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
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ChatBubbleOutline as ChatIcon,
    Share as ShareIcon,
    Send as SendIcon,
    Close as CloseIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { TransitionProps } from '@mui/material/transitions';
import { useTheme } from '@mui/material/styles';

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

interface CommentActionsProps {
    comment: Comment;
    canEdit: boolean;
    canDelete: boolean;
    onEdit: (commentId: string, content: string) => void;
    onDelete: (commentId: string) => void;
}

const CommentActions: React.FC<CommentActionsProps> = ({
    comment,
    canEdit,
    canDelete,
    onEdit,
    onDelete,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        onEdit(comment.id, comment.content);
        handleClose();
    };

    const handleDelete = () => {
        onDelete(comment.id);
        handleClose();
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{
                    color: 'text.secondary',
                    '&:hover': {
                        backgroundColor: 'rgba(29, 161, 242, 0.1)',
                        color: 'primary.main'
                    }
                }}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: 120,
                    }
                }}
            >
                {canEdit && (
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                )}
                {canDelete && (
                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};

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
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [role, setRole] = useState<Role | null>(null);

    const theme = useTheme();

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

    const handleEditComment = (commentId: string, content: string) => {
        if (!commentId || content === undefined || content === null) {
            console.error('Invalid comment data for editing');
            return;
        }
        setEditingCommentId(commentId);
        setEditingCommentContent(content);
    };

    const handleSaveComment = async () => {
        if (!user || !editingCommentContent.trim() || !editingCommentId) return;

        try {
            const updatedComment = await commentService.updateComment(editingCommentId, editingCommentContent);
            setComments(comments.map(comment =>
                comment.id === editingCommentId ? { ...comment, ...updatedComment } : comment
            ));
            setEditingCommentId(null);
            setEditingCommentContent('');
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!user || !commentId) return;

        try {
            await commentService.deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const canEditComment = (comment: Comment): boolean => {
        if (!user || !comment) return false;
        if (comment.userId === user.id) return true;
        if (role?.type === 'ADMIN') return true;
        return false;
    };

    const canDeleteComment = (comment: Comment): boolean => {
        if (!user || !comment) return false;
        if (comment.userId === user.id) return true;
        if (post.userId === user.id) return true;
        if (role?.type === 'ADMIN') return true;
        return false;
    };

    useEffect(() => {
        const loadUserRole = async () => {
            if (!user) return;
            try {
                const roles = await roleService.getUserRoles(user.id);
                setRole(roles.length > 0 ? roles[0] : null);
            } catch (error) {
                console.error('Failed to load user roles:', error);
            }
        };
        loadUserRole();
    }, [user]);

    const profilePicUrl = postUser?.profilePicture?.data
        ? `data:${postUser.profilePicture.type};base64,${postUser.profilePicture.data}`
        : undefined;

    return (
        <Card 
            sx={{ 
                mb: 3,
                borderRadius: 4,
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.9) 0%, rgba(21, 32, 43, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(29, 161, 242, 0.1)',
                boxShadow: '0 8px 32px rgba(29, 161, 242, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(29, 161, 242, 0.15)',
                    border: '1px solid rgba(29, 161, 242, 0.2)'
                }
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                    <Avatar
                        src={profilePicUrl}
                        alt={postUser?.username}
                        onClick={() => navigate(`/profile/${postUser?.username}`)}
                        sx={{ 
                            cursor: 'pointer',
                            width: 56,
                            height: 56,
                            border: '3px solid',
                            borderColor: 'primary.main',
                            background: 'linear-gradient(135deg, #1DA1F2 0%, #1976d2 100%)',
                            boxShadow: '0 4px 20px rgba(29, 161, 242, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: '0 6px 25px rgba(29, 161, 242, 0.4)'
                            }
                        }}
                    >
                        {!profilePicUrl && postUser?.username?.[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h6"
                            fontWeight="700"
                            onClick={() => navigate(`/profile/${postUser?.username}`)}
                            sx={{ 
                                cursor: 'pointer',
                                color: 'primary.main',
                                mb: 0.5,
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            @{postUser?.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {new Date(post.createdAt).toLocaleString()}
                        </Typography>
                    </Box>
                </Stack>
                
                <Typography 
                    variant="body1" 
                    sx={{ 
                        mb: 3,
                        fontSize: '1.1rem',
                        lineHeight: 1.7,
                        wordBreak: 'break-word'
                    }}
                >
                    {post.content}
                </Typography>
                
                {post.image && post.image.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, overflowX: 'auto' }}>
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
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        background: '#f8fafc',
                                        cursor: 'pointer',
                                        border: '1px solid rgba(29, 161, 242, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: '0 8px 32px rgba(29, 161, 242, 0.2)'
                                        }
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
                
                <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton 
                            onClick={handleLike} 
                            sx={{
                                color: isLiked ? 'error.main' : 'text.secondary',
                                backgroundColor: isLiked ? 'rgba(244, 67, 54, 0.1)' : 'rgba(29, 161, 242, 0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: isLiked ? 'rgba(244, 67, 54, 0.2)' : 'rgba(29, 161, 242, 0.1)',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <Typography
                            variant="body2"
                            sx={{ 
                                cursor: 'pointer', 
                                fontWeight: 600,
                                color: isLiked ? 'error.main' : 'text.secondary',
                                '&:hover': { color: 'error.main' }
                            }}
                            onClick={handleOpenLikesDialog}
                        >
                            {likes.length}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton 
                            onClick={() => setCommentDialogOpen(true)}
                            sx={{
                                color: 'text.secondary',
                                backgroundColor: 'rgba(29, 161, 242, 0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                    color: 'primary.main',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <ChatIcon />
                        </IconButton>
                        <Typography variant="body2" fontWeight="600" color="text.secondary">
                            {comments.length}
                        </Typography>
                    </Box>
                    
                    <IconButton
                        sx={{
                            color: 'text.secondary',
                            backgroundColor: 'rgba(29, 161, 242, 0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                color: 'primary.main',
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <ShareIcon />
                    </IconButton>
                </Stack>
                
                {comments.length > 0 && (
                    <Box sx={{ 
                        mt: 3,
                        p: 3,
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(29, 161, 242, 0.08) 0%, rgba(29, 161, 242, 0.03) 100%)'
                            : 'linear-gradient(135deg, rgba(29, 161, 242, 0.03) 0%, rgba(29, 161, 242, 0.01) 100%)',
                        border: '1px solid rgba(29, 161, 242, 0.1)'
                    }}>
                        {comments.slice(0, 3).map((comment) => (
                            <Box 
                                key={comment.id} 
                                sx={{ 
                                    mb: 2, 
                                    pl: 3, 
                                    borderLeft: '3px solid', 
                                    borderColor: 'primary.main',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 2,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(29, 161, 242, 0.05)',
                                        borderRadius: 2,
                                        transform: 'translateX(4px)'
                                    }
                                }}
                            >
                                <Avatar
                                    src={comment.profilePictureUrl ? `http://localhost:8081${comment.profilePictureUrl}` : undefined}
                                    alt={comment.username || 'User'}
                                    sx={{ 
                                        width: 36, 
                                        height: 36, 
                                        bgcolor: comment.profilePictureUrl ? 'transparent' : 'primary.light', 
                                        cursor: 'pointer',
                                        border: '2px solid',
                                        borderColor: 'primary.main',
                                        transition: 'transform 0.2s ease',
                                        '&:hover': { transform: 'scale(1.1)' }
                                    }}
                                    onClick={() => navigate(`/profile/${comment.username}`)}
                                >
                                    {!comment.profilePictureUrl && comment.username?.[0]?.toUpperCase()}
                                </Avatar>
                                <Typography 
                                    variant="body2" 
                                    fontWeight="600"
                                    sx={{ 
                                        color: 'primary.main',
                                        cursor: 'pointer',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                    onClick={() => navigate(`/profile/${comment.username}`)}
                                >
                                    @{comment.username || 'Unknown'}
                                </Typography>
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                    {comment.content || ''}
                                </Typography>
                            </Box>
                        ))}
                        {comments.length > 3 && (
                            <Typography 
                                variant="body2" 
                                color="primary.main"
                                sx={{ 
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                                onClick={() => setCommentDialogOpen(true)}
                            >
                                View all {comments.length} comments
                            </Typography>
                        )}
                    </Box>
                )}
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
                                {comments
                                    .filter(comment => comment && comment.id && comment.username)
                                    .map((comment, index) => (
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
                                                    alt={comment.username || 'User'}
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
                                                    {!comment.profilePictureUrl && comment.username?.[0]?.toUpperCase()}
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                                            @{comment.username || 'Unknown'}
                                                        </Typography>
                                                        {(canEditComment(comment) || canDeleteComment(comment)) && (
                                                            <CommentActions 
                                                                comment={comment}
                                                                canEdit={canEditComment(comment)}
                                                                canDelete={canDeleteComment(comment)}
                                                                onEdit={handleEditComment}
                                                                onDelete={handleDeleteComment}
                                                            />
                                                        )}
                                                    </Box>
                                                    {editingCommentId === comment.id ? (
                                                        <Box sx={{ mt: 1 }}>
                                                            <TextField
                                                                fullWidth
                                                                multiline
                                                                rows={2}
                                                                value={editingCommentContent}
                                                                onChange={(e) => setEditingCommentContent(e.target.value)}
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{ mb: 1 }}
                                                            />
                                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setEditingCommentId(null);
                                                                        setEditingCommentContent('');
                                                                    }}
                                                                    size="small"
                                                                    sx={{ color: 'text.secondary' }}
                                                                >
                                                                    <CancelIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={handleSaveComment}
                                                                    size="small"
                                                                    sx={{ color: 'primary.main' }}
                                                                    disabled={!editingCommentContent.trim()}
                                                                >
                                                                    <SaveIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    ) : (
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                mt: 0.5,
                                                                lineHeight: 1.6,
                                                                wordBreak: 'break-word'
                                                            }}
                                                        >
                                                            {comment.content || ''}
                                                        </Typography>
                                                    )}
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

            <Dialog 
                open={likesDialogOpen} 
                onClose={handleCloseLikesDialog}
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
                            <FavoriteIcon sx={{ color: 'error.main' }} />
                            <Typography variant="h6" fontWeight="600">
                                Liked by
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ 
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 10,
                                fontWeight: 500
                            }}>
                                {likeUsers.length}
                            </Typography>
                        </Box>
                        <IconButton 
                            onClick={handleCloseLikesDialog}
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                    color: 'error.main'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                </Box>
                
                <DialogContent sx={{ px: 0, py: 0 }}>
                    <Box sx={{ px: 3, py: 2 }}>
                        {loadingLikes ? (
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                minHeight: 120,
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <CircularProgress color="error" />
                                <Typography variant="body2" color="text.secondary">
                                    Loading likes...
                                </Typography>
                            </Box>
                        ) : likeUsers.length === 0 ? (
                            <Box sx={{ 
                                textAlign: 'center', 
                                py: 6,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <FavoriteBorderIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                                <Typography variant="body1" color="text.secondary">
                                    No likes yet
                                </Typography>
                                <Typography variant="body2" color="text.disabled">
                                    Be the first to like this post!
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ maxHeight: '50vh', overflowY: 'auto', pr: 1 }}>
                                {likeUsers.map((likeUser, index) => (
                                    <Fade in={true} timeout={300 + (index * 100)} key={likeUser.id}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                backgroundColor: 'background.paper',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    borderColor: 'error.main',
                                                    backgroundColor: 'rgba(244, 67, 54, 0.02)',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)'
                                                }
                                            }}
                                            onClick={() => navigate(`/profile/${likeUser.username}`)}
                                        >
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 2 
                                            }}>
                                                <Avatar
                                                    src={likeUser.profilePicture?.data 
                                                        ? `data:${likeUser.profilePicture.type};base64,${likeUser.profilePicture.data}` 
                                                        : undefined}
                                                    alt={likeUser.username}
                                                    sx={{ 
                                                        width: 48, 
                                                        height: 48,
                                                        border: '2px solid rgba(244, 67, 54, 0.1)',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            borderColor: 'error.main',
                                                            transform: 'scale(1.05)'
                                                        }
                                                    }}
                                                />
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography 
                                                        variant="subtitle1" 
                                                        fontWeight="600"
                                                        sx={{
                                                            color: 'text.primary',
                                                            transition: 'color 0.2s ease',
                                                            '&:hover': {
                                                                color: 'error.main'
                                                            }
                                                        }}
                                                    >
                                                        {likeUser.username}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Fade>
                                ))}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
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