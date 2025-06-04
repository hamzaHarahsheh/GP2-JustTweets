import React, { useState, useEffect, useCallback } from 'react';
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
    CircularProgress,
} from '@mui/material';
import { authService } from '../services/api';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, error } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    
    const [emailError, setEmailError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [emailChecking, setEmailChecking] = useState(false);
    const [usernameChecking, setUsernameChecking] = useState(false);
    const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

    const validateEmail = (email: string) => {
        const regex = /^[A-Za-z]+\d{2}@cit\.just\.edu\.jo$/;
        return regex.test(email);
    };

    const checkEmailUniqueness = useCallback(async (emailToCheck: string) => {
        if (!emailToCheck.trim()) {
            setEmailError(null);
            setEmailAvailable(null);
            return;
        }

        if (!validateEmail(emailToCheck)) {
            setEmailError('Email must be in the format username##@cit.just.edu.jo');
            setEmailAvailable(null);
            return;
        }

        setEmailChecking(true);
        setEmailError(null);

        try {
            const isAvailable = await authService.checkEmailAvailability(emailToCheck);
            setEmailAvailable(isAvailable);
            if (!isAvailable) {
                setEmailError('This email is already registered');
            }
        } catch (error) {
            setEmailError('Unable to check email availability');
            setEmailAvailable(null);
        } finally {
            setEmailChecking(false);
        }
    }, []);

    const checkUsernameUniqueness = useCallback(async (usernameToCheck: string) => {
        if (!usernameToCheck.trim()) {
            setUsernameError(null);
            setUsernameAvailable(null);
            return;
        }

        setUsernameChecking(true);
        setUsernameError(null);

        try {
            const isAvailable = await authService.checkUsernameAvailability(usernameToCheck);
            setUsernameAvailable(isAvailable);
            if (!isAvailable) {
                setUsernameError('This username is already taken');
            }
        } catch (error) {
            setUsernameError('Unable to check username availability');
            setUsernameAvailable(null);
        } finally {
            setUsernameChecking(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (email) {
                checkEmailUniqueness(email);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [email, checkEmailUniqueness]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (username) {
                checkUsernameUniqueness(username);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [username, checkUsernameUniqueness]);

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

        if (emailAvailable === false) {
            setFormError('Please use a different email address');
            return;
        }

        if (usernameAvailable === false) {
            setFormError('Please choose a different username');
            return;
        }

        if (emailAvailable === null || usernameAvailable === null) {
            setFormError('Please wait for validation to complete');
            return;
        }

        try {
            await register(username, email, password, bio, profilePicture || undefined);
            navigate('/');
        } catch (err: any) {
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    setFormError(err.response.data);
                } else {
                    setFormError('Registration failed. Please try again.');
                }
            } else {
                setFormError('Registration failed. Username or email might be taken.');
            }
        }
    };

    const isFormValid = emailAvailable === true && usernameAvailable === true && 
                       !emailChecking && !usernameChecking && 
                       username && email && password;

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
                            error={!!usernameError}
                            helperText={usernameError || (usernameAvailable === true ? '✓ Username available' : '')}
                            InputProps={{
                                endAdornment: usernameChecking ? <CircularProgress size={20} /> : null,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            error={!!emailError}
                            helperText={
                                emailError || 
                                (emailAvailable === true ? '✓ Email available' : 'Format: username##@cit.just.edu.jo')
                            }
                            InputProps={{
                                endAdornment: emailChecking ? <CircularProgress size={20} /> : null,
                            }}
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
                            disabled={!isFormValid}
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