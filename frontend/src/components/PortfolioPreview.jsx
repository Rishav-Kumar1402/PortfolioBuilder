import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import JSZip from 'jszip';

const PortfolioPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioHtml, setPortfolioHtml] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { portfolioData } = location.state || {};
  const hasGenerated = useRef(false);
  const generatingRef = useRef(false);

  // Function to clean up generated HTML and remove problematic CSS
  // const cleanGeneratedHtml = (html) => {
  //   if (!html) return html;
    
  //   // Remove any full-screen overlays or problematic background colors
  //   let cleanedHtml = html;
    
  //   // Replace any full-screen dark backgrounds
  //   cleanedHtml = cleanedHtml.replace(
  //     /background:\s*#1e3a8a|background:\s*#1e40af|background:\s*#1d4ed8|background:\s*#2563eb|background:\s*#3b82f6/gi,
  //     'background: transparent'
  //   );
    
  //   // Replace any body/html full-screen dark backgrounds
  //   cleanedHtml = cleanedHtml.replace(
  //     /body\s*{[^}]*background[^}]*}/gi,
  //     'body { margin: 0; padding: 0; font-family: Arial, sans-serif; }'
  //   );
    
  //   // Remove any fixed positioned overlays
  //   cleanedHtml = cleanedHtml.replace(
  //     /position:\s*fixed[^}]*background[^}]*#1e3a8a[^}]*}/gi,
  //     ''
  //   );
    
  //   // Ensure the portfolio content is visible
  //   cleanedHtml = cleanedHtml.replace(
  //     /<style>/,
  //     `<style>
  //       body { 
  //         margin: 0; 
  //         padding: 0; 
  //         font-family: Arial, sans-serif; 
  //         background: white !important;
  //         color: black !important;
  //       }
  //       * { box-sizing: border-box; }
  //       .portfolio-container { 
  //         background: white !important; 
  //         min-height: 100vh;
  //       }
  //     `
  //   );
    
  //   return cleanedHtml;
  // };

  useEffect(() => {
    const generatePortfolio = async () => {
      if (!portfolioData || generatingRef.current) {
        return;
      }
      generatingRef.current = true;
      try {
        setIsGenerating(true);
        setLoading(true);
   // Optimized AI Prompt for DeepSeek or similar front-end code generation model
const prompt = `
You are a professional front-end developer. Your task is to create a fully responsive, modern, visually appealing personal portfolio website using only HTML, Tailwind CSS, and JavaScript. Use **every single data field provided below**.

---

### Design Requirements:

**Color Scheme:**  
- Use any modern gradient color combination in backgrounds.

**Typography:**  
- Clean, readable fonts  
- Bold headings, medium subheadings, regular body text  

**Layout & Style:**  
- Spacious sections with clear hierarchy  
- Subtle shadows, glassmorphism, animated floating elements  

---

### Section-Specific Guidelines:

**Header:**  
- Fixed top nav bar with backdrop blur, gradient logo text  
- Smooth scroll, active section highlight  
- Mobile hamburger menu with slide-down

**Hero:**  
- Full-screen with animated gradient  
- Floating shapes, large bold name/title  
- Animated CTA buttons, fade/slide-in intro

**About:**  
- Two-column layout  
- Avatar with gradient border  
- Contact cards + social icons  
- Professional bio

**Experience:**  
- Timeline or card format  
- Company, position, duration, description  
- Tech tags, border accents, hover lift animation

**Projects:**  
- 3-column responsive grid  
- Cards with gradient image area, title, tech badges  
- GitHub/live demo buttons  
- Transform hover effects

**Skills:**  
- 2-column layout  
- Progress bars with animated gradient fill  
- Tool icons in grid with hover effects

**Education:**  
- Timeline or card layout  
- Degree, institution, duration, score  
- Animated on scroll with stagger delays

**Certifications:**  
- Grid of cards with icons, titles, issuer, link  
- Hover animations

**Contact:**  
- Two-column layout  
- Styled contact form with validation  
- Contact details panel with gradient background

---

### Personal Information:
Name: ${portfolioData.name}  
Email: ${portfolioData.email}  
Phone: ${portfolioData.phone}  

${portfolioData.profileImage ? `### Profile Image (Base64):\n${portfolioData.profileImage.substring(0, 100)}... (truncated)\n\nUse this image as the user's avatar or profile picture in the portfolio.\n` : ''}

### Portfolio Links:
${Object.entries(portfolioData.portfolioLinks).map(([key, value]) => `${key}: ${value}`).join(' | ')}

### Work Experience:
${portfolioData.workExperience.map((exp, i) => 
`${i + 1}) ${exp.position} at ${exp.company}  
Duration: ${exp.duration}  
Description: ${exp.description}`).join('\n\n')}

### Projects:
${portfolioData.projects.map((proj, i) => 
`${i + 1}) ${proj.title}  
Tech Stack: ${proj.techStack.join(', ')}  
Description: ${proj.description}  
GitHub: ${proj.github} | Live Demo: ${proj.liveDemo}`).join('\n\n')}

### Education:
${portfolioData.education.map((edu, i) => 
`${i + 1}) ${edu.degree}  
Institution: ${edu.institution}  
Duration: ${edu.duration}  
Score: ${edu.score}`).join('\n\n')}

### Skills:
Languages: ${portfolioData.skills.languages.join(', ')}  
Tools: ${portfolioData.skills.tools.join(', ')}

### Certifications:
${portfolioData.certifications.length ? portfolioData.certifications.map((cert, i) => 
`${i + 1}) ${cert.title} - ${cert.year}  
Provider: ${cert.provider}  
Certificate: ${cert.certificateLink}`).join('\n\n') : 'None'}

----

### Output Instructions:
Return a **single code block** with a complete, production-ready portfolio website.  
**Only output HTML, Tailwind CSS, and JavaScript** (no markdown or explanations).  
All required styles must be inline  Tailwind classes), and JavaScript should be within tags.  
Ensure every section is styled as per the design specs and that no data is omitted.

`;
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/completions`,
          {
            model: 'deepseek/deepseek-r1:free',
            messages: [
              {
                role: 'system',
                content: 'You are a professional web developer specializing in creating modern, responsive portfolio websites.'
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          }
        );
        if (response.data && response.data.data) {
          setPortfolioHtml(response.data.data);
          hasGenerated.current = true;
        } else {
          throw new Error('Invalid response from API');
        }
      } catch (error) {
        console.error('Error generating portfolio:', error);
        setError(error.response?.data?.error?.message || error.message || 'Error generating portfolio');
      } finally {
        setLoading(false);
        setIsGenerating(false);
        generatingRef.current = false;
      }
    };

    generatePortfolio();
  }, [portfolioData]);

  const handleDownload = async () => {
    try {
      const zip = new JSZip();
      
      // Create index.html
      zip.file('index.html', portfolioHtml);
      
      // Create a basic README.md
      const readme = `# Portfolio Website
This portfolio website was generated using the Portfolio Builder application.
To run this website locally, simply open the index.html file in your web browser.`;
      zip.file('README.md', readme);

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'portfolio-website.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Error creating download file. Please try again.');
    }
  };

  const handleDeploy = async () => {
    try {
      // Here you would typically:
      // 1. Create a GitHub repository
      // 2. Push the code
      // 3. Connect to Vercel
      // For now, we'll just show a message
      alert('Deployment functionality will be implemented soon. For now, you can download the code and deploy it manually to Vercel or any other platform.');
    } catch (error) {
      console.error('Error deploying:', error);
      alert('Error deploying portfolio. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating your portfolio...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-6 bg-red-50 rounded-lg"
        >
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Debug section - remove this after fixing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-4 bg-yellow-100 border-b">
          <details>
            <summary className="cursor-pointer font-bold">Debug: Generated HTML (Click to expand)</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-40 bg-gray-100 p-2 rounded">
              {portfolioHtml.substring(0, 1000)}...
            </pre>
          </details>
        </div>
      )}
      
      <div className="flex-grow relative">
        {portfolioHtml ? (
          <div className="w-full h-full bg-white">
            <iframe
              srcDoc={portfolioHtml}
              title="Portfolio Preview"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin"
              style={{ 
                minHeight: 'calc(100vh - 120px)',
                display: 'block',
                backgroundColor: 'white'
              }}
              onLoad={(e) => {
                // Try to access iframe content to debug
                try {
                  const iframe = e.target;
                  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
       
                  // Force white background on iframe content
                  if (iframeDoc && iframeDoc.body) {
                    iframeDoc.body.style.backgroundColor = 'white';
                    iframeDoc.body.style.color = 'black';
                  }
                } catch (err) {
                  console.log('Cannot access iframe content due to CORS:', err);
                }
              }}
            />
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">No Portfolio Generated</h2>
              <p className="text-gray-500">Please go back to the home page and try again.</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center space-x-4 shadow-lg z-10">
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={isGenerating}
        >
          Download Code
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PortfolioPreview; 