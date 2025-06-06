import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    IconButton,
    Popper,
    Fade,
    alpha,
    Grid,
} from '@mui/material';
import { LightMode as SunIcon, DarkMode as MoonIcon, School as SchoolIcon } from '@mui/icons-material';
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

            <Box sx={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                overflow: 'hidden'
            }}>
                <Box 
                    sx={{
                        width: '50%',
                        height: '100vh',
                        backgroundImage: 'url(/JUSTlogo.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: mode === 'dark' 
                                ? 'linear-gradient(135deg, rgba(21, 32, 43, 0.85) 0%, rgba(25, 39, 52, 0.85) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(240, 248, 255, 0.6) 100%)',
                            zIndex: 1,
                        }
                    }}
                >
                    <Box sx={{ 
                        position: 'relative', 
                        zIndex: 2, 
                        textAlign: 'center',
                        px: 4,
                        animation: 'fadeInUp 1s ease-out'
                    }}>
                        <SchoolIcon sx={{ 
                            fontSize: 80, 
                            color: mode === 'dark' ? 'white' : '#1976d2', 
                            mb: 3,
                            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))'
                        }} />
                        <Typography 
                            variant="h3" 
                            fontWeight="700" 
                            color={mode === 'dark' ? 'white' : '#1565c0'}
                            gutterBottom
                            sx={{ 
                                textShadow: mode === 'dark' ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(21, 101, 192, 0.3)',
                                mb: 2,
                                fontFamily: "Freestyle Script, cursive",
                                fontSize: { xs: '3rem', md: '4rem' },
                                letterSpacing: '-0.02em'
                            }}
                        >
                            JustTweets
                        </Typography>
                        <Typography 
                            variant="h6" 
                            color={mode === 'dark' ? 'white' : '#1976d2'}
                            sx={{ 
                                opacity: 0.9,
                                textShadow: mode === 'dark' ? '0 1px 5px rgba(0,0,0,0.2)' : '0 1px 5px rgba(25, 118, 210, 0.2)',
                                maxWidth: 400,
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            Connect with your university community and share your thoughts
                        </Typography>
                    </Box>
                </Box>

                <Box 
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.background.default,
                        p: 4
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, sm: 6, md: 8 },
                            width: '100%',
                            maxWidth: 480,
                            background: 'transparent',
                            animation: 'fadeInRight 1s ease-out 0.3s both'
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography 
                                variant="h4" 
                                fontWeight="600" 
                                color="text.primary"
                                sx={{ mb: 1 }}
                            >
                                Sign In
                            </Typography>
                            <Typography 
                                variant="body1" 
                                color="text.secondary"
                                sx={{ opacity: 0.8 }}
                            >
                                Access your university social network
                            </Typography>
                        </Box>

                        {(error || formError) && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    width: '100%', 
                                    mb: 3,
                                    borderRadius: 3,
                                    animation: 'slideDown 0.3s ease-out'
                                }}
                            >
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
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: theme.palette.background.paper,
                                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                                        }
                                    }
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
                                sx={{
                                    mb: 4,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: theme.palette.background.paper,
                                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                                        }
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{ 
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    background: 'linear-gradient(45deg, #1DA1F2 30%, #1976d2 90%)',
                                    boxShadow: '0 8px 25px rgba(29, 161, 242, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 35px rgba(29, 161, 242, 0.4)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0px)',
                                    },
                                    mb: 3
                                }}
                            >
                                Sign In
                            </Button>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Don't have an account?
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="text"
                                    sx={{ 
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        }
                                    }}
                                >
                                    Create Account
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            <style>
                {`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `}
            </style>
        </>
    );
};

export default Login; 