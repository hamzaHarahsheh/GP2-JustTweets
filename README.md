# 🐦 JustTweets - Social Media Platform

<div align="center">

**A modern, full-stack social media platform built with Spring Boot and React**

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-6DB33F?style=flat-square&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Cloud-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.0.2-0081CB?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

**JustTweets** is a feature-rich social media platform designed specifically for university students. It combines the best aspects of Twitter-like microblogging with modern UI/UX design and robust security features. Users can share posts, interact through likes and comments, follow other users, and discover content through an intuitive interface.

### 🎯 Key Highlights

- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **📱 Responsive Design**: Mobile-first approach with Material-UI components
- **🌙 Dark/Light Theme**: Dynamic theme switching with smooth transitions
- **🔍 Real-time Search**: Instant user discovery and content exploration
- **📸 Media Support**: Image upload and display capabilities
- **🔔 Notifications**: Real-time notification system for user interactions
- **👥 Social Features**: Follow/unfollow, likes, comments, and bookmarks
- **🎓 University Focus**: Email validation for educational institutions

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT Token-based Authentication**
- **Role-based Access Control** (User/Admin roles)
- **University Email Validation** (`username##@cit.just.edu.jo` format)
- **Secure Password Encryption** with BCrypt
- **Protected Routes** and API endpoints

### 👤 User Management
- **User Profiles** with bio, profile pictures, and activity tracking
- **Follow/Unfollow System** with follower/following counts
- **User Search** with real-time results
- **Profile Customization** with media upload support

### 📝 Content Management
- **Create Posts** with text and multiple image support
- **Like/Unlike** posts with real-time updates
- **Comment System** with threaded discussions
- **Bookmark Posts** for later viewing
- **Post Timeline** with chronological sorting

### 🎨 User Experience
- **Dark/Light Theme Toggle** with system preference detection
- **Responsive Design** optimized for all devices
- **Smooth Animations** and transitions
- **Intuitive Navigation** with sidebar and routing
- **Loading States** and error handling

### 🔔 Real-time Features
- **Notification System** for likes, comments, and follows
- **Live Search** with debounced queries
- **Real-time Updates** for user interactions
- **Activity Tracking** with timestamps

### 📊 Admin Features
- **Admin Dashboard** for user management
- **Automated Admin Creation** on first startup
- **Role Management** system
- **System Monitoring** capabilities

---

## 🛠 Tech Stack

### Backend
- **☕ Java 17** - Modern Java with latest features
- **🍃 Spring Boot 3.2.3** - Enterprise-grade framework
- **🔒 Spring Security** - Authentication & authorization
- **✅ Spring Validation** - Input validation and constraints
- **🍃 Spring Data MongoDB** - Database abstraction layer
- **🎫 JWT (JSON Web Tokens)** - Stateless authentication
- **📚 Lombok** - Boilerplate code reduction
- **🧪 JUnit** - Unit testing framework

### Frontend
- **⚛️ React 19.1.0** - Modern UI library
- **📘 TypeScript 4.9.5** - Type-safe JavaScript
- **🎨 Material-UI 7.0.2** - React component library
- **🛣️ React Router DOM** - Client-side routing
- **📡 Axios** - HTTP client for API calls
- **🪝 React Hooks** - State management and effects
- **📅 date-fns** - Date manipulation library
- **🔍 Lucide React** - Beautiful icon library

### Database & Infrastructure
- **🍃 MongoDB Atlas** - Cloud-hosted NoSQL database
- **☁️ Cloud Storage** - Media file storage
- **🔧 Gradle** - Build automation and dependency management

### Development Tools
- **📦 Webpack** - Module bundler and build tool
- **🔧 Babel** - JavaScript transpiler
- **🎯 ESLint** - Code linting and quality
- **🧪 Jest** - Frontend testing framework
- **🔄 Hot Reload** - Development server with live updates

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Java 17+** ([OpenJDK](https://openjdk.org/) or [Oracle JDK](https://www.oracle.com/java/technologies/downloads/))
- **Node.js 16+** and **npm** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/downloads))
- **MongoDB account** (or local MongoDB installation)

