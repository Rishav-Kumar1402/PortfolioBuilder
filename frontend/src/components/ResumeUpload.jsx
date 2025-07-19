import { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import { ThemeContext } from '../App';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [parsingStatus, setParsingStatus] = useState('');
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB');
        return;
      }
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  }, []);

  const extractTextFromPDF = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
          }
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const parseResumeWithAI = async (resumeText) => {
    try {
      const prompt = `Please parse the following resume text and extract structured information. Return the data in the exact JSON format specified below.

      Resume Text:
      ${resumeText}
      
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
        '/api/completions',
        {
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume parser. Extract structured information from resumes and return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        }
      );
      if (response?.data && response?.data?.data) {
        const aiResponse = response?.data.data;
        // Extract JSON from the response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No valid JSON found in AI response');
        }
        const parsedData = JSON.parse(jsonMatch[0]);
       return parsedData;
      } else {
        throw new Error('Invalid response from AI API');
      }
    } catch (error) {
      console.error('AI parsing error:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setParsingStatus('');
    
    try {
      // Extract text from PDF
      setParsingStatus('Extracting text from PDF...');
      const resumeText = await extractTextFromPDF(file);
      setUploadProgress(50);
      
      // Parse with AI
      setParsingStatus('Parsing resume with AI...');
      const parsedData = await parseResumeWithAI(resumeText);
      setUploadProgress(100);
      
      setParsingStatus('✅ AI parsing completed successfully!');
      
      // Small delay to show the status message
      setTimeout(() => {
        navigate('/builder', {
          state: {
            parsedData: parsedData,
          },
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error processing resume:', error);
      setError(error.message || 'Error processing resume');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-10 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      <div className={`w-full max-w-xl mx-auto rounded-3xl shadow-2xl p-8 sm:p-12 border mt-[50px] ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="text-center mb-8">
          <h2 className={`text-3xl sm:text-4xl font-extrabold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Upload Your Resume</h2>
          <p className={`text-base sm:text-lg mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Start building your portfolio by uploading your resume in PDF format.</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Maximum file size: 5MB</p>
        </div>
        <div
          className={`transition-all duration-300 border-2 rounded-2xl p-8 text-center cursor-pointer flex flex-col items-center justify-center ${
            isDragging ? (theme === 'dark' ? 'border-blue-500 bg-blue-900/30' : 'border-blue-500 bg-blue-50') : `border-dashed ${theme === 'dark' ? 'border-gray-600 bg-gray-900/40' : 'border-gray-300 bg-gray-50'}`
          } hover:shadow-lg focus-within:shadow-xl`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-3 w-full">
            <div className="animate-bounce-slow">
              <svg className="mx-auto h-16 w-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                <rect x="8" y="8" width="32" height="40" rx="6" fill="#fff" stroke="#a78bfa" strokeWidth="2" />
                <path d="M24 16v16M24 32l-6-6m6 6l6-6" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="16" y="36" width="16" height="4" rx="2" fill="#a78bfa" />
              </svg>
            </div>
            <p className={`mt-2 text-base sm:text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Drag & drop your PDF resume here</p>
            <span className="text-gray-400 text-xs">or</span>
            <label className={`inline-block px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500'}`}>
              Browse Files
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
            {file && (
              <div className={`flex items-center justify-center mt-4 space-x-2 px-4 py-2 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2v6h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{file.name}</span>
                <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-xs sm:text-sm mt-2 font-semibold">
                {error}
              </div>
            )}
            {isUploading && (
              <div className="w-full mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Processing... {uploadProgress}%</p>
              </div>
            )}
            {parsingStatus && (
              <div className="w-full mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">{parsingStatus}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 text-center flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`w-full sm:w-auto py-3 px-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
              ${(!file || isUploading)
                ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'}`}
          >
            {isUploading ? 'Processing...' : 'AutoFill Using AI'}
          </button>
          <button
            onClick={() => navigate('/builder', { state: { parsedData: null } })}
            disabled={isUploading}
            className={`w-full sm:w-auto py-3 px-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
              ${isUploading
                ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-600 text-white'}`}
          >
            Fill Manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload; 