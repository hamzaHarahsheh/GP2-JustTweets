export interface User {
    id: string;
    username: string;
    email: string;
    bio?: string;
    profilePicture?: Media;
    createdAt: Date;
    updatedAt: Date;
}

export interface Post {
    id: string;
    userId: string;
    content: string;
    image?: Media[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Media {
    fileName: string;
    type: string;
    data: string;
    createdAt: Date;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: Date;
}

export interface Like {
    id: string;
    userId: string;
    postId: string;
    createdAt: Date;
}

export interface LoginResponse {
    token: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    bio?: string;
    profilePicture?: File;
} 