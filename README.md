# Loom

A comprehensive full-stack fashion e-commerce website featuring a modern React frontend with Redux state management, Express.js backend API, and MongoDB database. Built entirely with custom CSS without external UI libraries.

## Setup Instructions

### Environment Configuration
1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Update `.env` with your secure values:
   - `JWT_SECRET`: Use a strong, unique secret key for JWT token signing
   - `MONGO_URI`: Your MongoDB connection string

### Local Development
```bash
npm run dev  # Runs both frontend (port 3000) and backend (port 5000)
```

### Production Deployment
```bash
docker-compose up --build  # Containerized deployment on port 5000
```
Access the application:
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

## Tech Stack

### Frontend Stack
- **React 19.1.0** - Component-based UI framework
- **Redux Toolkit 2.8.2** - State management with modern Redux patterns
- **React Router DOM 7.6.1** - Client-side routing and navigation
- **Custom CSS** - Responsive design without external UI libraries
- **Axios 1.10.0** - HTTP client for API communication

### Backend Stack
- **Express.js 5.1.0** - Web application framework
- **MongoDB** with **Mongoose 8.16.0** - NoSQL database with ODM
- **JWT Authentication** - Secure user authentication with jsonwebtoken
- **bcryptjs** - Password hashing and salting
- **CORS** - Cross-origin resource sharing configuration

### DevOps & Deployment
- **Docker & Docker Compose** - Containerized deployment
- **MongoDB Container** - Persistent database with health checks
- **Environment Configuration** - Secure environment variable management
- **Concurrent Development** - Frontend and backend development servers

## Features

### User Experience
- **Responsive Design** - Mobile-first approach with custom CSS
- **Product Catalog** - Browse products by categories (T-Shirts & Tops, Pants & Jeans, Dresses & Skirts)
- **Advanced Search** - Search by product name, description, size, or category
- **Product Details** - Detailed product pages with size selection and quantity management
- **Shopping Cart** - Add/remove items with real-time quantity updates
- **Secure Checkout** - Complete order processing with user authentication

### Authentication & User Management
- **User Registration/Login** - Secure account creation with password hashing
- **JWT Token Authentication** - Stateless authentication with secure tokens
- **Protected Routes** - Role-based access control
- **User Profile** - Order history and account management

### Administrative Features
- **Admin Dashboard** - Administrative interface for order management
- **Shopping Cart Analytics** - View all user shopping carts
- **Order Management** - Complete order tracking and management system