### 🔧 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YourUserName/GP2-JustTweets.git
   cd GP2-Jitter
   ```

2. **Backend Setup**
   ```bash
   # Configure database connection
   # Edit src/main/resources/application.properties
   # Update MongoDB URI with your credentials
   
   # Build and run the backend
   ./gradlew bootRun
   
   # Or on Windows
   gradlew.bat bootRun
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8081
   - **Admin Credentials** (auto-created):
     - Username: `admin`
     - Password: `AdminPassword123`
     - Email: `admin01@cit.just.edu.jo`

### 🔑 Environment Configuration

Create your own `application.properties` file:

```properties
spring.application.name=Jitter
server.port=8081

# MongoDB Configuration
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/database

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
spring.servlet.multipart.enabled=true

# Logging Configuration
logging.level.org.springframework.security=INFO
logging.level.com.Jitter.Jitter.Backend=INFO
```

---

## 📚 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/login` | User login | ❌ |
| `POST` | `/auth/register` | User registration | ❌ |
| `POST` | `/auth/refresh` | Refresh JWT token | ✅ |
| `POST` | `/auth/logout` | User logout | ✅ |

### 👤 User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users` | Get all users | ✅ |
| `GET` | `/users/{id}` | Get user by ID | ✅ |
| `PUT` | `/users/{id}` | Update user profile | ✅ |
| `DELETE` | `/users/{id}` | Delete user | ✅ (Admin) |
| `GET` | `/users/search?q={query}` | Search users | ✅ |
| `POST` | `/users/{id}/follow` | Follow user | ✅ |
| `DELETE` | `/users/{id}/follow` | Unfollow user | ✅ |
| `GET` | `/users/{id}/followers` | Get followers | ✅ |
| `GET` | `/users/{id}/following` | Get following | ✅ |

### 📝 Post Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/posts` | Get all posts | ✅ |
| `GET` | `/posts/{id}` | Get post by ID | ✅ |
| `POST` | `/posts` | Create new post | ✅ |
| `PUT` | `/posts/{id}` | Update post | ✅ |
| `DELETE` | `/posts/{id}` | Delete post | ✅ |
| `GET` | `/posts/user/{userId}` | Get user's posts | ✅ |
| `GET` | `/posts/{id}/image/{index}` | Get post image | ✅ |

### 💖 Interaction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/likes` | Like a post | ✅ |
| `DELETE` | `/likes/{postId}` | Unlike a post | ✅ |
| `GET` | `/likes/post/{postId}` | Get post likes | ✅ |
| `POST` | `/comments` | Create comment | ✅ |
| `GET` | `/comments/post/{postId}` | Get post comments | ✅ |
| `DELETE` | `/comments/{id}` | Delete comment | ✅ |
| `POST` | `/bookmarks` | Bookmark post | ✅ |
| `DELETE` | `/bookmarks/{postId}` | Remove bookmark | ✅ |

### 🔔 Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/notifications` | Get user notifications | ✅ |
| `PUT` | `/notifications/{id}/read` | Mark as read | ✅ |
| `DELETE` | `/notifications/{id}` | Delete notification | ✅ |

---

