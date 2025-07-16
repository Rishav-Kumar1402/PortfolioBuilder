# Portfolio Builder Backend

This is the backend server for the Portfolio Builder application.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio-builder

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# DeepSeek API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Email Configuration (for future use)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. DeepSeek API Setup
1. Sign up for a DeepSeek account at https://platform.deepseek.com/
2. Get your API key from the dashboard
3. Add the API key to your `.env` file as `DEEPSEEK_API_KEY`

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Resume Upload
- **POST** `/api/upload-resume`
- Uploads and parses PDF resumes using AI
- Returns structured data for portfolio building

### Portfolio Management
- **POST** `/api/save-portfolio`
- Saves portfolio data to database

- **GET** `/api/get-portfolio/:email`
- Retrieves portfolio data by email

## Features

### AI-Powered Resume Parsing
- Uses DeepSeek R1 API for intelligent resume parsing
- Extracts structured data from various resume formats
- Falls back to basic text extraction if AI parsing fails
- Supports multiple resume formats and layouts

### Data Structure
The AI parser extracts the following information:
- Personal Information (name, email, phone)
- Portfolio Links (LinkedIn, GitHub, etc.)
- Work Experience
- Projects
- Education
- Skills (languages and tools)
- Certifications

## Error Handling
- Graceful fallback from AI parsing to basic text extraction
- Comprehensive error logging
- File cleanup after processing
- Timeout handling for API calls

## Dependencies
- Express.js - Web framework
- Multer - File upload handling
- PDF-parse - PDF text extraction
- Axios - HTTP client for API calls
- Mongoose - MongoDB ODM
- JWT - Authentication 