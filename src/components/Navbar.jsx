import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBriefcase, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaBriefcase className="text-primary-600 text-lg" />
            <span className="text-base font-semibold text-gray-900">JobPortal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/jobs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Jobs
            </Link>
            <Link to="/chapters" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Alumni Chapters
            </Link>
            <Link to="/career-tools" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Career Assist
            </Link>
            {(user?.role === 'job_seeker' || user?.role === 'student') && (
              <Link to="/applications" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                My Applications
              </Link>
            )}
            {(user?.role === 'job_poster' || user?.role === 'alumni' || user?.role === 'admin') && (
              <Link to="/applicants" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Applicants
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                
                {(user?.role === 'job_poster' || user?.role === 'alumni' || user?.role === 'admin') && (
                  <Link to="/post-job" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Post Job
                  </Link>
                )}
                
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Admin
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <FaUserCircle className="text-lg" />
                    <span>{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-3 space-y-1">
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
              >
                Jobs
              </Link>
              <Link
                to="/chapters"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
              >
                Alumni Chapters
              </Link>
              <Link
                to="/career-tools"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors py-2"
              >
                Career Assist
              </Link>
              {(user?.role === 'job_seeker' || user?.role === 'student') && (
                <Link
                  to="/applications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                >
                  My Applications
                </Link>
              )}
              {(user?.role === 'job_poster' || user?.role === 'alumni' || user?.role === 'admin') && (
                <Link
                  to="/applicants"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                >
                  Applicants
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                  >
                    My Profile
                  </Link>
                  
                  {(user?.role === 'job_poster' || user?.role === 'alumni' || user?.role === 'admin') && (
                    <Link
                      to="/post-job"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                    >
                      Post Job
                    </Link>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block btn-primary w-full text-center mt-2"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
