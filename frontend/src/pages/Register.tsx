import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    Avatar,
} from '@mui/material';
import { postService } from '../services/api';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, error } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        const regex = /^[A-Za-z]+\d{2}@cit\.just\.edu\.jo$/;
        return regex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!username || !email || !password) {
            setFormError('Please fill in all required fields');
            return;
        }

        if (!validateEmail(email)) {
            setFormError('Email must be in the format username##@cit.just.edu.jo');
            return;
        }

        try {
            await register(username, email, password, bio, profilePicture || undefined);
            navigate('/');
        } catch (err) {
            setFormError('Registration failed. Username or email might be taken.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Register
                    </Typography>
                    {(error || formError) && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error || formError}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            helperText="Format: username##@cit.just.edu.jo"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Bio"
                            multiline
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            margin="normal"
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Upload Profile Picture
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                            />
                        </Button>
                        {profilePicture && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Selected: {profilePicture.name}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Typography variant="body2" align="center">
                            Already have an account?{' '}
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register; 