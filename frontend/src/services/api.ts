import axios from 'axios';
import { LoginCredentials, LoginResponse, RegisterCredentials, Post, Comment, Like, User, Role } from '../types';

interface Notification {
    id: string;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'FRIEND_COMMENT' | 'NEW_POST';
    sourceUserId: string;
    postId?: string;
    content: string;
    read: boolean;
    createdAt: string; 
}

interface PaginatedNotifications {
    content: Notification[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
}

const API_URL = 'http://localhost:8081';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        if (!config.headers) config.headers = {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
        config.headers = {
            ...config.headers,
            'Content-Type': 'application/json'
        };
    } else {
        if (config.headers && config.headers['Content-Type']) {
            delete config.headers['Content-Type'];
        }
    }
    return config;
});

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/users/login', credentials);
        return response.data;
    },

    register: async (credentials: RegisterCredentials): Promise<User> => {
        const formData = new FormData();
        formData.append('user', JSON.stringify({
            username: credentials.username,
            email: credentials.email,
            password: credentials.password,
            bio: credentials.bio,
        }));
        if (credentials.profilePicture) {
            formData.append('profilePicture', credentials.profilePicture);
        }
        return (await api.post<User>('/users/register', formData)).data;
    },

    checkEmailAvailability: async (email: string): Promise<boolean> => {
        try {
            await api.get(`/users/email/${email}`);
            return false;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return true;
            }
            return false;
        }
    },

    checkUsernameAvailability: async (username: string): Promise<boolean> => {
        try {
            await api.get(`/users/username/${username}`);
            return false;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return true;
            }
            return false;
        }
    },
};

export const postService = {
    getAllPosts: async (): Promise<Post[]> => {
        const response = await api.get<Post[]>('/posts');
        return response.data;
    },

    getPostById: async (id: string): Promise<Post> => {
        const response = await api.get<Post>(`/posts/${id}`);
        return response.data;
    },

    getPostsByUserId: async (userId: string): Promise<Post[]> => {
        const response = await api.get<Post[]>(`/posts/user/${userId}`);
        return response.data;
    },

    createPost: async (post: { content: string }, images?: File[]): Promise<Post> => {
        const formData = new FormData();
        formData.append('post', JSON.stringify(post));
        if (images) {
            images.forEach(image => formData.append('images', image));
        }
        const response = await api.post<Post>('/posts', formData);
        return response.data;
    },
};

export const commentService = {
    getCommentsByPostId: async (postId: string): Promise<Comment[]> => {
        const response = await api.get<Comment[]>(`/comments/post/${postId}`);
        return response.data;
    },

    addComment: async (comment: { postId: string; content: string }): Promise<Comment> => {
        const response = await api.post<Comment>('/comments/add', comment);
        return response.data;
    },

    updateComment: async (commentId: string, content: string): Promise<Comment> => {
        const response = await api.put<Comment>(`/comments/${commentId}`, { content });
        return response.data;
    },

    deleteComment: async (commentId: string): Promise<void> => {
        await api.delete(`/comments/${commentId}`);
    },
};

export const likeService = {
    getLikesByPostId: async (postId: string): Promise<Like[]> => {
        const response = await api.get<Like[]>(`/likes/post/${postId}`);
        return response.data;
    },

    addLike: async (like: { postId: string; userId: string }): Promise<Like> => {
        const response = await api.post<Like>('/likes/add', like);
        return response.data;
    },

    removeLike: async (id: string): Promise<void> => {
        await api.delete(`/likes/${id}`);
    },
};

export const userService = {
    getUserById: async (id: string): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    getUserByUsername: async (username: string): Promise<User> => {
        const response = await api.get<User>(`/users/username/${username}`);
        return response.data;
    },

    updateProfilePicture: async (id: string, file: File): Promise<User> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.put<User>(`/users/${id}/profile-picture`, formData);
        return response.data;
    },

    updateBio: async (id: string, bio: string): Promise<User> => {
        console.log('Updating bio for user:', id, 'with bio:', bio);
        const requestData = { bio };
        console.log('Sending request data:', requestData);
        const response = await api.put<User>(`/users/${id}/bio`, requestData);
        console.log('Bio update response:', response.data);
        return response.data;
    },

    getFollowers: async (userId: string): Promise<User[]> => {
        const response = await api.get<User[]>(`/users/${userId}/followers`);
        return response.data;
    },

    getFollowing: async (userId: string): Promise<User[]> => {
        const response = await api.get<User[]>(`/users/${userId}/following`);
        return response.data;
    },

    searchUsers: async (query: string): Promise<User[]> => {
        const response = await api.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    followUser: async (userId: string) => {
        const response = await api.post(`/users/follow/${userId}`);
        return response.data;
    },

    unfollowUser: async (userId: string) => {
        const response = await api.post(`/users/unfollow/${userId}`);
        return response.data;
    },
};

export const notificationService = {
    getUserNotifications: async (userId: string): Promise<Notification[]> => {
        const response = await api.get<Notification[]>(`/likes/notifications/user/${userId}`);
        return response.data;
    },

    getUserNotificationsPaginated: async (userId: string, page: number = 0, size: number = 10): Promise<PaginatedNotifications> => {
        const response = await api.get<PaginatedNotifications>(`/likes/notifications/user/${userId}/paginated?page=${page}&size=${size}`);
        return response.data;
    },

    getUnreadCount: async (userId: string): Promise<number> => {
        const response = await api.get<number>(`/likes/notifications/unread/count/${userId}`);
        return response.data;
    },

    markAsRead: async (notificationId: string): Promise<void> => {
        await api.put(`/likes/notifications/read/${notificationId}`);
    },

    markAllAsRead: async (userId: string): Promise<void> => {
        await api.put(`/likes/notifications/read/all/${userId}`);
    },
};

export const roleService = {
    getUserRoles: async (userId: string): Promise<Role[]> => {
        const response = await api.get<Role[]>(`/roles/user/${userId}`);
        return response.data;
    },
};

export default api; 


