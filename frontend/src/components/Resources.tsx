import React, { useState } from 'react';
import { Box, Typography, Paper, Card, CardContent, IconButton, Chip, TextField, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Description, Quiz, School, Download, Search, Folder, InsertDriveFile } from '@mui/icons-material';

interface ResourceFile {
    id: string;
    name: string;
    type: 'quiz' | 'exam' | 'lecture' | 'assignment' | 'other';
    subject: string;
    driveLink: string;
    dateAdded: string;
}

const Resources: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [resources, setResources] = useState<ResourceFile[]>([]);
    const theme = useTheme();

    const categories = [
        { id: 'all', label: 'All', icon: <Folder /> },
        { id: 'quiz', label: 'Quizzes', icon: <Quiz /> },
        { id: 'exam', label: 'Exams', icon: <School /> },
        { id: 'lecture', label: 'Lectures', icon: <Description /> },
        { id: 'assignment', label: 'Assignments', icon: <InsertDriveFile /> },
        { id: 'other', label: 'Other', icon: <Description /> }
    ];

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            resource.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'quiz': return '#4CAF50';
            case 'exam': return '#f44336';
            case 'lecture': return '#2196F3';
            case 'assignment': return '#FF9800';
            default: return '#9C27B0';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'quiz': return <Quiz />;
            case 'exam': return <School />;
            case 'lecture': return <Description />;
            case 'assignment': return <InsertDriveFile />;
            default: return <Description />;
        }
    };

    const handleDownload = (driveLink: string) => {
        window.open(driveLink, '_blank');
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(180deg, rgba(29, 161, 242, 0.02) 0%, transparent 100%)',
            pb: 4
        }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Paper
                    elevation={0}
                    sx={{
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.9) 0%, rgba(21, 32, 43, 0.9) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(29, 161, 242, 0.1)',
                        borderRadius: 4,
                        p: 4,
                        mb: 4
                    }}
                >
                    <Typography variant="h4" fontWeight="700" sx={{ 
                        mb: 2,
                        background: 'linear-gradient(45deg, #1DA1F2 30%, #1976d2 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        University Resources
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Access quizzes, exams, lectures, and other study materials
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: 'primary.main' }} />
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                background: theme.palette.mode === 'dark'
                                    ? 'rgba(25, 39, 52, 0.3)'
                                    : 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(29, 161, 242, 0.2)',
                                borderRadius: 3
                            }
                        }}
                    />

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
                        {categories.map((category) => (
                            <Chip
                                key={category.id}
                                icon={category.icon}
                                label={category.label}
                                onClick={() => setSelectedCategory(category.id)}
                                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                                color={selectedCategory === category.id ? 'primary' : 'default'}
                                sx={{
                                    borderRadius: 20,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: selectedCategory === category.id 
                                            ? '0 4px 12px rgba(29, 161, 242, 0.3)'
                                            : '0 2px 8px rgba(0,0,0,0.1)'
                                    }
                                }}
                            />
                        ))}
                    </Box>
                </Paper>

                {filteredResources.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            background: theme.palette.mode === 'dark'
                                ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.9) 0%, rgba(21, 32, 43, 0.9) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '2px dashed rgba(29, 161, 242, 0.2)',
                            borderRadius: 4,
                            p: 6,
                            textAlign: 'center'
                        }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <School sx={{ fontSize: 64, color: 'primary.main', opacity: 0.5 }} />
                        </Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            No resources available yet 📚
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Resources will appear here once they are added
                        </Typography>
                    </Paper>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource, index) => (
                            <Box
                                key={resource.id}
                                sx={{
                                    opacity: 0,
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                                    '@keyframes fadeInUp': {
                                        from: {
                                            opacity: 0,
                                            transform: 'translateY(20px)'
                                        },
                                        to: {
                                            opacity: 1,
                                            transform: 'translateY(0)'
                                        }
                                    }
                                }}
                            >
                                <Card
                                    elevation={0}
                                    sx={{
                                        background: theme.palette.mode === 'dark'
                                            ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.8) 0%, rgba(21, 32, 43, 0.8) 100%)'
                                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(29, 161, 242, 0.1)',
                                        borderRadius: 3,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        height: '100%',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 24px rgba(29, 161, 242, 0.15)',
                                            border: '1px solid rgba(29, 161, 242, 0.3)'
                                        }
                                    }}
                                    onClick={() => handleDownload(resource.driveLink)}
                                >
                                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    backgroundColor: getTypeColor(resource.type),
                                                    color: 'white',
                                                    mr: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {getTypeIcon(resource.type)}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                                    {resource.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {resource.subject}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={resource.type.toUpperCase()}
                                                    sx={{
                                                        backgroundColor: getTypeColor(resource.type),
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            </Box>
                                            <IconButton
                                                sx={{
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                                        transform: 'scale(1.1)'
                                                    }
                                                }}
                                            >
                                                <Download />
                                            </IconButton>
                                        </Box>
                                        <Box sx={{ mt: 'auto' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Added: {new Date(resource.dateAdded).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </div>
                )}
            </div>
        </Box>
    );
};

export default Resources; 