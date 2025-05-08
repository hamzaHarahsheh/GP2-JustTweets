import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import Profile from './components/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { Typography } from '@mui/material';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// New component to handle layout
const AppLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {user && !isAuthPage && <Sidebar />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
            path="/profile/:username"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<Typography>404 Not Found</Typography>}
          />
        </Routes>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;