## �� Project Structure
GP2-JustTweets/
├── 🔧 Backend (Spring Boot)
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/com/Jitter/Jitter/
│ │ │ │ ├── JitterApplication.java # 🚀 Main Spring Boot Application
│ │ │ │ └── Backend/
│ │ │ │ ├── Controller/ # 🌐 REST API Controllers
│ │ │ │ ├── Service/ # 🔧 Business Logic Layer
│ │ │ │ ├── Repository/ # 🗄️ Data Access Layer (MongoDB)
│ │ │ │ ├── Models/ # 📋 Entity/Document Models
│ │ │ │ ├── DTO/ # 📦 Data Transfer Objects
│ │ │ │ ├── Security/ # 🔒 JWT & Authentication
│ │ │ │ └── Exceptions/ # ⚠️ Custom Exception Handlers
│ │ │ └── resources/
│ │ │ ├── application.properties # ⚙️ Application Configuration
│ │ │ └── static/ # 📁 Static Resources
│ │ └── test/ # 🧪 Backend Tests
│ ├── build.gradle # 📦 Gradle Build Configuration
│ ├── settings.gradle # ⚙️ Gradle Settings
│ ├── gradlew # 🐧 Gradle Wrapper (Unix)
│ └── gradlew.bat # 🪟 Gradle Wrapper (Windows)
│
├── 🎨 Frontend (React + TypeScript)
│ ├── public/ # 🌐 Static Assets
│ ├── src/
│ │ ├── components/ # ⚛️ React Components
│ │ │ ├── Post.tsx # 📝 Post Component (1124 lines)
│ │ │ ├── Timeline.tsx # 📰 Main Feed Component
│ │ │ ├── TweetBox.tsx # ✍️ Post Creation Component
│ │ │ ├── Profile.tsx # 👤 User Profile Component
│ │ │ ├── Sidebar.tsx # 🧭 Navigation Sidebar
│ │ │ ├── Explore.tsx # 🔍 User Discovery Component
│ │ │ ├── Notifications.tsx # 🔔 Notifications Component
│ │ │ ├── Resources.tsx # 📚 Resources Component
│ │ │ ├── PostDetail.tsx # 📖 Individual Post View
│ │ │ └── dialogs/ # 💬 Modal Dialog Components
│ │ ├── pages/ # 📄 Route Pages
│ │ │ ├── Login.tsx # 🔐 Login Page
│ │ │ └── Register.tsx # 📝 Registration Page
│ │ ├── hooks/ # 🪝 Custom React Hooks
│ │ ├── contexts/ # 🌐 React Context Providers
│ │ ├── services/ # 📡 API Service Layer
│ │ ├── utils/ # 🛠️ Utility Functions
│ │ ├── types/ # 📋 TypeScript Type Definitions
│ │ ├── App.tsx # 🏠 Main App Component
│ │ ├── index.tsx # 🚪 React Entry Point
│ │ ├── App.css # 🎨 Global Styles
│ │ └── index.css # 🎨 Base Styles
│ ├── package.json # 📦 NPM Dependencies
│ ├── package-lock.json # 🔒 NPM Lock File
│ ├── tsconfig.json # 📘 TypeScript Configuration
│ ├── webpack.config.js # 📦 Webpack Build Configuration
│ └── README.md # 📖 Frontend Documentation
│
├── 🗂️ Project Root
│ ├── .git/ # 🌳 Git Version Control
│ ├── .gradle/ # 📦 Gradle Cache
│ ├── .vscode/ # 💻 VS Code Configuration
│ ├── build/ # 🏗️ Build Output
│ ├── bin/ # 🔧 Binary Files
│ ├── gradle/ # 📦 Gradle Wrapper Files
│ ├── .gitignore # 🚫 Git Ignore Rules
│ ├── .gitattributes # 📝 Git Attributes
│ └── README.md # 📖 Main Project

### 🏗️ Architecture Overview

#### Backend Architecture (Spring Boot)
- **📱 Controller Layer**: REST API endpoints handling HTTP requests
- **🔧 Service Layer**: Business logic and transaction management
- **🗄️ Repository Layer**: MongoDB data access using Spring Data
- **🔒 Security Layer**: JWT authentication and authorization
- **📋 Model Layer**: MongoDB document entities
- **📦 DTO Layer**: Data transfer objects for API communication

#### Frontend Architecture (React + TypeScript)
- **⚛️ Component-Based**: Modular, reusable React components
- **📱 Responsive Design**: Mobile-first Material-UI components
- **🔄 State Management**: React Context and hooks for global state
- **🛣️ Client-Side Routing**: React Router for SPA navigation
- **📡 API Integration**: Axios for backend communication
- **🎨 Theming**: Dynamic dark/light theme support

#### Key Features by File Size
- **Post.tsx (52KB)**: Comprehensive post component with media support
- **Resources.tsx (43KB)**: Resource management and file handling
- **Register.tsx (28KB)**: User registration with validation
- **Explore.tsx (25KB)**: User discovery and search functionality
- **Notifications.tsx (20KB)**: Real-time notification system
- **Timeline.tsx (20KB)**: Main feed with infinite scrolling

---

## 🚧 Development Workflow

1. **Backend Development**
   ```bash
   # Start backend development server
   ./gradlew bootRun
   
   # Run backend tests
   ./gradlew test
   
   # Build backend JAR
   ./gradlew build
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   
   # Start development server
   npm start
   
   # Run tests
   npm test
   
   # Build for production
   npm run build
   ```

3. **Full Stack Development**
   - Backend runs on **http://localhost:8081**
   - Frontend runs on **http://localhost:3000**
   - Database: **MongoDB Atlas Cloud**

---