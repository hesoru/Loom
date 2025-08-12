# CPSC 455: Assignments

### By Helena Sokolovska

## Assignment 2: Frontend (React & Redux)

A modern and responsive fashion e-commerce website. Built with React, Redux Toolkit, and custom CSS (no external UI libraries).

### Features
- Product category browsing page.
- Product search page.
- Product details pages: select clothing size, add to cart, and quantity management.
- Shopping cart page with quantity management.

### Extra Features
- Featured products component on home page.
- Product only added to cart if size is selected (with corresponding notifications).

## Assignment 3: Full Stack (React, Redux, Express, MongoDB)

A modern and responsive fashion e-commerce website. Built with React, Redux Toolkit, Express, MongoDB, and custom CSS (no external UI libraries).

### Features
- Deployed as Docker container
- MongoDB database
- Product search page: search by clothing name, description, size, or category
- Best sellers page
- Checkout process
- Admin page: shopping carts and orders lists

### Extra Features
- User authentication: login/register (hashing and salting, JWT authentication)

## Docker Setup Instructions

### Running the Application

1. Clone the repository and navigate to the "Assignment 3" branch.
2. Run the application using Docker Compose:
   ```bash
   # For first time or after code changes:
   docker-compose up --build
   
   # For subsequent runs when no changes were made:
   docker-compose up

   # To stop the application:
   docker-compose down
   ```
3. Access the application:
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:5000/api