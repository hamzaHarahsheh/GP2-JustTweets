import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import Explore from './components/Explore';
import Notifications from './components/Notifications';
import Sidebar from './components/Sidebar';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <div className="flex">
                                <Sidebar />
                                <div className="ml-64 flex-1">
                                    <Home />
                                </div>
                            </div>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <div className="flex">
                                <Sidebar />
                                <div className="ml-64 flex-1">
                                    <Profile />
                                </div>
                            </div>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/explore"
                    element={
                        <PrivateRoute>
                            <div className="flex">
                                <Sidebar />
                                <div className="ml-64 flex-1">
                                    <Explore />
                                </div>
                            </div>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <PrivateRoute>
                            <div className="flex">
                                <Sidebar />
                                <div className="ml-64 flex-1">
                                    <Notifications />
                                </div>
                            </div>
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    );
};

export default App; 