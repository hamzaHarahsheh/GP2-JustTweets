import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Avatar,
    IconButton,
    Fade,
    Paper,
    Slide,
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { User } from '../../types';
import { TransitionProps } from '@mui/material/transitions';
import { useTheme } from '@mui/material/styles';

interface FollowingDialogProps {
    open: boolean;
    onClose: () => void;
    following: User[];
    onProfileClick: (username: string, closeDialog: () => void) => void;
}

const SlideTransition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FollowingDialog: React.FC<FollowingDialogProps> = ({
    open,
    onClose,
    following,
    onProfileClick,
}) => {
    const theme = useTheme();

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
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
                        <PersonAddIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight="600">
                            Following
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                            backgroundColor: 'rgba(29, 161, 242, 0.1)',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 10,
                            fontWeight: 500
                        }}>
                            {following.length}
                        </Typography>
                    </Box>
                    <IconButton 
                        onClick={onClose}
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
                    {following.length === 0 ? (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <PersonAddIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                            <Typography variant="body1" color="text.secondary">
                                Not following anyone yet
                            </Typography>
                            <Typography variant="body2" color="text.disabled">
                                When you follow people, they'll appear here
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ maxHeight: '50vh', overflowY: 'auto', pr: 1 }}>
                            {following.map((followedUser, index) => (
                                <Fade in={true} timeout={300 + (index * 100)} key={followedUser.id}>
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
                                                borderColor: 'primary.main',
                                                backgroundColor: 'rgba(29, 161, 242, 0.02)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(29, 161, 242, 0.15)'
                                            }
                                        }}
                                        onClick={() => onProfileClick(followedUser.username, onClose)}
                                    >
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 2 
                                        }}>
                                            <Avatar
                                                src={followedUser.profilePicture?.data 
                                                    ? `data:${followedUser.profilePicture.type};base64,${followedUser.profilePicture.data}` 
                                                    : undefined}
                                                alt={followedUser.username}
                                                sx={{ 
                                                    width: 48, 
                                                    height: 48,
                                                    border: '2px solid rgba(29, 161, 242, 0.1)',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
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
                                                            color: 'primary.main'
                                                        }
                                                    }}
                                                >
                                                    {followedUser.username}
                                                </Typography>
                                                {followedUser.bio && (
                                                    <Typography 
                                                        variant="body2" 
                                                        color="text.secondary"
                                                        sx={{
                                                            mt: 0.5,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical'
                                                        }}
                                                    >
                                                        {followedUser.bio}
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
            </DialogContent>
        </Dialog>
    );
};

export default FollowingDialog; 