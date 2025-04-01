# Web Application Development NCIS403 - Assignment 2

## Project Structure
```
STUDENT_ID_WEBDEV/
│
├── backend/
│   ├── server.js             # Main Express server file
│   ├── users.json            # JSON file to store user data
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   └── validation.js     # Input validation middleware
│   ├── routes/
│   │   └── api.js            # API route definitions
│   └── utils/
│       └── data.js           # Data handling utilities
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       └── components/
│           ├── AuthForm.js   # Registration/Login form
│           └── Profile.js    # User profile component
│
├── postman/
│   └── exam_collection.json  # Exported Postman collection
│
└── README.txt                # This file
```

## How to Run the Code

### Prerequisites
- Node.js and npm installed
- VS Code or any other code editor

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   The server will run on http://localhost:5000

### Frontend Setup
1. Open a new terminal window
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```

3. Install the required dependencies:
   ```
   npm install
   ```

4. Start the React development server:
   ```
   npm start
   ```
   The frontend will run on http://localhost:3000

### Using Postman for API Testing
1. Import the `postman/exam_collection.json` file into Postman
2. The collection includes all the required test scenarios:
   - Registering a user with valid and invalid data
   - Logging in with correct and incorrect credentials
   - Accessing protected routes with and without API key
   - Updating username with valid and invalid inputs

## API Endpoints

### User Registration
- **URL**: POST /api/register
- **Body**: 
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object (without password) and success message

### User Login
- **URL**: POST /api/login
- **Body**: 
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object (without password) and success message

### Get User Profile
- **URL**: GET /api/profile
- **Headers**: X-API-Key: EXAM2024-KEY-5678
- **Response**: Array of user objects (without passwords)

### Update Username
- **URL**: PATCH /api/profile
- **Headers**: X-API-Key: EXAM2024-KEY-5678
- **Body**: 
  ```json
  {
    "userId": "user_id_here",
    "username": "newUsername"
  }
  ```
- **Response**: Updated user object (without password) and success message

## Notes
- The API key (EXAM2024-KEY-5678) is required for protected routes
- Passwords are hashed using bcrypt with salt rounds of 10
- User data is stored in the users.json file
- Email validation uses regex to ensure a valid format
- Password validation ensures a minimum length of 8 characters
- Username validation ensures no special characters are used