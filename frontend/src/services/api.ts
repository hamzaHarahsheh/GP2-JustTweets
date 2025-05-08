import axios from 'axios';
import { LoginCredentials, LoginResponse, RegisterCredentials, Post, Comment, Like, User } from '../types';

const API_URL = 'http://localhost:8081';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        if (!config.headers) config.headers = {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Only set Content-Type for non-FormData
    if (!(config.data instanceof FormData)) {
        config.headers = {
            ...config.headers,
            'Content-Type': 'application/json'
        };
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
        const response = await api.post<User>('/users/register', formData);
        return response.data;
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

    getFollowers: async (userId: string): Promise<User[]> => {
        const response = await api.get<User[]>(`/users/${userId}/followers`);
        return response.data;
    },

    getFollowing: async (userId: string): Promise<User[]> => {
        const response = await api.get<User[]>(`/users/${userId}/following`);
        return response.data;
    },

    followUser: async (followerId: string, followingId: string): Promise<void> => {
        await api.post('/follows', { followerId, followingId });
    },

    unfollowUser: async (followId: string): Promise<void> => {
        await api.delete(`/follows/${followId}`);
    },
};

export { api }; 