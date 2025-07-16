# DeepSeek R1 API Integration

This document explains how to set up and use the DeepSeek R1 API for intelligent resume parsing in the Portfolio Builder application.

## Overview

The application now uses DeepSeek R1 API to intelligently parse resumes and extract structured information. This provides much better accuracy compared to the previous basic text parsing approach.

## Features

- **AI-Powered Parsing**: Uses DeepSeek R1 to understand and extract information from various resume formats
- **Fallback Mechanism**: Falls back to basic text parsing if AI parsing fails
- **Structured Data**: Extracts information in a consistent format regardless of resume layout
- **Error Handling**: Comprehensive error handling with graceful degradation

## Setup Instructions

### 1. Get DeepSeek API Key

1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up for an account
3. Navigate to the API section
4. Generate an API key
5. Copy the API key

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# DeepSeek API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Other required variables
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio-builder
JWT_SECRET=your_jwt_secret
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Test the Integration

You can test the DeepSeek integration using the test endpoint:

```bash
curl -X POST http://localhost:5000/api/test/test-deepseek \
  -H "Content-Type: application/json" \
  -d '{
    "text": "John Doe\nSoftware Engineer\njohn.doe@email.com\n+1-555-123-4567\n\nWork Experience:\nSenior Developer at Tech Corp [2020-Present]\n- Developed web applications using React and Node.js\n- Led team of 5 developers\n\nEducation:\nB.S. Computer Science\nUniversity of Technology (2018-2022)\nGPA: 3.8/4.0\n\nSkills:\nLanguages: JavaScript, Python, Java\nTools: React, Node.js, Git, Docker"
  }'
```

## How It Works

### 1. Resume Upload Flow

1. User uploads a PDF resume
2. Backend extracts text from PDF using `pdf-parse`
3. Text is sent to DeepSeek R1 API with a structured prompt
4. AI returns parsed data in JSON format
5. Data is validated and cleaned
6. Frontend receives structured data for form population

### 2. AI Prompt Structure

The AI is prompted to extract:
- Personal Information (name, email, phone)
- Portfolio Links (LinkedIn, GitHub, etc.)
- Work Experience (company, position, duration, description)
- Projects (title, tech stack, description, links)
- Education (degree, institution, duration, score)
- Skills (languages and tools)
- Certifications (title, year, provider, link)

### 3. Response Format

The AI returns data in this exact format:

```json
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "portfolioLinks": {
    "portfolioWebsite": "https://portfolio-website.com",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "leetcode": "https://leetcode.com/username",
    "hackerrank": "https://hackerrank.com/username"
  },
  "workExperience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "duration": "Duration",
      "description": "Job description"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "techStack": ["Technology1", "Technology2"],
      "description": "Project description",
      "github": "https://github.com/username/project",
      "liveDemo": "https://project-demo.com"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "duration": "Duration",
      "score": "GPA or Score"
    }
  ],
  "skills": {
    "languages": ["Language1", "Language2"],
    "tools": ["Tool1", "Tool2"]
  },
  "certifications": [
    {
      "title": "Certification Name",
      "year": "Year",
      "provider": "Provider Name",
      "certificateLink": "https://certificate-link.com"
    }
  ]
}
```

## Error Handling

### 1. API Key Missing
- Application falls back to basic text parsing
- User sees warning message
- No functionality is lost

### 2. API Call Failure
- Network errors, timeouts, or API errors
- Falls back to basic text parsing
- Error is logged for debugging

### 3. Invalid Response
- If AI returns malformed JSON
- Falls back to basic text parsing
- Error is logged for debugging

## Frontend Integration

### 1. Visual Indicators

The frontend shows different indicators based on parsing method:

- **AI Parsing**: Green badge with robot emoji 🤖
- **Basic Parsing**: Yellow badge with document emoji 📄

### 2. Status Messages

During upload, users see:
- "Parsing resume with AI..." during processing
- "✅ AI parsing completed successfully!" when successful
- "⚠️ Using basic parsing (AI not available)" when fallback is used

## Performance Considerations

### 1. Timeout Settings
- API call timeout: 60 seconds
- Upload timeout: 30 seconds
- Sufficient for most resume processing

### 2. Token Limits
- Max tokens: 4000
- Sufficient for detailed resume parsing
- Can be adjusted based on needs

### 3. Rate Limiting
- Consider implementing rate limiting for production
- Monitor API usage and costs

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the API key is correct
   - Check if the key has proper permissions
   - Ensure the key is not expired

2. **Timeout Errors**
   - Increase timeout values in the service
   - Check network connectivity
   - Verify API endpoint availability

3. **Invalid JSON Response**
   - Check the AI prompt format
   - Verify the model is responding correctly
   - Review the response parsing logic

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
DEBUG=true
```

This will log detailed information about API calls and responses.

## Cost Considerations

- DeepSeek API charges per token
- Monitor usage to control costs
- Consider implementing caching for repeated requests
- Set up usage alerts

## Future Enhancements

1. **Caching**: Cache parsed results to reduce API calls
2. **Batch Processing**: Process multiple resumes at once
3. **Custom Models**: Train custom models for specific industries
4. **Real-time Feedback**: Show parsing progress in real-time
5. **Manual Correction**: Allow users to correct AI parsing errors 