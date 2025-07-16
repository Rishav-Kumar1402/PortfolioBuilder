import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pexelsArtempodrez from '../assets/pexels-artempodrez-5716001.jpg';
import pexelsFauxels from '../assets/pexels-fauxels-3184311.jpg';
import pexelsGoumbik from '../assets/pexels-goumbik-590037.jpg';
import pexelsNVoitkevich from '../assets/pexels-n-voitkevich-7172830.jpg';
import pexelsPixabay from '../assets/pexels-pixabay-416405.jpg';

const HeroCarousel = ({ onGetStarted }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // High-quality professional images for the carousel
  const slides = [
    {
      id: 1,
      image: pexelsArtempodrez,
      alt: 'Modern workspace with laptop and coffee',
      overlay: 'rgba(0, 0, 0, 0.4)'
    },
    {
      id: 2,
      image: pexelsFauxels,
      alt: 'Professional business meeting',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    {
      id: 3,
      image: pexelsGoumbik,
      alt: 'Creative workspace with design tools',
      overlay: 'rgba(0, 0, 0, 0.45)'
    },
    {
      id: 4,
      image: pexelsNVoitkevich,
      alt: 'Team collaboration in modern office',
      overlay: 'rgba(0, 0, 0, 0.4)'
    },
    {
      id: 5,
      image: pexelsPixabay,
      alt: 'Professional developer workspace',
      overlay: 'rgba(0, 0, 0, 0.5)'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Carousel Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
            }}
          />
          
          {/* Overlay */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundColor: slides[currentSlide].overlay,
            }}
          />
          
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-purple-800 px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            Create Your
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Professional Portfolio
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-200 font-light"
          >
            Transform your resume into a stunning portfolio website in minutes
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-full hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 font-semibold backdrop-blur-sm"
          >
            Get Started Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel; 