import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Avatar,
} from '@mui/material';
import { User } from '../../types';

interface FollowingDialogProps {
    open: boolean;
    onClose: () => void;
    following: User[];
    onProfileClick: (username: string, closeDialog: () => void) => void;
}

const FollowingDialog: React.FC<FollowingDialogProps> = ({
    open,
    onClose,
    following,
    onProfileClick,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Following</DialogTitle>
            <DialogContent>
                {following.length === 0 ? (
                    <Typography>Not following anyone yet.</Typography>
                ) : (
                    following.map(u => (
                        <Box key={u.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Avatar
                                src={u.profilePicture?.data ? `data:${u.profilePicture.type};base64,${u.profilePicture.data}` : undefined}
                                sx={{ cursor: 'pointer' }}
                                onClick={() => onProfileClick(u.username, onClose)}
                            />
                            <Typography
                                fontWeight={500}
                                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => onProfileClick(u.username, onClose)}
                            >
                                {u.username}
                            </Typography>
                        </Box>
                    ))
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FollowingDialog; 