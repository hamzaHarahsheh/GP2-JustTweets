import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Card, 
    CardContent, 
    IconButton, 
    Chip, 
    Tab, 
    Tabs,
    Grid,
    Button,
    Avatar,
    Divider,
    Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
    Engineering,
    Architecture,
    Memory,
    Schema,
    Hardware,
    Psychology,
    Image,
    Quiz, 
    School, 
    Description, 
    Assignment,
    Launch,
    ArrowBack,
    CloudDownload
} from '@mui/icons-material';

interface Resource {
    id: string;
    name: string;
    driveLink: string;
    dateAdded: string;
}

interface Course {
    id: string;
    name: string;
    icon: React.ReactElement;
    color: string;
    description: string;
    quizzes: Resource[];
    exams: Resource[];
    lectures: Resource[];
    assignments: Resource[];
}

interface Major {
    id: string;
    name: string;
    icon: React.ReactElement;
    color: string;
    description: string;
    courses: Course[];
}

const Resources: React.FC = () => {
    const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const theme = useTheme();

    const majors: Major[] = [
        {
            id: 'computer-engineering',
            name: 'Computer Engineering',
            icon: <Engineering sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            description: 'Hardware and software systems design',
            courses: [
                {
                    id: 'comp-arch',
                    name: 'Computer Architecture',
                    icon: <Architecture sx={{ fontSize: 40 }} />,
                    color: '#2196F3',
                    description: 'Processor design and computer organization',
                    quizzes: [
                        { id: '1', name: 'CPU Design Quiz', driveLink: 'https://drive.google.com/quiz1', dateAdded: '2024-01-15' },
                        { id: '2', name: 'Memory Hierarchy Quiz', driveLink: 'https://drive.google.com/quiz2', dateAdded: '2024-01-20' }
                    ],
                    exams: [
                        { id: '1', name: 'Midterm Exam', driveLink: 'https://drive.google.com/exam1', dateAdded: '2024-02-01' },
                        { id: '2', name: 'Final Exam', driveLink: 'https://drive.google.com/exam2', dateAdded: '2024-03-15' }
                    ],
                    lectures: [
                        { id: '1', name: 'Introduction to Computer Architecture', driveLink: 'https://drive.google.com/lecture1', dateAdded: '2024-01-10' },
                        { id: '2', name: 'Instruction Set Architecture', driveLink: 'https://drive.google.com/lecture2', dateAdded: '2024-01-25' }
                    ],
                    assignments: [
                        { id: '1', name: 'Processor Design Project', driveLink: 'https://drive.google.com/assignment1', dateAdded: '2024-01-12' },
                        { id: '2', name: 'Cache Simulation', driveLink: 'https://drive.google.com/assignment2', dateAdded: '2024-02-05' }
                    ]
                },
                {
                    id: 'microprocessors',
                    name: 'Microprocessors',
                    icon: <Memory sx={{ fontSize: 40 }} />,
                    color: '#9C27B0',
                    description: 'Microprocessor programming and interfacing',
                    quizzes: [
                        { id: '1', name: 'Assembly Programming Quiz', driveLink: 'https://drive.google.com/micro-quiz1', dateAdded: '2024-01-18' }
                    ],
                    exams: [
                        { id: '1', name: 'Microprocessor Midterm', driveLink: 'https://drive.google.com/micro-exam1', dateAdded: '2024-02-10' }
                    ],
                    lectures: [
                        { id: '1', name: 'Introduction to Microprocessors', driveLink: 'https://drive.google.com/micro-lecture1', dateAdded: '2024-01-08' }
                    ],
                    assignments: [
                        { id: '1', name: 'Microcontroller Programming', driveLink: 'https://drive.google.com/micro-assignment1', dateAdded: '2024-01-30' }
                    ]
                },
                {
                    id: 'comp-org-design',
                    name: 'Computer Organization and Design',
                    icon: <Schema sx={{ fontSize: 40 }} />,
                    color: '#FF5722',
                    description: 'Computer system organization and design principles',
                    quizzes: [
                        { id: '1', name: 'Data Path Design Quiz', driveLink: 'https://drive.google.com/cod-quiz1', dateAdded: '2024-01-22' }
                    ],
                    exams: [
                        { id: '1', name: 'System Design Exam', driveLink: 'https://drive.google.com/cod-exam1', dateAdded: '2024-02-15' }
                    ],
                    lectures: [
                        { id: '1', name: 'Computer Organization Basics', driveLink: 'https://drive.google.com/cod-lecture1', dateAdded: '2024-01-05' }
                    ],
                    assignments: [
                        { id: '1', name: 'System Design Project', driveLink: 'https://drive.google.com/cod-assignment1', dateAdded: '2024-01-28' }
                    ]
                },
                {
                    id: 'embedded-systems',
                    name: 'Embedded Systems',
                    icon: <Hardware sx={{ fontSize: 40 }} />,
                    color: '#F44336',
                    description: 'Real-time systems and embedded programming',
                    quizzes: [
                        { id: '1', name: 'Real-time Systems Quiz', driveLink: 'https://drive.google.com/embed-quiz1', dateAdded: '2024-01-25' }
                    ],
                    exams: [
                        { id: '1', name: 'Embedded Systems Exam', driveLink: 'https://drive.google.com/embed-exam1', dateAdded: '2024-02-20' }
                    ],
                    lectures: [
                        { id: '1', name: 'Introduction to Embedded Systems', driveLink: 'https://drive.google.com/embed-lecture1', dateAdded: '2024-01-03' }
                    ],
                    assignments: [
                        { id: '1', name: 'IoT Device Programming', driveLink: 'https://drive.google.com/embed-assignment1', dateAdded: '2024-02-01' }
                    ]
                },
                {
                    id: 'artificial-intelligence',
                    name: 'Artificial Intelligence',
                    icon: <Psychology sx={{ fontSize: 40 }} />,
                    color: '#4CAF50',
                    description: 'Machine learning and intelligent systems',
                    quizzes: [
                        { id: '1', name: 'ML Algorithms Quiz', driveLink: 'https://drive.google.com/ai-quiz1', dateAdded: '2024-01-20' }
                    ],
                    exams: [
                        { id: '1', name: 'AI Fundamentals Exam', driveLink: 'https://drive.google.com/ai-exam1', dateAdded: '2024-02-12' }
                    ],
                    lectures: [
                        { id: '1', name: 'AI and Machine Learning', driveLink: 'https://drive.google.com/ai-lecture1', dateAdded: '2024-01-07' }
                    ],
                    assignments: [
                        { id: '1', name: 'Neural Network Implementation', driveLink: 'https://drive.google.com/ai-assignment1', dateAdded: '2024-01-26' }
                    ]
                },
                {
                    id: 'image-processing',
                    name: 'Image Processing',
                    icon: <Image sx={{ fontSize: 40 }} />,
                    color: '#FF9800',
                    description: 'Digital image analysis and computer vision',
                    quizzes: [
                        { id: '1', name: 'Image Filters Quiz', driveLink: 'https://drive.google.com/img-quiz1', dateAdded: '2024-01-17' }
                    ],
                    exams: [
                        { id: '1', name: 'Computer Vision Exam', driveLink: 'https://drive.google.com/img-exam1', dateAdded: '2024-02-08' }
                    ],
                    lectures: [
                        { id: '1', name: 'Introduction to Image Processing', driveLink: 'https://drive.google.com/img-lecture1', dateAdded: '2024-01-02' }
                    ],
                    assignments: [
                        { id: '1', name: 'Image Enhancement Project', driveLink: 'https://drive.google.com/img-assignment1', dateAdded: '2024-01-24' }
                    ]
                }
            ]
        }
    ];

    const tabs = [
        { label: 'Quizzes', icon: <Quiz />, key: 'quizzes' },
        { label: 'Exams', icon: <School />, key: 'exams' },
        { label: 'Lectures', icon: <Description />, key: 'lectures' },
        { label: 'Assignments', icon: <Assignment />, key: 'assignments' }
    ];

    const handleMajorSelect = (major: Major) => {
        setSelectedMajor(major);
        setSelectedCourse(null);
        setSelectedTab(0);
    };

    const handleCourseSelect = (course: Course) => {
        setSelectedCourse(course);
        setSelectedTab(0);
    };

    const handleBackToMajors = () => {
        setSelectedMajor(null);
        setSelectedCourse(null);
        setSelectedTab(0);
    };

    const handleBackToCourses = () => {
        setSelectedCourse(null);
        setSelectedTab(0);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const getCurrentResources = (): Resource[] => {
        if (!selectedCourse) return [];
        const tabKey = tabs[selectedTab].key as keyof Course;
        return selectedCourse[tabKey] as Resource[];
    };

    const handleResourceClick = (driveLink: string) => {
        window.open(driveLink, '_blank');
    };

    if (!selectedMajor) {
        return (
            <Box sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(180deg, rgba(29, 161, 242, 0.02) 0%, transparent 100%)',
                pb: 4
            }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 8 }}>
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
                            Academic Majors
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Select your major to access courses and resources
                        </Typography>
                    </Paper>

                    <Grid container spacing={3}>
                        {majors.map((major, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={major.id}>
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
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 12px 24px ${major.color}30`,
                                            border: `1px solid ${major.color}50`
                                        }
                                    }}
                                    onClick={() => handleMajorSelect(major)}
                                >
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                backgroundColor: major.color,
                                                mb: 3,
                                                mx: 'auto',
                                                boxShadow: `0 8px 24px ${major.color}40`
                                            }}
                                        >
                                            {major.icon}
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" gutterBottom>
                                            {major.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            {major.description}
                                        </Typography>
                                        <Chip 
                                            size="small" 
                                            label={`${major.courses.length} Courses`} 
                                            sx={{ backgroundColor: `${major.color}20`, color: major.color }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        );
    }

    if (!selectedCourse) {
        return (
            <Box sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(180deg, rgba(29, 161, 242, 0.02) 0%, transparent 100%)',
                pb: 4
            }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 8 }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <IconButton 
                                onClick={handleBackToMajors}
                                sx={{ 
                                    mr: 2,
                                    backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(29, 161, 242, 0.2)',
                                    }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    backgroundColor: selectedMajor.color,
                                    mr: 3,
                                    boxShadow: `0 4px 16px ${selectedMajor.color}40`
                                }}
                            >
                                {selectedMajor.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="700">
                                    {selectedMajor.name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Select a course to access resources
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    <Grid container spacing={3}>
                        {selectedMajor.courses.map((course, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
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
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 12px 24px ${course.color}30`,
                                            border: `1px solid ${course.color}50`
                                        }
                                    }}
                                    onClick={() => handleCourseSelect(course)}
                                >
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                backgroundColor: course.color,
                                                mb: 3,
                                                mx: 'auto',
                                                boxShadow: `0 8px 24px ${course.color}40`
                                            }}
                                        >
                                            {course.icon}
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="600" gutterBottom>
                                            {course.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            {course.description}
                                        </Typography>
                                        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                                            <Chip 
                                                size="small" 
                                                label={`${course.quizzes.length} Quizzes`} 
                                                sx={{ backgroundColor: `${course.color}20`, color: course.color }}
                                            />
                                            <Chip 
                                                size="small" 
                                                label={`${course.exams.length} Exams`} 
                                                sx={{ backgroundColor: `${course.color}20`, color: course.color }}
                                            />
                                            <Chip 
                                                size="small" 
                                                label={`${course.lectures.length} Lectures`} 
                                                sx={{ backgroundColor: `${course.color}20`, color: course.color }}
                                            />
                                            <Chip 
                                                size="small" 
                                                label={`${course.assignments.length} Assignments`} 
                                                sx={{ backgroundColor: `${course.color}20`, color: course.color }}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(180deg, rgba(29, 161, 242, 0.02) 0%, transparent 100%)',
            pb: 4
        }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 8 }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <IconButton 
                            onClick={handleBackToCourses}
                            sx={{ 
                                mr: 2,
                                backgroundColor: 'rgba(29, 161, 242, 0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(29, 161, 242, 0.2)',
                                }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: selectedCourse.color,
                                mr: 3,
                                boxShadow: `0 4px 16px ${selectedCourse.color}40`
                            }}
                        >
                            {selectedCourse.icon}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="700">
                                {selectedCourse.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {selectedCourse.description}
                            </Typography>
                        </Box>
                    </Box>

                    <Tabs 
                        value={selectedTab} 
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                minHeight: 64,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                borderRadius: 2,
                                mx: 1,
                                '&.Mui-selected': {
                                    backgroundColor: `${selectedCourse.color}20`,
                                    color: selectedCourse.color
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: selectedCourse.color,
                                height: 3,
                                borderRadius: 2
                            }
                        }}
                    >
                        {tabs.map((tab, index) => (
                            <Tab 
                                key={index}
                                icon={tab.icon} 
                                label={tab.label} 
                                iconPosition="start"
                            />
                        ))}
                    </Tabs>
                </Paper>

                <Box>
                    {getCurrentResources().length === 0 ? (
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
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: `${selectedCourse.color}20`,
                                    color: selectedCourse.color,
                                    mx: 'auto',
                                    mb: 2
                                }}
                            >
                                {tabs[selectedTab].icon}
                            </Avatar>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                No {tabs[selectedTab].label.toLowerCase()} available yet 📚
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {tabs[selectedTab].label} for this course will appear here once they are added
                            </Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {getCurrentResources().map((resource, index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={resource.id}>
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
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: `0 8px 24px ${selectedCourse.color}30`,
                                                border: `1px solid ${selectedCourse.color}50`
                                            }
                                        }}
                                        onClick={() => handleResourceClick(resource.driveLink)}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        backgroundColor: selectedCourse.color,
                                                        mr: 2,
                                                        boxShadow: `0 4px 12px ${selectedCourse.color}40`
                                                    }}
                                                >
                                                    <CloudDownload />
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                                        {resource.name}
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        label={tabs[selectedTab].label.slice(0, -1)}
                                                        sx={{
                                                            backgroundColor: `${selectedCourse.color}20`,
                                                            color: selectedCourse.color,
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    />
                                                </Box>
                                                <IconButton
                                                    sx={{
                                                        color: selectedCourse.color,
                                                        '&:hover': {
                                                            backgroundColor: `${selectedCourse.color}20`,
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                >
                                                    <Launch />
                                                </IconButton>
                                            </Box>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography variant="caption" color="text.secondary">
                                                Added: {new Date(resource.dateAdded).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Resources; 