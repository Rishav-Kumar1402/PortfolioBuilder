import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ResumeUpload from './components/ResumeUpload';
import Home from './components/Home';
import PortfolioBuilder from './components/PortfolioBuilder';
import PortfolioPreview from './components/PortfolioPreview';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

// Theme context
import { createContext } from 'react';
export const ThemeContext = createContext(null);

// Placeholder component - we'll create this next
const Preview = () => <div>Preview Page</div>;

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [formData, setFormData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: []
  });
  const [isBuilderPage, setIsBuilderPage] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMobileMenu) return;
    function handleClick(e) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMobileMenu]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
    setIsBuilderPage(window.location.pathname === '/builder');
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleNavigation = (e) => {
    if (isBuilderPage) {
      e.preventDefault();
      window.location.href = '/';
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <LocationWrapper>
          {(location) => (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-rose-100 via-purple-100 to-indigo-100'}`}>
          <nav className={`fixed w-full z-50 backdrop-blur-lg bg-opacity-80 ${theme === 'dark' ? 'bg-gray-900/80 text-white' : 'bg-white/80 text-gray-900'} shadow-lg border-b ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent hover:from-purple-500 hover:to-blue-400 transition-all duration-300">
                    Portfolio Builder
                  </span>
                </Link>

                {/* Always visible theme toggle */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-300' : 'bg-gray-200 text-gray-800'} hover:bg-opacity-80 transition-colors duration-200`}
                  >
                    {theme === 'dark' ? '🌙' : '☀️'}
                  </button>

                  {/* Desktop navigation */}
                  <div className="hidden md:flex items-center space-x-8">
                    {isAuthenticated && (
                      <>
                        <a href="#about" onClick={handleNavigation} className={`nav-link relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                          About
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </a>
                        <a href="#features" onClick={handleNavigation} className={`nav-link relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                          Features
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </a>
                        <a href="#reviews" onClick={handleNavigation} className={`nav-link relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                          Reviews
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </a>
                        <a href="#contact" onClick={handleNavigation} className={`nav-link relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                          Contact
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </a>
                        <button
                          onClick={handleLogout}
                          className={`nav-link relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                          Logout
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Mobile menu button */}
                  {!(location.pathname === '/login' || location.pathname === '/signup') && (
                    <div className="md:hidden">
                      <button 
                        className="p-2" 
                        onClick={() => setShowMobileMenu((v) => !v)} 
                        aria-label="Open menu"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mobile menu code (unchanged) */}
            <div
              className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${showMobileMenu ? 'visible opacity-100' : 'invisible opacity-0'}`}
              style={{ pointerEvents: showMobileMenu ? 'auto' : 'none' }}
            >
              {/* Drawer with Home page gradient background */}
              <div
                ref={mobileMenuRef}
                className={`absolute right-0 top-0 h-full w-64 max-w-full shadow-2xl flex flex-col py-8 px-6 transition-transform duration-300 ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'} rounded-l-2xl bg-transparent`}
              >
                {/* Close button */}
                <button
                  className={`absolute top-4 right-4 p-2 rounded-full transition-colors
                    ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => setShowMobileMenu(false)}
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* Animated Links */}
                <div className="flex flex-col space-y-3 mt-8">
                  {[
                    { label: 'About', href: '#about' },
                    { label: 'Features', href: '#features' },
                    { label: 'Reviews', href: '#reviews' },
                    { label: 'Contact', href: '#contact' },
                  ].map((item, idx) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={e => { handleNavigation(e); setShowMobileMenu(false); }}
                      className={`block px-4 py-3 rounded-lg text-lg font-medium w-full text-left shadow-sm transition-all duration-300
                        ${theme === 'dark'
                          ? 'bg-gray-900 text-gray-100 hover:bg-gray-800 hover:text-white'
                          : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-600'}
                    `}
                    style={{
                      opacity: showMobileMenu ? 1 : 0,
                      transform: showMobileMenu ? 'translateX(0)' : 'translateX(40px)',
                      transitionDelay: showMobileMenu ? `${0.1 + idx * 0.07}s` : '0s',
                    }}
                    >
                      {item.label}
                    </a>
                  ))}
                  {isAuthenticated && (
                    <button
                      onClick={e => { handleLogout(); setShowMobileMenu(false); }}
                      className={`block px-4 py-3 rounded-lg text-lg font-medium w-full text-left shadow-sm transition-all duration-300
                        ${theme === 'dark'
                          ? 'bg-gray-900 text-gray-100 hover:bg-gray-800 hover:text-white'
                          : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-600'}
                    `}
                    style={{
                      opacity: showMobileMenu ? 1 : 0,
                      transform: showMobileMenu ? 'translateX(0)' : 'translateX(40px)',
                      transitionDelay: showMobileMenu ? `${0.38}s` : '0s',
                    }}
                    >
                      Logout
                    </button>
                  )}
                  {/* <div className="w-4/5 border-t border-gray-200 dark:border-gray-700 my-2 mx-auto"></div> */}
                  {/* <button
                    onClick={() => { toggleTheme(); setShowMobileMenu(false); }}
                    className={`flex items-center justify-start w-full px-4 py-3 rounded-lg text-lg font-medium shadow-sm transition-colors
                      ${theme === 'dark'
                        ? 'bg-gray-900 text-gray-100 hover:bg-gray-800 hover:text-white'
                        : 'bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-600'}
                  `}
                  style={{
                    opacity: showMobileMenu ? 1 : 0,
                    transform: showMobileMenu ? 'translateX(0)' : 'translateX(40px)',
                    transitionDelay: showMobileMenu ? `${isAuthenticated ? 0.45 : 0.38}s` : '0s',
                  }}
                  >
                    {theme === 'dark' ? (
                      <>
                        <span className="mr-2">🌞</span> Light Mode
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🌙</span> Dark Mode
                      </>
                    )}
                  </button> */}
                </div>
              </div>
            </div>
          </nav>

        <main className="w-full">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/upload" element={isAuthenticated ? <ResumeUpload /> : <Navigate to="/login" />} />
            <Route path="/builder" element={isAuthenticated ? <PortfolioBuilder /> : <Navigate to="/login" />} />
            <Route path="/preview" element={isAuthenticated ? <PortfolioPreview /> : <Navigate to="/login" />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
        )}
      </LocationWrapper>
      </Router>
    </ThemeContext.Provider>
  );
}

// Helper component to provide location to children
function LocationWrapper({ children }) {
  const location = useLocation();
  return children(location);
}

export default App;
