import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
} from '@mui/material';
import { User } from '../../types';

interface EditProfileDialogProps {
    open: boolean;
    onClose: () => void;
    profileUser: User;
    bio: string;
    setBio: (bio: string) => void;
    profilePicture: File | null;
    setProfilePicture: (file: File | null) => void;
    onSave: () => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
    open,
    onClose,
    bio,
    setBio,
    profilePicture,
    setProfilePicture,
    onSave,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                        style={{ marginBottom: 16 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog; 