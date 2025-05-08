import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginResponse } from '../types';
import { authService, userService, api } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, bio?: string, profilePicture?: File) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const username = localStorage.getItem('username');
            if (username) {
                userService.getUserByUsername(username)
                    .then(user => {
                        setUser(user);
                        setLoading(false);
                    })
                    .catch(err => {
                        setError('Failed to load user data');
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: LoginResponse = await authService.login({ username, password });
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('username', username);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
            const fullUser = await userService.getUserByUsername(username);
            setUser(fullUser);
            localStorage.setItem('user', JSON.stringify(fullUser));
        } catch (err) {
            setError('Invalid username or password');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string, bio?: string, profilePicture?: File) => {
        try {
            setLoading(true);
            setError(null);
            const user = await authService.register({ username, email, password, bio, profilePicture });
            const fullUser = await userService.getUserById(user.id);
            setUser(fullUser);
            localStorage.setItem('user', JSON.stringify(fullUser));
        } catch (err) {
            setError('Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 