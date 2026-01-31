import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    job_type: '',
    experience_level: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await api.get(`/jobs?${params}`);
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Find Your Dream Job</h1>
          <p className="text-sm text-gray-600">Browse through thousands of opportunities</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Job title, skills, or company"
                    className="input-field pl-9"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Location"
                    className="input-field pl-9"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                Search Jobs
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                name="job_type"
                value={filters.job_type}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Job Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>

              <select
                name="experience_level"
                value={filters.experience_level}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Experience Levels</option>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
              </select>

              <button
                type="button"
                onClick={() => setFilters({ search: '', location: '', job_type: '', experience_level: '' })}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </motion.div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-sm text-gray-600">No jobs found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, index) => (
              <motion.div
                key={job.job_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/jobs/${job.job_id}`}>
                  <div className="card hover:shadow-md hover:border-primary-300 transition-all duration-200 group">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <FaBriefcase className="text-primary-600" />
                            {job.company}
                          </span>
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-primary-600" />
                              {job.location}
                            </span>
                          )}
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <FaMoneyBillWave className="text-primary-600" />
                              {job.salary}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-md text-xs font-medium">
                            {job.job_type?.replace('_', ' ')}
                          </span>
                          {job.experience_level && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-medium">
                              {job.experience_level} Level
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 text-right">
                        <p className="text-xs text-gray-500 flex items-center gap-1 justify-end mb-2">
                          <FaClock />
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                        <span className="btn-primary inline-block">View Details</span>
                      </div>
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

export default Jobs;
