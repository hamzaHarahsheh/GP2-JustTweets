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
import { CustomThemeProvider, useThemeContext } from './contexts/ThemeContext';

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
  const { toggleTheme, mode } = useThemeContext();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'inherit' }}>
      {user && !isAuthPage && <Sidebar />}
      <main style={{ flex: 1, maxWidth: 600, margin: '0 auto', background: 'inherit' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
          <button onClick={toggleTheme} style={{
            background: 'none', border: 'none', color: '#1DA1F2', fontWeight: 600, cursor: 'pointer'
          }}>
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
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
