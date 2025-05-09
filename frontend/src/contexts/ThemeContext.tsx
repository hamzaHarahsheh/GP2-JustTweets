import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext({ toggleTheme: () => {}, mode: 'light' });

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
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