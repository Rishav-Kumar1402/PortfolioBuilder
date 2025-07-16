const axios = require('axios');

class DeepSeekService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.baseURL = 'https://api.deepseek.com/v1/chat/completions';
  }

  async parseResumeWithAI(rawText) {
    try {
      if (!this.apiKey) {
        throw new Error('DeepSeek API key not configured');
      }

      const prompt = `Please parse the following resume text and extract structured information. Return the data in the exact JSON format specified below.

Resume Text:
${rawText}

Please extract and return the following information in this exact JSON format:
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
      "duration": "Duration (e.g., 2020 - Present)",
      "description": "Job description and achievements"
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
      "duration": "Duration (e.g., 2018 - 2022)",
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

Important:
1. Extract all available information from the resume
2. If any field is not found, use empty string or empty array
3. For skills, separate programming languages and tools/technologies
4. For portfolio links, extract URLs if available
5. For work experience and projects, extract as much detail as possible
6. Return only valid JSON, no additional text or explanations`;

      const response = await axios.post(
        this.baseURL,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 4000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 seconds timeout for AI processing
        }
      );

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        throw new Error('Invalid response from DeepSeek API');
      }

      const aiResponse = response.data.choices[0].message.content;
      console.log('AI Response:', aiResponse);
      
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in AI response:', aiResponse);
        throw new Error('No valid JSON found in AI response');
      }

      let parsedData;
      try {
        parsedData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('Invalid JSON format in AI response');
      }
      
      // Validate and clean the parsed data
      return this.validateAndCleanData(parsedData);

    } catch (error) {
      console.error('DeepSeek API Error:', error);
      throw new Error(`AI parsing failed: ${error.message}`);
    }
  }

  validateAndCleanData(data) {
    // Ensure all required fields exist with proper structure
    const cleanedData = {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      portfolioLinks: {
        portfolioWebsite: data.portfolioLinks?.portfolioWebsite || '',
        linkedin: data.portfolioLinks?.linkedin || '',
        github: data.portfolioLinks?.github || '',
        leetcode: data.portfolioLinks?.leetcode || '',
        hackerrank: data.portfolioLinks?.hackerrank || ''
      },
      workExperience: Array.isArray(data.workExperience) ? data.workExperience.map(exp => ({
        company: exp.company || '',
        position: exp.position || '',
        duration: exp.duration || '',
        description: exp.description || ''
      })) : [],
      projects: Array.isArray(data.projects) ? data.projects.map(proj => ({
        title: proj.title || '',
        techStack: Array.isArray(proj.techStack) ? proj.techStack : [],
        description: proj.description || '',
        github: proj.github || '',
        liveDemo: proj.liveDemo || ''
      })) : [],
      education: Array.isArray(data.education) ? data.education.map(edu => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        duration: edu.duration || '',
        score: edu.score || ''
      })) : [],
      skills: {
        languages: Array.isArray(data.skills?.languages) ? data.skills.languages : [],
        tools: Array.isArray(data.skills?.tools) ? data.skills.tools : []
      },
      certifications: Array.isArray(data.certifications) ? data.certifications.map(cert => ({
        title: cert.title || '',
        year: cert.year || '',
        provider: cert.provider || '',
        certificateLink: cert.certificateLink || ''
      })) : []
    };

    return cleanedData;
  }
}

module.exports = new DeepSeekService(); 