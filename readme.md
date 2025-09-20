# Ubanto Real Estate

A modern, full-stack real estate application that allows users to browse, search, and manage property listings. Built with modern web technologies to provide a seamless experience for both property seekers and real estate professionals.

## Live Demo

**Deployed Application**: https://ubanto-realstate.onrender.com/signin

## Features

- **User Authentication**: Secure sign-in/sign-up functionality
- **Property Listings**: Browse and search through available properties
- **Advanced Search**: Filter properties by location, price, type, and features
- **Property Details**: Comprehensive property information with images
- **User Dashboard**: Manage saved properties and user preferences
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, intuitive interface for better user experience

## Technology Stack

### Frontend

- React.js
- Tailwind Css
- Redux Toolkit
- JavaScript (ES6+)
- Responsive Design

### Backend

- Node.js
- Express.js
- RESTful API architecture

### Database

- MongoDB

### Deployment

- Render.com

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Clone the Repository

```bash
git clone https://github.com/hamzanazir27/real-state-project.git
cd real-state-project

```

### Install Dependencies

### Backend Setup

```bash
# Navigate to backend directory (if separate)
cd backend
npm install

```

### Frontend Setup

```bash
# Navigate to frontend directory (if separate)
cd frontend
npm install

```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5000

# Other API keys (if applicable)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

```

### Run the Application

### Development Mode

```bash
# Start backend server
npm run server

# Start frontend (in a new terminal)
npm run client

# Or run both concurrently
npm run dev

```

### Production Mode

```bash
npm start

```

The application will be available at `http://localhost:3000`

## Project Structure

```
real-state-project/
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS/SCSS files
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── package.json
├── .env                   # Environment variables
├── .gitignore
└── README.md

```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Properties

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property (authenticated)
- `PUT /api/properties/:id` - Update property (authenticated)
- `DELETE /api/properties/:id` - Delete property (authenticated)

### Search & Filter

- `GET /api/properties/search` - Search properties with filters

## Key Features Explained

### Authentication System

- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes for authenticated users

### Property Management

- CRUD operations for properties
- Image upload and management
- Advanced search and filtering capabilities

### User Experience

- Responsive design for all devices
- Fast loading times
- Intuitive navigation and search

## Deployment

This project is deployed on Render.com. To deploy your own instance:

1. Fork this repository
2. Connect your GitHub account to Render
3. Create a new web service
4. Set environment variables in Render dashboard
5. Deploy!

### Environment Variables for Deployment

Make sure to set the following environment variables in your deployment platform:

- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Author

**Hamza Nazir**

- GitHub: [@hamzanazir27](https://github.com/hamzanazir27)
- LinkedIn: [https://www.linkedin.com/in/hamzanazir1/]

---
