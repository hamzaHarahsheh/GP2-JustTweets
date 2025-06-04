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
    People as PeopleIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { User } from '../../types';
import { TransitionProps } from '@mui/material/transitions';
import { useTheme } from '@mui/material/styles';

interface FollowersDialogProps {
    open: boolean;
    onClose: () => void;
    followers: User[];
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

const FollowersDialog: React.FC<FollowersDialogProps> = ({
    open,
    onClose,
    followers,
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
                        <PeopleIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight="600">
                            Followers
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                            backgroundColor: 'rgba(29, 161, 242, 0.1)',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 10,
                            fontWeight: 500
                        }}>
                            {followers.length}
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
                    {followers.length === 0 ? (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <PeopleIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                            <Typography variant="body1" color="text.secondary">
                                No followers yet
                            </Typography>
                            <Typography variant="body2" color="text.disabled">
                                When people follow this account, they'll appear here
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ maxHeight: '50vh', overflowY: 'auto', pr: 1 }}>
                            {followers.map((follower, index) => (
                                <Fade in={true} timeout={300 + (index * 100)} key={follower.id}>
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
                                        onClick={() => onProfileClick(follower.username, onClose)}
                                    >
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 2 
                                        }}>
                                            <Avatar
                                                src={follower.profilePicture?.data 
                                                    ? `data:${follower.profilePicture.type};base64,${follower.profilePicture.data}` 
                                                    : undefined}
                                                alt={follower.username}
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
                                                    {follower.username}
                                                </Typography>
                                                {follower.bio && (
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
                                                        {follower.bio}
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

export default FollowersDialog; 