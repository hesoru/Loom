# Fashion E-commerce Website

A modern e-commerce website built with React and Redux, featuring a clean and responsive design.

## Features

- Home page with featured products
- Product category browsing
- Product search functionality
- Detailed product pages
- Shopping cart with quantity management
- User profile management (Extra Feature using Redux)

## Product Categories

1. T-Shirts & Tops
2. Pants & Jeans
3. Dresses & Skirts

## Technologies Used

- React 18
- Redux Toolkit for state management
- React Router for navigation
- Custom CSS for styling (no external UI libraries)

## Extra Feature: User Profile Management

The website includes a user profile management system implemented using Redux. This feature allows users to:

- Create and manage their profile
- Save shipping information
- View their login status
- Update profile information

The profile management demonstrates the use of Redux for global state management, showing how to:
- Manage user authentication state
- Handle form data with Redux
- Implement persistent user data

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the app

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── redux/          # Redux store and slices
├── data/           # Mock data
└── App.js          # Main app component
```

## Available Scripts

- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run tests
