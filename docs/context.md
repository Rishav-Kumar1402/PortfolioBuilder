# 🎨 Custom Portfolio Builder

A powerful full-stack web application that transforms resumes into stunning, personalized portfolio websites using AI.

## ✨ Features

- 📄 Resume Upload & Parsing
- 📝 Smart Form Autofill
- 🎯 Customizable Content
- 🤖 AI-Powered Portfolio Generation
- 📦 Download as ZIP
- 🚀 Direct Vercel Deployment

## 🛠️ Tech Stack

- **Frontend:** React, JavaScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Deployment:** Vercel
- **AI Integration:** DeepSeek api

## 📁 Project Structure

```
portfolio-builder/
├── frontend/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── utils/         # Helper functions
│   ├── assets/        # Static assets
│   └── App.jsx        # Root component
│
└── backend/
    ├── controllers/   # Route controllers
    ├── models/        # Database models
    ├── routes/        # API routes
    ├── services/      # Business logic
    ├── functions/     # Utility functions
    └── server.js      # Entry point
```

## 🔄 Application Flow

### 1. Resume Upload & Processing
- Drag-and-drop PDF upload interface
- Backend PDF parsing using `pdf-parse`
- Structured data extraction (personal info, experience, education)

### 2. Smart Form Generation
- Multi-tabbed form interface
- Auto-populated fields from parsed resume
- Real-time editing capabilities
- Section management (add/update/remove)

### 3. Portfolio Generation
- AI-powered website generation
- Custom animations and transitions
- Responsive design implementation
- Preview functionality

### 4. Deployment Options
- ZIP file download
- Direct Vercel deployment
- Preview before publishing

## 🔌 API Integration

### Portfolio Generation Endpoint
```http
POST /generate-portfolio
Content-Type: application/json
Authorization: Bearer ${API_KEY}

{
  "formData": {
    "personalInfo": {...},
    "experience": [...],
    "education": [...],
    "skills": [...]
  }
}
```

## 🏗️ Backend Architecture

### Core Components

#### Routes
- `/upload-resume` - Handle PDF uploads
- `/parse-resume` - Extract resume data
- `/submit-details` - Process form submissions
- `/generate-portfolio` - Create portfolio
- `/download-zip` - Generate downloadable package
- `/deploy-vercel` - Handle Vercel deployment

#### Controllers
- `resumeController.js` - Resume processing logic
- `portfolioController.js` - Portfolio generation
- `vercelController.js` - Deployment handling

#### Models
- `User.js` - User data and portfolio storage

#### Services
- `pdfParserService.js` - PDF text extraction
- `portfolioGeneratorService.js` - AI integration
- `vercelDeployService.js` - Deployment automation

## 🎨 UI/UX Design

### Design Principles
- Clean, modern interface
- Responsive layouts
- Smooth animations
- Intuitive navigation
- Mobile-first approach

### Key Components
- Gradient backgrounds
- Card-based layouts
- Modal dialogs
- Tabbed interfaces
- Progress indicators

## 🔒 Security & Configuration

### Environment Variables
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
API_KEY=your_ai_api_key
VERCEL_TOKEN=your_vercel_token
```

### Dependencies
- **Backend:** express, mongoose, cors, dotenv, multer
- **Frontend:** axios, framer-motion, react-router-dom

## 📋 Development Checklist

### Frontend Tasks
- [ ] Resume upload component
- [ ] Form generator with tabs
- [ ] Preview modal
- [ ] Download & deploy buttons
- [ ] Responsive design implementation
- [ ] Animation integration

### Backend Tasks
- [ ] Resume parser implementation
- [ ] AI integration
- [ ] ZIP generation
- [ ] Vercel deployment
- [ ] Error handling
- [ ] API documentation

## 🚀 Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Deployment
```bash
# Build application
npm run build

# Start production server
npm start
```


