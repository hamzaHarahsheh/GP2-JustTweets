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
    Avatar,
    Divider,
    Stack,
    Fade,
    Popper
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
    CloudDownload,
    YouTube,
    Facebook
} from '@mui/icons-material';

interface Resource {
    id: string;
    name: string;
    link: string;
    type: 'drive' | 'youtube' | 'facebook';
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
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);
    const [hoveredResource, setHoveredResource] = useState<Resource | null>(null);
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
                        { id: '1', name: '2020/2021 1st Semester Quiz 1', link: 'https://drive.google.com/drive/u/0/folders/1TIWcxSPF9259B25c6VwJHwHY9U_Jp0Xu', type: 'drive', dateAdded: '2024-01-15' },
                        { id: '2', name: '2020/2021 1st Semester Quiz 2', link: 'https://drive.google.com/drive/u/0/folders/1YYnWHbArqxuQlP0vn8jMUew8GGpdm6uz', type: 'drive', dateAdded: '2024-01-20' }
                    ],
                    exams: [
                        { id: '1', name: 'First Exam', link: 'https://drive.google.com/drive/u/0/folders/1fvsoyNvfNMQL9eRf7gtCQ99aOPHru2JB', type: 'drive', dateAdded: '2024-02-01' },
                        { id: '2', name: 'Final Exam', link: 'https://drive.google.com/drive/u/0/folders/1iR56TCVyHINAegsZDgl9Sy4EE3EC3Too', type: 'drive', dateAdded: '2024-03-15' }
                    ],
                    lectures: [
                        { id: '1', name: 'Prof Ali Shatnawi', link: 'https://youtu.be/9YJIneoegDw?list=PLGhfn1pOt_mVqlLROCZjF_5-af-KrofmZ', type: 'youtube', dateAdded: '2024-01-10' },
                        { id: '2', name: 'Dr Mohammad Shboul', link: 'https://youtu.be/LG5UAj05pII?list=PLZZBvv9dGNwIPTNvDM8FZ7rJLOFv2tuK-', type: 'youtube', dateAdded: '2024-01-25' }
                    ],
                    assignments: [
                        { id: '1', name: 'Processor Design Project', link: 'https://drive.google.com/assignment1', type: 'drive', dateAdded: '2024-01-12' },
                        { id: '2', name: 'Cache Simulation', link: 'https://drive.google.com/assignment2', type: 'drive', dateAdded: '2024-02-05' }
                    ]
                },
                {
                    id: 'microprocessors',
                    name: 'Microprocessors',
                    icon: <Memory sx={{ fontSize: 40 }} />,
                    color: '#9C27B0',
                    description: 'Microprocessor programming and interfacing',
                    quizzes: [
                        { id: '1', name: 'By Chapter', link: 'https://drive.google.com/drive/u/0/folders/1JuFRk-LE2fSzFhJQHSvVYtOKvEwyHok9', type: 'drive', dateAdded: '2024-01-18' }
                    ],
                    exams: [
                        { id: '1', name: 'Microprocessor Exams', link: 'https://drive.google.com/drive/folders/1-RAzBAzFsC5rDzjDLiytH-Ml4Odgi4nu', type: 'drive', dateAdded: '2024-02-10' }
                    ],
                    lectures: [
                        { id: '1', name: 'Dr Khaldoon', link: 'https://youtu.be/yh07bTgpYKA?list=PLmg2_0P-K4sFo7rUyo5WhWXBlo3C5MOG7', type: 'youtube', dateAdded: '2024-01-08' }
                    ],
                    assignments: [
                        { id: '1', name: 'Microprocessor Assignments', link: 'https://drive.google.com/drive/u/0/folders/10fHyFYJVqExKCUakJHY7K9drwapapb60', type: 'drive', dateAdded: '2024-01-30' }
                    ]
                },
                {
                    id: 'comp-org-design',
                    name: 'Computer Organization and Design',
                    icon: <Schema sx={{ fontSize: 40 }} />,
                    color: '#FF5722',
                    description: 'Computer system organization and design principles',
                    quizzes: [
                        { id: '1', name: 'Orga Quiz', link: 'https://drive.google.com/drive/folders/1YNq3kCJBZaKU5dsKgR-Lj9HyAuHGRXVv', type: 'drive', dateAdded: '2024-01-22' }
                    ],
                    exams: [
                        { id: '1', name: 'Exams', link: 'https://drive.google.com/drive/folders/1gYZCA03-Bs8Fknbl7h8-f9Dz2IXZVOeM', type: 'drive', dateAdded: '2024-02-15' }
                    ],
                    lectures: [
                        { id: '1', name: 'Prof Osama Alkhalil', link: 'https://youtu.be/R7YJn8V6pAk?list=PLy42_pl2XRL74uSKD9DkiJ11GOPyluXsR', type: 'youtube', dateAdded: '2024-01-05' }
                    ],
                    assignments: [
                        { id: '1', name: 'System Design Project', link: 'https://drive.google.com/cod-assignment1', type: 'drive', dateAdded: '2024-01-28' }
                    ]
                },
                {
                    id: 'embedded-systems',
                    name: 'Embedded Systems',
                    icon: <Hardware sx={{ fontSize: 40 }} />,
                    color: '#F44336',
                    description: 'Real-time systems and embedded programming',
                    quizzes: [
                        { id: '1', name: 'Quizzez', link: 'https://drive.google.com/drive/u/0/folders/1P0gJNtDPL39THln-7xv2nzlxkB0t7pHY?fbclid=IwAR3HTS0AZdjiPl8bgr0wfSXksS-xbp00WH3FQvzbg-FJqgShN7UYagx7YsI', type: 'drive', dateAdded: '2024-01-25' }
                    ],
                    exams: [
                        { id: '1', name: 'Embedded Systems Exam', link: 'https://drive.google.com/drive/folders/1BghpyO-WwFBu3i2FmcaVFSESclNsBeNR?fbclid=IwAR06lJAvfYt0UVeWK0liX5QQiIpa21LfcmYGGftOw-UtrnXoXF8Oo6b3w1g', type: 'drive', dateAdded: '2024-02-20' }
                    ],
                    lectures: [
                        { id: '1', name: 'Introduction to Embedded Systems - Prof Osama Alkhalil', link: 'https://youtu.be/4d4WXzQv3Xs?list=PLuB2827yobpzbR4988f88KXpZ-L9o7tNE', type: 'youtube', dateAdded: '2024-01-03' }
                    ],
                    assignments: [
                        { id: '1', name: 'IoT Device Programming', link: 'https://drive.google.com/embed-assignment1', type: 'drive', dateAdded: '2024-02-01' }
                    ]
                },
                {
                    id: 'artificial-intelligence',
                    name: 'Artificial Intelligence',
                    icon: <Psychology sx={{ fontSize: 40 }} />,
                    color: '#4CAF50',
                    description: 'Machine learning and intelligent systems',
                    quizzes: [
                        { id: '1', name: 'Quizzez', link: 'https://drive.google.com/drive/folders/1qWY_nutYnzAHqMD7rjhsTYKCDUejnVan?fbclid=IwAR2zYHJYKSd6jrBaoBWYkv5sqitjCDdl19p8NZfy_VVE-_b1LD9wJdbiztw', type: 'drive', dateAdded: '2024-01-20' }
                    ],
                    exams: [
                        { id: '1', name: 'AI Final Exams', link: 'https://drive.google.com/drive/folders/1WSAA_akriOo0u8USEnvOEDoDg_fHracS?fbclid=IwAR1ZITs7uhVkbynErilCNpEbL0dho2OLo6K-1oVxb1B0t9reooeYbMGmpDA', type: 'drive', dateAdded: '2024-02-12' }
                    ],
                    lectures: [
                        { id: '1', name: 'Dr Inad Aljarrah', link: 'https://youtu.be/q1pt6I0uDFg?list=PLOJ_ZHK5bDAmyAjlq2T23TCSKCBDDErF2', type: 'youtube', dateAdded: '2024-01-07' }
                    ],
                    assignments: [
                        { id: '1', name: 'Assignment 1', link: 'https://drive.google.com/drive/folders/1bWkuBjMTo3t9l6tcb6Wo71rP2M6-nadi?fbclid=IwAR2xZ7pMEQucJYmJOHOMXXArX9yzS9ecftepwBgXFCsysV1GbSMDe6wTWgc', type: 'drive', dateAdded: '2024-01-26' }
                    ]
                },
                {
                    id: 'image-processing',
                    name: 'Image Processing',
                    icon: <Image sx={{ fontSize: 40 }} />,
                    color: '#FF9800',
                    description: 'Digital image analysis and computer vision',
                    quizzes: [
                        { id: '1', name: 'Quiz 1', link: 'https://drive.google.com/drive/u/0/folders/10F1_sJp1A7jU1NPY_0Jcc5MWcsHF6k2B?fbclid=IwAR3iH7Yl0GHtjA641jmx0cIGf-QNR23c95bf9tzlK1Zl1EMuAcQJQW3Qk2o', type: 'drive', dateAdded: '2024-01-17' }
                    ],
                    exams: [
                        { id: '1', name: 'Midterm Exams', link: 'https://drive.google.com/drive/folders/1cnOzqIBFz_ajwkbinhXM6ximoSEnvoy0?fbclid=IwAR0VUGEttWlxrzAzZexVMkszxqThsyhCdBI68SmWdYnIG0LrmO5mG0-3x6w', type: 'drive', dateAdded: '2024-02-08' }
                    ],
                    lectures: [
                        { id: '1', name: 'Dr Inad Aljarrah', link: 'https://youtu.be/UlozlvarG9A?list=PLDH812HWn6H1Sl6elrPznON2mOgo1tnxm', type: 'youtube', dateAdded: '2024-01-02' }
                    ],
                    assignments: [
                        { id: '1', name: 'Image Processing Assignments', link: 'https://drive.google.com/drive/u/0/folders/1Xy7t3JSsPVMkwThTHIXkOSqqTRQwgW9R?fbclid=IwAR23k51VID5SK0lnUqESrHifv3SHZGU4kL0QCi7KAdKiBWKJt-JQXz6Z5UQ', type: 'drive', dateAdded: '2024-01-24' }
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

    const handleResourceClick = (link: string) => {
        window.open(link, '_blank');
    };

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'youtube':
                return <YouTube />;
            case 'facebook':
                return <Facebook />;
            case 'drive':
            default:
                return <CloudDownload />;
        }
    };

    const getResourceColor = (type: string) => {
        switch (type) {
            case 'youtube':
                return '#FF0000';
            case 'facebook':
                return '#1877F2';
            case 'drive':
            default:
                return selectedCourse?.color || '#1976d2';
        }
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
                                        minHeight: 280,
                                        display: 'flex',
                                        flexDirection: 'column',
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
                                    <CardContent sx={{ p: 4, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Box>
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
                                            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ wordWrap: 'break-word', hyphens: 'auto' }}>
                                                {major.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, wordWrap: 'break-word', lineHeight: 1.5 }}>
                                                {major.description}
                                            </Typography>
                                        </Box>
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
                                        minHeight: 320,
                                        display: 'flex',
                                        flexDirection: 'column',
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
                                    <CardContent sx={{ p: 4, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Box>
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
                                            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ wordWrap: 'break-word', hyphens: 'auto', lineHeight: 1.3 }}>
                                                {course.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, wordWrap: 'break-word', lineHeight: 1.5 }}>
                                                {course.description}
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1}>
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
                                <Grid size={{ xs: 12 }} key={resource.id}>
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
                                            minHeight: 180,
                                            width: '100%',
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
                                                boxShadow: `0 8px 24px ${getResourceColor(resource.type)}30`,
                                                border: `1px solid ${getResourceColor(resource.type)}50`
                                            }
                                        }}
                                        onClick={() => handleResourceClick(resource.link)}
                                        onMouseEnter={(e) => {
                                            setPopupAnchor(e.currentTarget);
                                            setHoveredResource(resource);
                                            setPopupOpen(true);
                                        }}
                                        onMouseLeave={() => {
                                            setPopupOpen(false);
                                            setHoveredResource(null);
                                            setPopupAnchor(null);
                                        }}
                                    >
                                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        backgroundColor: getResourceColor(resource.type),
                                                        boxShadow: `0 4px 12px ${getResourceColor(resource.type)}40`,
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    {getResourceIcon(resource.type)}
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography 
                                                        variant="h6" 
                                                        fontWeight="600" 
                                                        sx={{ 
                                                            fontSize: '1rem',
                                                            lineHeight: 1.2,
                                                            mb: 1,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical'
                                                        }}
                                                    >
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
                                                        color: getResourceColor(resource.type),
                                                        flexShrink: 0,
                                                        '&:hover': {
                                                            backgroundColor: `${getResourceColor(resource.type)}20`,
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                >
                                                    <Launch />
                                                </IconButton>
                                            </Box>
                                            <Box>
                                                <Divider sx={{ mb: 2 }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    Added: {new Date(resource.dateAdded).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>

                <Popper
                    open={popupOpen && hoveredResource !== null}
                    anchorEl={popupAnchor}
                    placement="top"
                    transition
                    sx={{ zIndex: 1300 }}
                    modifiers={[
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 8],
                            },
                        },
                    ]}
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={200}>
                            <Paper
                                elevation={0}
                                sx={{
                                    background: theme.palette.mode === 'dark'
                                        ? 'linear-gradient(135deg, rgba(25, 39, 52, 0.95) 0%, rgba(21, 32, 43, 0.95) 100%)'
                                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border: hoveredResource ? `1px solid ${getResourceColor(hoveredResource.type)}40` : '1px solid rgba(29, 161, 242, 0.3)',
                                    borderRadius: 4,
                                    p: 2,
                                    maxWidth: 300,
                                    boxShadow: `0 8px 16px rgba(0, 0, 0, 0.1)`,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '8px solid transparent',
                                        borderRight: '8px solid transparent',
                                        borderTop: hoveredResource 
                                            ? `8px solid ${getResourceColor(hoveredResource.type)}40`
                                            : '8px solid rgba(29, 161, 242, 0.3)',
                                    }
                                }}
                            >
                                {hoveredResource && (
                                    <Typography variant="body1" fontWeight="500" sx={{ 
                                        fontSize: '0.9rem',
                                        lineHeight: 1.4,
                                        textAlign: 'center'
                                    }}>
                                        {hoveredResource.name}
                                    </Typography>
                                )}
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </Box>
        </Box>
    );
};

export default Resources; 