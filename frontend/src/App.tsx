import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, CircularProgress, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CustomThemeProvider, useThemeContext } from './contexts/ThemeContext';

const Sidebar = lazy(() => import('./components/Sidebar'));
const Timeline = lazy(() => import('./components/Timeline'));
const Profile = lazy(() => import('./components/Profile'));
const Explore = lazy(() => import('./components/Explore'));
const Notifications = lazy(() => import('./components/Notifications'));
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
      <main style={{ flex: 1, maxWidth: 600, margin: '0 auto', background: 'inherit' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
          <button onClick={toggleTheme} style={{
            background: 'none', border: 'none', color: '#1DA1F2', fontWeight: 600, cursor: 'pointer'
          }}>
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
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
