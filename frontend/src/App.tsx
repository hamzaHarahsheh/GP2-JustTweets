import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, CircularProgress, Typography, IconButton, Tooltip } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CustomThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { LightMode as SunIcon, DarkMode as MoonIcon } from '@mui/icons-material';

const Sidebar = lazy(() => import('./components/Sidebar'));
const Timeline = lazy(() => import('./components/Timeline'));
const Profile = lazy(() => import('./components/Profile'));
const Explore = lazy(() => import('./components/Explore'));
const Notifications = lazy(() => import('./components/Notifications'));
const PostDetail = lazy(() => import('./components/PostDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const { toggleTheme, mode } = useThemeContext();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'inherit' }}>
      {user && !isAuthPage && (
        <Suspense fallback={<LoadingFallback />}>
          <Sidebar />
        </Suspense>
      )}
      
      {user && !isAuthPage && (
        <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`} arrow>
          <IconButton
            onClick={toggleTheme}
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
        </Tooltip>
      )}

      <main style={{ flex: 1, maxWidth: 600, margin: '0 auto', background: 'inherit' }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Timeline />
                </PrivateRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <PrivateRoute>
                  <Explore />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/post/:postId"
              element={
                <PrivateRoute>
                  <PostDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <Router>
          <CssBaseline />
          <AppLayout />
        </Router>
      </CustomThemeProvider>
    </AuthProvider>
  );
};

export default App;
