import { useState, useEffect, useRef } from 'react';
import pexelsArtempodrez from '../assets/pexels-artempodrez-5716001.jpg';
import pexelsFauxels from '../assets/pexels-fauxels-3184311.jpg';
import pexelsGoumbik from '../assets/pexels-goumbik-590037.jpg';
import pexelsNVoitkevich from '../assets/pexels-n-voitkevich-7172830.jpg';
import pexelsPixabay from '../assets/pexels-pixabay-416405.jpg';

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

function preloadImages(imageArray) {
  imageArray.forEach((slide) => {
    const img = new window.Image();
    img.src = slide.image;
  });
}

const HeroCarousel = ({ onGetStarted }) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    preloadImages(slides);
  }, []);

  useEffect(() => {
    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    timeoutRef.current = setTimeout(next, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  const goTo = (idx) => {
    setCurrent(idx);
  };

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      {/* Slides */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            aria-hidden={idx !== current}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
              draggable="false"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: slide.overlay }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
        tabIndex={0}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
        tabIndex={0}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${idx === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Go to slide ${idx + 1}`}
            tabIndex={0}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
        {current + 1} / {slides.length}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-purple-800 px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight transition-all duration-700">
            Create Your
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Professional Portfolio
            </span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-200 font-light transition-all duration-700">
            Transform your resume into a stunning portfolio website in minutes
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-full hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 font-semibold backdrop-blur-sm"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel; 