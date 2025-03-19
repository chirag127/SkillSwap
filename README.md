# SkillSwap: Neighborhood Barter Network

SkillSwap is a mobile application that enables users to trade skills and services without money. It creates a community-based economy where users can exchange their expertise for services they need.

![SkillSwap Logo](frontend/assets/logo.png)

## 📱 Features

-   **Skill Marketplace**: Browse and offer skills in various categories
-   **Time Bank**: Track hours exchanged between users
-   **Verified Reviews**: Build reputation with badges for reliability
-   **Community Events**: Connect with neighbors through organized meetups
-   **Secure Authentication**: Email verification and password reset functionality

## 🛠️ Tech Stack

### Backend

-   **Framework**: Express.js
-   **Database**: MongoDB
-   **Authentication**: JWT (JSON Web Tokens)
-   **Email Service**: Nodemailer

### Frontend

-   **Framework**: React Native with Expo
-   **Navigation**: React Navigation
-   **UI Components**: React Native Paper
-   **State Management**: Context API
-   **API Communication**: Axios

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn
-   MongoDB (local or Atlas)
-   Expo CLI (`npm install -g expo-cli`)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/skillswap.git
    cd skillswap
    ```

2. **Backend Setup**

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the backend directory with the following variables:

    ```
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRE=30d
    JWT_COOKIE_EXPIRE=30

    # Email Configuration
    EMAIL_USERNAME=your_email@example.com
    EMAIL_PASSWORD=your_email_password
    ```

3. **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1. **Start the Backend Server**

    ```bash
    cd backend
    npm run dev
    ```

2. **Start the Frontend (Expo)**

    ```bash
    cd frontend
    npm start
    ```

3. **Run on Device/Emulator**
    - Scan the QR code with the Expo Go app (Android)
    - Press 'i' for iOS simulator or 'a' for Android emulator

## 📱 App Structure

### Backend Structure

```
backend/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── middleware/     # Authentication middleware
├── models/         # MongoDB schemas
├── routes/         # API routes
├── utils/          # Utility functions
├── .env            # Environment variables
├── package.json    # Dependencies
└── server.js       # Entry point
```

### Frontend Structure

```
frontend/
├── assets/         # Images and static files
├── src/
│   ├── components/ # Reusable UI components
│   ├── context/    # Context API for state management
│   ├── navigation/ # Navigation configuration
│   ├── screens/    # App screens
│   └── config.js   # API configuration
├── App.js          # Main component
├── babel.config.js # Babel configuration
├── package.json    # Dependencies
└── app.json        # Expo configuration
```

## 🔄 API Endpoints

### Authentication

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Login user
-   `GET /api/auth/me` - Get current user
-   `POST /api/auth/forgotpassword` - Request password reset
-   `PUT /api/auth/resetpassword/:resettoken` - Reset password

### Users

-   `GET /api/users` - Get all users
-   `GET /api/users/:id` - Get single user
-   `GET /api/users/profile` - Get current user profile
-   `PUT /api/users/profile` - Update user profile
-   `DELETE /api/users/:id` - Delete user

### Skills

-   `GET /api/skills` - Get all skills
-   `POST /api/skills` - Create new skill
-   `GET /api/skills/search` - Search skills
-   `GET /api/skills/user/:userId` - Get user skills
-   `GET /api/skills/:id` - Get single skill
-   `PUT /api/skills/:id` - Update skill
-   `DELETE /api/skills/:id` - Delete skill

### Exchanges

-   `GET /api/exchanges` - Get all exchanges
-   `POST /api/exchanges` - Create exchange request
-   `GET /api/exchanges/user` - Get user exchanges
-   `GET /api/exchanges/:id` - Get single exchange
-   `PUT /api/exchanges/:id` - Update exchange status

### Reviews

-   `GET /api/reviews` - Get all reviews
-   `POST /api/reviews` - Add review
-   `GET /api/reviews/user/:userId` - Get user reviews
-   `GET /api/reviews/:id` - Get single review
-   `PUT /api/reviews/:id` - Update review
-   `DELETE /api/reviews/:id` - Delete review

### Events

-   `GET /api/events` - Get all events
-   `POST /api/events` - Create event
-   `GET /api/events/:id` - Get single event
-   `PUT /api/events/:id` - Update event
-   `DELETE /api/events/:id` - Delete event
-   `POST /api/events/:id/attend` - Attend event
-   `DELETE /api/events/:id/cancel` - Cancel attendance

## 📱 Screens

-   **Authentication**: Login, Register, Forgot Password, Reset Password
-   **Home**: Dashboard with recent skills, active exchanges, and upcoming events
-   **Skills**: Browse skills, skill details, add new skill
-   **Exchanges**: Manage exchange requests, view exchange details
-   **Time Bank**: Track time credits earned and spent
-   **Events**: Browse community events, event details, create event
-   **Profile**: User profile, reviews, skills offered

## 🔒 Security Features

-   Password hashing with bcrypt
-   JWT authentication
-   Secure password reset via email
-   Protected API routes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

-   Project Link: [https://github.com/yourusername/skillswap](https://github.com/yourusername/skillswap)

---

Built with ❤️ by [Your Name]
