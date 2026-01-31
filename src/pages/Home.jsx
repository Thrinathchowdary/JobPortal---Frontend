import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBriefcase, FaUsers, FaRocket, FaChartLine, FaHandshake, FaGraduationCap, FaArrowRight, FaStar } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaBriefcase className="text-xl" />,
      title: 'Find Your Dream Job',
      description: 'Browse thousands of job opportunities from top companies worldwide.'
    },
    {
      icon: <FaUsers className="text-xl" />,
      title: 'Alumni Network',
      description: 'Connect with alumni from your college and access exclusive opportunities.'
    },
    {
      icon: <FaHandshake className="text-xl" />,
      title: 'Direct Hiring',
      description: 'Companies can post jobs and connect directly with qualified candidates.'
    },
    {
      icon: <FaGraduationCap className="text-xl" />,
      title: 'College Chapters',
      description: 'Create or join alumni chapters and share opportunities with your community.'
    },
    {
      icon: <FaRocket className="text-xl" />,
      title: 'Career Growth',
      description: 'Access mentorship, internships, and career development resources.'
    },
    {
      icon: <FaChartLine className="text-xl" />,
      title: 'Track Applications',
      description: 'Manage all your job applications in one place with real-time updates.'
    }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Software Engineer', company: 'Tech Corp', text: 'Found my dream job within 2 weeks!' },
    { name: 'Mike Chen', role: 'Product Manager', company: 'Innovate Inc', text: 'The alumni network is incredibly valuable.' },
    { name: 'Emily Davis', role: 'UX Designer', company: 'Design Studio', text: 'Best platform for job seekers and companies.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-32">
        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5 mb-6"
            >
              <FaStar className="text-primary-600 text-xs" />
              <span className="text-xs font-medium text-primary-700">Trusted by 50,000+ professionals</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 leading-tight">
              Connect Your <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Future</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              The ultimate job portal connecting job seekers, employers, and alumni communities. 
              Find opportunities, build networks, and grow your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/jobs" className="btn-primary px-6 py-3 inline-flex items-center space-x-2 group">
                <span>Browse Jobs</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/chapters" className="btn-outline px-6 py-3 inline-flex items-center space-x-2">
                <FaUsers className="text-xs" />
                <span>Explore Chapters</span>
              </Link>
            </div>
          </motion.div>

          {/* Floating Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
          >
            {[
              { value: '50K+', label: 'Active Users', color: 'from-blue-500 to-cyan-500' },
              { value: '10K+', label: 'Job Listings', color: 'from-purple-500 to-pink-500' },
              { value: '500+', label: 'Companies', color: 'from-orange-500 to-red-500' },
              { value: '200+', label: 'Alumni Chapters', color: 'from-green-500 to-emerald-500' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`text-2xl md:text-3xl font-semibold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Wave Effect at Bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-[140%] h-28 text-blue-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.8,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
          </svg>
          <svg
            className="absolute bottom-0 left-0 w-full h-24 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.8,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
              Why Choose <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">JobPortal</span>?
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Everything you need to accelerate your career journey in one platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-blue-100 rounded-bl-full opacity-50"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
              What Our Users Say
            </h2>
            <p className="text-base text-gray-600">
              Join thousands of satisfied professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-blue-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Ready to Start Your Journey?
            </h2>
            <p className="text-base text-white/90 mb-6 max-w-xl mx-auto">
              Join thousands of professionals finding their dream jobs and building meaningful connections
            </p>
            <Link to="/register" className="inline-block bg-white text-primary-600 font-medium px-6 py-2.5 rounded-md hover:bg-gray-50 transition-colors text-sm shadow-lg">
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FaBriefcase className="text-primary-600 text-lg" />
                <span className="text-base font-semibold text-gray-900">JobPortal</span>
              </div>
              <p className="text-sm text-gray-600">
                Connecting talent with opportunity, building the future of work.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">For Job Seekers</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><Link to="/jobs" className="hover:text-gray-900 transition-colors">Browse Jobs</Link></li>
                <li><Link to="/register" className="hover:text-gray-900 transition-colors">Create Profile</Link></li>
                <li><Link to="/chapters" className="hover:text-gray-900 transition-colors">Join Chapters</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">For Employers</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><Link to="/post-job" className="hover:text-gray-900 transition-colors">Post a Job</Link></li>
                <li><Link to="/register" className="hover:text-gray-900 transition-colors">Employer Signup</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-xs text-gray-500">
            <p>&copy; 2025 JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
