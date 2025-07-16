import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Reviews = () => {
  const { isDarkMode } = useTheme();

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      company: 'Tech Solutions Inc.',
      rating: 5,
      content: 'This portfolio builder helped me land my dream job! The AI parsing feature saved me hours of work, and the templates are beautiful.',
      avatar: '👩',
      date: '2 weeks ago',
    },
    {
      name: 'Michael Chen',
      role: 'Full Stack Developer',
      company: 'Innovate Labs',
      rating: 5,
      content: 'The templates are beautiful and the customization options are endless. I love how easy it is to create a professional portfolio.',
      avatar: '👨',
      date: '1 month ago',
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'Design Studio',
      rating: 5,
      content: 'I love how easy it is to create a professional portfolio. The dark mode is a great addition, and the export options are perfect.',
      avatar: '👩',
      date: '3 weeks ago',
    },
    {
      name: 'David Kim',
      role: 'Backend Developer',
      company: 'Data Systems',
      rating: 5,
      content: 'The AI parsing feature is incredible. It accurately extracted all my information and organized it perfectly.',
      avatar: '👨',
      date: '2 months ago',
    },
    {
      name: 'Lisa Wang',
      role: 'Product Manager',
      company: 'Product Co.',
      rating: 5,
      content: 'As a product manager, I appreciate the attention to detail and user experience. This tool is exactly what I needed.',
      avatar: '👩',
      date: '1 week ago',
    },
    {
      name: 'James Wilson',
      role: 'DevOps Engineer',
      company: 'Cloud Solutions',
      rating: 5,
      content: 'The deployment options are fantastic. I was able to get my portfolio online in minutes.',
      avatar: '👨',
      date: '3 months ago',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${
            index < rating
              ? 'text-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              What Our Users Say
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Join thousands of satisfied users who have built their portfolios with us
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {testimonial.content}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.date}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Join Our Happy Users
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Create your professional portfolio today and join thousands of satisfied users
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Reviews; 