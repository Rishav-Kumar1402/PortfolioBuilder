import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const { isDarkMode } = useTheme();

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Portfolios Created', value: '25K+' },
    { label: 'Success Rate', value: '98%' },
    { label: 'Countries', value: '50+' },
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'Founder & CEO',
      bio: 'Passionate about making portfolio creation accessible to everyone.',
      avatar: '👨‍💼',
    },
    {
      name: 'Sarah Chen',
      role: 'Lead Developer',
      bio: 'Full-stack developer with a love for creating beautiful user experiences.',
      avatar: '👩‍💻',
    },
    {
      name: 'Michael Rodriguez',
      role: 'UX Designer',
      bio: 'Dedicated to crafting intuitive and engaging user interfaces.',
      avatar: '👨‍🎨',
    },
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="relative py-10 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-90" />
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              About Portfolio Builder
            </h1>
            <p className="text-base sm:text-xl text-gray-200 max-w-3xl mx-auto">
              We're on a mission to help professionals showcase their skills and achievements
              through beautiful, professional portfolios.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-base text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-10 sm:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Our Mission
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-8">
              We believe that everyone deserves to have a professional online presence.
              Our platform makes it easy for anyone to create a stunning portfolio that
              showcases their skills and achievements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-12">
              <div className="p-4 sm:p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4">
                  Innovation
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  We constantly innovate to provide the best tools and features for our users.
                </p>
              </div>
              <div className="p-4 sm:p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4">
                  Accessibility
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Making professional portfolio creation accessible to everyone.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
              Meet Our Team
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300">
              The passionate people behind Portfolio Builder
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 sm:p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">{member.avatar}</div>
                <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 mb-2 sm:mb-4 text-sm sm:text-base">{member.role}</p>
                <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 