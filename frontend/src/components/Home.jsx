import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ThemeContext } from '../App';
import { motion } from 'framer-motion';
import HeroCarousel from './HeroCarousel';
import toast, { Toaster } from 'react-hot-toast';

const WEB3FORMS_ACCESS_KEY = "e7f58569-0e80-4394-ad04-52b53e41b97f";

const Home = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    botcheck: '',
  });
  const [loading, setLoading] = useState(false);

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data for Web3Forms
    const data = {
      access_key: WEB3FORMS_ACCESS_KEY,
      name: contactForm.name,
      email: contactForm.email,
      subject: contactForm.subject,
      message: contactForm.message,
      botcheck: contactForm.botcheck,
    };

    try {
      // Option 1: Direct to Web3Forms (no backend needed)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Form submitted successfully!");
        setContactForm({ name: '', email: '', subject: '', message: '', botcheck: '' });
      } else {
        toast.error(result.message || "Submission failed.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    navigate('/upload');
  };

  return (
    <div className={`w-full min-h-screen overflow-x-hidden ${theme === 'dark' ? 'text-white bg-gray-900' : 'text-gray-900 bg-white'}`}>
      <Toaster position="top-center" />
      {/* Hero Section with Carousel */}
      <section className="relative max-w-screen overflow-x-hidden">
        <HeroCarousel onGetStarted={handleGetStarted} />
      </section>

      {/* About Section */}
      <section id="about" className={`py-12 sm:py-16 md:py-20 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50'} max-w-screen overflow-x-hidden`}>
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-screen overflow-x-hidden">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-gradient">
            About Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className={`relative p-4 sm:p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl transform group-hover:scale-[1.02] transition duration-300 hover:bg-gradient-to-br hover:from-purple-600/20 hover:to-blue-500/20`}>
                <h3 className={`text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Why Choose Us?
                </h3>
                <ul className={`space-y-2 sm:space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex items-center text-sm sm:text-base">
                    <span className="text-purple-500 mr-2">✓</span>
                    AI-Powered Resume Parsing
                  </li>
                  <li className="flex items-center text-sm sm:text-base">
                    <span className="text-purple-500 mr-2">✓</span>
                    Professional Templates
                  </li>
                  <li className="flex items-center text-sm sm:text-base">
                    <span className="text-purple-500 mr-2">✓</span>
                    Customizable Designs
                  </li>
                  <li className="flex items-center text-sm sm:text-base">
                    <span className="text-purple-500 mr-2">✓</span>
                    One-Click Deployment
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 sm:space-y-6"
            >
              <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Our platform leverages cutting-edge AI technology to transform your resume into a stunning portfolio website. We understand the importance of making a strong first impression in today's competitive job market.
              </p>
              <p className={`text-base sm:text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                With our intuitive interface and smart features, you can create a professional online presence that showcases your skills and experience effectively.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/upload')}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-lg transform transition-all duration-300 text-base sm:text-lg"
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 max-w-screen overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-screen overflow-x-hidden">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Easy Upload',
                description: 'Simply upload your PDF resume and let our AI do the rest',
                icon: '📄'
              },
              {
                title: 'Smart Parsing',
                description: 'Advanced AI technology to extract and organize your information',
                icon: '🤖'
              },
              {
                title: 'Custom Themes',
                description: 'Choose from a variety of professional themes and colors',
                icon: '🎨'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6 }}
                className={`p-4 sm:p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} hover:bg-gradient-to-br hover:from-purple-600/20 hover:to-blue-500/20 transition-all duration-300`}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">{feature.icon}</div>
                <h3 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className={`py-12 sm:py-16 md:py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} max-w-screen overflow-x-hidden`}>
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-screen overflow-x-hidden">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: 'John Doe',
                role: 'Software Engineer',
                content: 'The best portfolio builder I\'ve ever used. Simple and effective.'
              },
              {
                name: 'Jane Smith',
                role: 'UX Designer',
                content: 'Created my portfolio in minutes. Absolutely love it!'
              },
              {
                name: 'Mike Johnson',
                role: 'Product Manager',
                content: 'Professional looking portfolio with minimal effort. Highly recommended!'
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className={`p-4 sm:p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} hover:bg-gradient-to-br hover:from-purple-600/20 hover:to-blue-500/20 transition-all duration-300`}
              >
                <p className={`mb-4 sm:mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>"{review.content}"</p>
                <div>
                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{review.name}</h4>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{review.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-12 sm:py-16 md:py-20 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50'} max-w-screen overflow-x-hidden`}>
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-screen overflow-x-hidden">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-gradient">
            Get In Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className={`text-lg sm:text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Let's Build Something Amazing Together</h3>
              <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Ready to create your professional portfolio? Get in touch with us and let's discuss how we can help you showcase your skills and experience.</p>
              <div className="space-y-2 sm:space-y-4">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-500">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>rishavkumar1402@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-500">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>+91 8969336822</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className={`relative p-4 sm:p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
                <form className="space-y-4 sm:space-y-6" onSubmit={handleContactSubmit}>
                  <Toaster position="top-center" />
                  <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
                  <input type="checkbox" name="botcheck" value={contactForm.botcheck} onChange={handleContactChange} className="hidden" style={{ display: 'none' }} />
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-sm sm:text-base`}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-sm sm:text-base`}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-sm sm:text-base`}
                    />
                  </div>
                  <div>
                    <textarea
                      rows="4"
                      name="message"
                      placeholder="Your Message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      required
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-sm sm:text-base`}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 sm:py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} max-w-screen overflow-x-hidden`}>
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-screen overflow-x-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Portfolio Builder
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>
                Create your professional portfolio website in minutes.
              </p>
            </div>
            <div className="space-y-2 sm:space-y-4">
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base sm:text-lg`}>Quick Links</h4>
              <ul className={`space-y-1 sm:space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>
                <li><a href="#" className="hover:text-purple-500 transition-colors duration-300">Home</a></li>
                <li><a href="#about" className="hover:text-purple-500 transition-colors duration-300">About</a></li>
                <li><a href="#features" className="hover:text-purple-500 transition-colors duration-300">Features</a></li>
                <li><a href="#contact" className="hover:text-purple-500 transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-2 sm:space-y-4">
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base sm:text-lg`}>Resources</h4>
              <ul className={`space-y-1 sm:space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>
                <li><a href="#" className="hover:text-purple-500 transition-colors duration-300">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-500 transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="hover:text-purple-500 transition-colors duration-300">Support</a></li>
                <li><a href="#" className="hover:text-purple-500 transition-colors duration-300">FAQ</a></li>
              </ul>
            </div>
            <div className="space-y-2 sm:space-y-4">
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base sm:text-lg`}>Legal</h4>
              <ul className={`space-y-1 sm:space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>
                <li><a href="#" className="hover:text-purple-500 transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-500 transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-500 transition-colors duration-300">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 text-center">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>
              © {new Date().getFullYear()} Portfolio Builder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;