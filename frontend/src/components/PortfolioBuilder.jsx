import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeContext } from '../App';

const PortfolioBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portfolioLinks: {
      portfolioWebsite: '',
      linkedin: '',
      github: '',
      leetcode: '',
      hackerrank: ''
    },
    workExperience: [],
    projects: [],
    education: [],
    skills: {
      languages: [],
      tools: []
    },
    certifications: [],
    profileImage: null
  });
  const [isUpdated, setIsUpdated] = useState(false);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [parsingMethod, setParsingMethod] = useState('');
  const [loading, setLoading] = useState(true); // Loader state
  const { theme } = useContext(ThemeContext);

  // Removed parseResumeText and all fallback/manual parsing logic

  const saveToDatabase = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/save-portfolio`, data);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to save portfolio');
      }
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  };

  const fetchFromDatabase = async (email) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/get-portfolio/${email}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch portfolio');
      }
    } catch (error) {
      console.error('Error fetching from database:', error);
      throw error;
    }
  };

  useEffect(() => {
    const processResumeData = async () => {
      setLoading(true);
      if (location.state?.parsedData) {
        try {
          // Use the AI-parsed data directly from frontend
          const parsedData = location.state.parsedData;
          setParsingMethod('ai');
            setFormData(parsedData);
            try {
              await saveToDatabase(parsedData);
            } catch (error) {
              console.error('Error saving to database:', error);
          }
        } catch (error) {
          console.error('Error processing resume data:', error);
          toast.error(error.message || 'Error processing resume data');
        }
      } else if (formData.email && !location.state?.parsedData) {
        try {
          const existingData = await fetchFromDatabase(formData.email);
          if (existingData) {
            setFormData(existingData);
          }
        } catch (error) {
          console.error('Error fetching existing data:', error);
        }
      }
      setLoading(false);
    };
    processResumeData();
  }, [location.state]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsUpdated(false);
  };

  const handlePortfolioLinksChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: {
        ...prev.portfolioLinks,
        [field]: value
      }
    }));
    setIsUpdated(false);
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
    setIsUpdated(false);
  };

  const updateProject = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
    setIsUpdated(false);
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
    setIsUpdated(false);
  };

  const handleSkillsChange = (category, value) => {
    const skills = value.split(',').map(skill => skill.trim());
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: skills
      }
    }));
    setIsUpdated(false);
  };

  const updateCertification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
    setIsUpdated(false);
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: '',
          position: '',
          duration: '',
          description: ''
        }
      ]
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: '',
          degree: '',
          year: '',
          description: ''
        }
      ]
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/save-portfolio`, formData);
      if (response.data.success) {
        toast.success('Portfolio updated successfully!');
        setIsUpdated(true);
        return true;
      } else {
        throw new Error(response.data.error || 'Failed to update portfolio');
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast.error(error.message || 'Error updating portfolio');
      return false;
    }
  };

  const handleGenerate = () => {
    navigate('/preview', { 
      state: { 
        portfolioData: formData
      } 
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setImageError('Only JPG, JPEG, or PNG files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('File size must be less than 5MB.');
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setFormData(prev => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const steps = [
    { id: 1, title: 'Personal Info', icon: '👤', description: 'Basic Information' },
    { id: 2, title: 'Portfolio Links', icon: '🔗', description: 'Social & Professional Links' },
    { id: 3, title: 'Work Experience', icon: '💼', description: 'Professional Experience' },
    { id: 4, title: 'Projects', icon: '🚀', description: 'Your Projects' },
    { id: 5, title: 'Education', icon: '🎓', description: 'Academic Background' },
    { id: 6, title: 'Skills', icon: '⚡', description: 'Technical Skills' },
    { id: 7, title: 'Certifications', icon: '🏆', description: 'Achievements & Certifications' }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl text-white">
                👤
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Personal Information
              </h3>
              <p className="text-gray-600 mt-2">Let's start with your basic details</p>
            </div>
            <div className="flex flex-col items-center mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image (JPG, JPEG, PNG, &lt;5MB)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
                className="mb-2"
              />
              {imageError && <span className="text-red-500 text-xs mb-2">{imageError}</span>}
              {image && (
                <img
                  src={image}
                  alt="Profile Preview"
                  className="w-20 h-20 sm:w-24 sm:h-24 max-w-[96px] max-h-[96px] object-cover rounded-full border-2 border-purple-400 shadow-md bg-gray-100"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="group"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter your full name"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                  placeholder="your.email@example.com"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="group md:col-span-2"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                  placeholder="+91 9898989898"
                />
              </motion.div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-2xl text-white">
                🔗
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Portfolio Links
              </h3>
              <p className="text-gray-600 mt-2">Connect your professional profiles</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'portfolioWebsite', label: 'Portfolio Website', icon: '🌐', placeholder: 'https://your-portfolio.com' },
                { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/yourprofile' },
                { key: 'github', label: 'GitHub', icon: '🐙', placeholder: 'https://github.com/yourusername' },
                { key: 'leetcode', label: 'LeetCode', icon: '💻', placeholder: 'https://leetcode.com/yourprofile' },
                { key: 'hackerrank', label: 'HackerRank', icon: '⚡', placeholder: 'https://hackerrank.com/yourprofile' }
              ].map((link, index) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioLinks[link.key]}
                    onChange={(e) => handlePortfolioLinksChange(link.key, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                    placeholder={link.placeholder}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-2xl text-white">
                💼
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Work Experience
              </h3>
              <p className="text-gray-600 mt-2">Showcase your professional journey</p>
            </div>
            
            <div className="space-y-6">
              {formData.workExperience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                        Position
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white"
                        placeholder="2020 - Present"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white resize-none"
                      placeholder="Describe your role and achievements..."
                    />
                  </div>
                </motion.div>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData(prev => ({
                  ...prev,
                  workExperience: [...prev.workExperience, { company: '', position: '', duration: '', description: '' }]
                }))}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>➕</span>
                <span>Add Work Experience</span>
              </motion.button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl text-white">
                🚀
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Projects
              </h3>
              <p className="text-gray-600 mt-2">Showcase your amazing projects</p>
            </div>
            
            <div className="space-y-6">
              {formData.projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                        Tech Stack
                      </label>
                      <input
                        type="text"
                        value={project.techStack.join(', ')}
                        onChange={(e) => {
                          const newProjects = [...formData.projects];
                          newProjects[index] = { ...project, techStack: e.target.value.split(',').map(tech => tech.trim()) };
                          setFormData(prev => ({ ...prev, projects: newProjects }));
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white"
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                        GitHub Link
                      </label>
                      <input
                        type="url"
                        value={project.github}
                        onChange={(e) => updateProject(index, 'github', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white"
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                        Live Demo
                      </label>
                      <input
                        type="url"
                        value={project.liveDemo}
                        onChange={(e) => updateProject(index, 'liveDemo', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white"
                        placeholder="https://your-project.com"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                      Description
                    </label>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white resize-none"
                      placeholder="Describe your project..."
                    />
                  </div>
                </motion.div>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData(prev => ({
                  ...prev,
                  projects: [...prev.projects, { title: '', techStack: [], description: '', github: '', liveDemo: '' }]
                }))}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>➕</span>
                <span>Add Project</span>
              </motion.button>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-2xl text-white">
                🎓
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Education
              </h3>
              <p className="text-gray-600 mt-2">Your academic achievements</p>
            </div>
            
            <div className="space-y-6">
              {formData.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-yellow-600 transition-colors">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 bg-white"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-yellow-600 transition-colors">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 bg-white"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-yellow-600 transition-colors">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={edu.duration}
                        onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 bg-white"
                        placeholder="2018 - 2022"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-yellow-600 transition-colors">
                        Score/GPA
                      </label>
                      <input
                        type="text"
                        value={edu.score}
                        onChange={(e) => updateEducation(index, 'score', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 bg-white"
                        placeholder="3.8/4.0"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addEducation}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>➕</span>
                <span>Add Education</span>
              </motion.button>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-2xl text-white">
                ⚡
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Skills
              </h3>
              <p className="text-gray-600 mt-2">Your technical expertise</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-4 group-hover:text-indigo-600 transition-colors">
                  <span className="mr-2">💻</span>
                  Programming Languages
                </label>
                <textarea
                  value={formData.skills.languages.join(', ')}
                  onChange={(e) => handleSkillsChange('languages', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white resize-none"
                  placeholder="JavaScript, Python, Java, C++, HTML, CSS..."
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-4 group-hover:text-blue-600 transition-colors">
                  <span className="mr-2">🛠️</span>
                  Tools & Technologies
                </label>
                <textarea
                  value={formData.skills.tools.join(', ')}
                  onChange={(e) => handleSkillsChange('tools', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white resize-none"
                  placeholder="React, Node.js, Git, Docker, AWS, VS Code..."
                />
              </motion.div>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-2xl text-white">
                🏆
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Certifications
              </h3>
              <p className="text-gray-600 mt-2">Your achievements and credentials</p>
            </div>
            
            <div className="space-y-6">
              {formData.certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                        Certification Title
                      </label>
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => updateCertification(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                        Year
                      </label>
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => updateCertification(index, 'year', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white"
                        placeholder="2023"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                        Provider
                      </label>
                      <input
                        type="text"
                        value={cert.provider}
                        onChange={(e) => updateCertification(index, 'provider', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white"
                        placeholder="Coursera, Udemy, AWS..."
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                        Certificate Link
                      </label>
                      <input
                        type="url"
                        value={cert.certificateLink}
                        onChange={(e) => updateCertification(index, 'certificateLink', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white"
                        placeholder="https://certificate-link.com"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    certifications: [...prev.certifications, { title: '', year: '', provider: '', certificateLink: '' }]
                  }));
                  setIsUpdated(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>➕</span>
                <span>Add Certification</span>
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'}`}>
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto p-6 overflow-x-hidden w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Build Your Portfolio
          </h1>
          <p className="text-xl text-gray-600 mb-8">Create a stunning professional portfolio in just a few steps</p>
          {parsingMethod && (
            <div className="mb-4">
              {parsingMethod === 'ai' ? (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 border border-green-300">
                  <span className="text-green-600 mr-2">🤖</span>
                  <span className="text-green-700 font-medium">AI-Powered Resume Parsing</span>
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 border border-yellow-300">
                  <span className="text-yellow-600 mr-2">📄</span>
                  <span className="text-yellow-700 font-medium">Basic Resume Parsing</span>
                </div>
              )}
            </div>
          )}
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex w-full justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  <div className={`flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    step.id === currentStep
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-110'
                      : step.id < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.id < currentStep ? '✓' : step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 transition-all duration-300 ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 7) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Step {currentStep} of {steps.length} • {Math.round((currentStep / 7) * 100)}% Complete
          </div>
        </motion.div>

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
            <svg className="animate-spin h-12 w-12 text-purple-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <p className="text-lg text-purple-700 font-semibold">Loading resume data...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we parse and prepare your information.</p>
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border p-4 sm:p-8 md:p-12 overflow-x-hidden w-full max-w-full ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/60 text-white' : 'border-white/20'}`}
        >
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 w-full"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <span>←</span>
            <span>Previous</span>
          </motion.button>

          {currentStep < 7 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <span>Next</span>
              <span>→</span>
            </motion.button>
          ) : (
            !isUpdated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdate}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>💾</span>
                <span>Save Portfolio</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerate}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>🚀</span>
                <span>Generate Portfolio</span>
              </motion.button>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioBuilder; 