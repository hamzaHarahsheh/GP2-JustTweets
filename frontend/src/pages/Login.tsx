import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    IconButton,
    Popper,
    Fade,
} from '@mui/material';
import { LightMode as SunIcon, DarkMode as MoonIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, error } = useAuth();
    const { toggleTheme, mode } = useThemeContext();
    const theme = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipAnchor, setTooltipAnchor] = useState<HTMLElement | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!username || !password) {
            setFormError('Please fill in all fields');
            return;
        }

        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setFormError('Invalid username or password');
        }
    };

    return (
        <>
            <IconButton
                onClick={toggleTheme}
                onMouseEnter={(e) => {
                    setTooltipAnchor(e.currentTarget);
                    setTooltipOpen(true);
                }}
                onMouseLeave={() => {
                    setTooltipOpen(false);
                    setTooltipAnchor(null);
                }}
                sx={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 1300,
                    width: 44,
                    height: 44,
                    backgroundColor: 'background.paper',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 20px rgba(29, 161, 242, 0.3)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.1) rotate(180deg)',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        boxShadow: '0 6px 25px rgba(29, 161, 242, 0.4)',
                    },
                    '&:active': {
                        transform: 'scale(0.95)',
                    },
                    backdropFilter: 'blur(10px)',
                    background: mode === 'dark' 
                        ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.95) 0%, rgba(21, 32, 43, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                }}
            >
                {mode === 'dark' ? (
                    <SunIcon sx={{ 
                        fontSize: 20,
                        color: '#FFA726',
                        filter: 'drop-shadow(0 0 8px rgba(255, 167, 38, 0.6))'
                    }} />
                ) : (
                    <MoonIcon sx={{ 
                        fontSize: 20,
                        color: '#5C6BC0',
                        filter: 'drop-shadow(0 0 8px rgba(92, 107, 192, 0.6))'
                    }} />
                )}
            </IconButton>

            <Popper
                open={tooltipOpen}
                anchorEl={tooltipAnchor}
                placement="left"
                transition
                sx={{ zIndex: 1301 }}
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                ]}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <Paper
                            elevation={0}
                            sx={{
                                background: theme.palette.mode === 'dark'
                                    ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.95) 0%, rgba(21, 32, 43, 0.95) 100%)'
                                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(29, 161, 242, 0.3)',
                                borderRadius: 4,
                                p: 2,
                                maxWidth: 200,
                                boxShadow: `0 8px 16px rgba(0, 0, 0, 0.1)`,
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    right: -8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 0,
                                    height: 0,
                                    borderTop: '8px solid transparent',
                                    borderBottom: '8px solid transparent',
                                    borderLeft: '8px solid rgba(29, 161, 242, 0.3)',
                                }
                            }}
                        >
                            <Typography variant="body1" fontWeight="500" sx={{ 
                                fontSize: '0.9rem',
                                lineHeight: 1.4,
                                textAlign: 'center'
                            }}>
                                Switch to {mode === 'dark' ? 'light' : 'dark'} mode
                            </Typography>
                        </Paper>
                    </Fade>
                )}
            </Popper>

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
                            Login
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
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Login
                            </Button>
                            <Typography variant="body2" align="center">
                                Don't have an account?{' '}
                                <Link to="/register" style={{ textDecoration: 'none' }}>
                                    Register
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default Login; 