import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaSearch, FaUsers, FaGraduationCap, FaPlus } from 'react-icons/fa';

const Chapters = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchChapters();
  }, [search]);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      const response = await api.get(`/chapters?${params}`);
      setChapters(response.data.data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Alumni Chapters</h1>
              <p className="text-sm text-gray-600">Connect with your college community</p>
            </div>
            <Link to="/create-chapter" className="btn-primary mt-4 md:mt-0">
              <FaPlus className="inline mr-1 text-xs" />
              Create Chapter
            </Link>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-4"
        >
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by chapter name or college..."
              className="input-field pl-9 text-sm"
            />
          </div>
        </motion.div>

        {/* Chapters Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : chapters.length === 0 ? (
          <div className="card text-center py-12">
            <FaUsers className="text-5xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-base">No chapters found. Be the first to create one!</p>
            <Link to="/create-chapter" className="btn-primary inline-block mt-3">
              Create Chapter
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.chapter_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/chapters/${chapter.chapter_id}`}>
                  <div className="card hover:border-primary-300 transition-all duration-300 h-full group">
                    {chapter.logo && (
                      <div className="mb-3 h-28 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={`http://localhost:5000${chapter.logo}`}
                          alt={chapter.chapter_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex items-start gap-2 mb-2">
                      <FaGraduationCap className="text-primary-600 text-lg mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-0.5">
                          {chapter.chapter_name}
                        </h3>
                        <p className="text-gray-600 text-xs">{chapter.college_name}</p>
                      </div>
                    </div>
                    
                    {chapter.department && (
                      <p className="text-gray-600 text-xs mb-1">
                        Department: {chapter.department}
                      </p>
                    )}
                    
                    {chapter.batch && (
                      <p className="text-gray-600 text-xs mb-2">
                        Batch: {chapter.batch}
                      </p>
                    )}
                    
                    {chapter.description && (
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                        {chapter.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="flex items-center gap-1 text-gray-600 text-xs">
                        <FaUsers className="text-primary-600 text-xs" />
                        {chapter.member_count} members
                      </span>
                      <span className="btn-primary text-xs px-3 py-1.5">
                        View Chapter
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chapters;
