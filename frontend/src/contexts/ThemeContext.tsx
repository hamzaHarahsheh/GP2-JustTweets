import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    toggleTheme: () => void;
    mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType>({ toggleTheme: () => {}, mode: 'light' });

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode as ThemeMode) || 'light';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: { main: '#1DA1F2' },
                    background: {
                        default: mode === 'dark' ? '#15202b' : '#fff',
                        paper: mode === 'dark' ? '#192734' : '#fff',
                    },
                    text: {
                        primary: mode === 'dark' ? '#fff' : '#0f1419',
                        secondary: mode === 'dark' ? '#8899a6' : '#536471',
                    },
                },
                shape: { borderRadius: 16 },
                typography: {
                    fontFamily: 'Segoe UI, Arial, sans-serif',
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ toggleTheme, mode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}; 