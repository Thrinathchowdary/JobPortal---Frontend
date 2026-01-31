import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaEye, FaUsers, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await api.get('/jobs/user/my-jobs');
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(job => job.job_id !== jobId));
    } catch (error) {
      alert('Failed to delete job posting');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'closed':
        return 'bg-gray-50 border-gray-200 text-gray-700';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">My Job Posts</h1>
              <p className="text-sm text-gray-600">Manage your job postings</p>
            </div>
            <Link to="/post-job" className="btn-primary inline-flex items-center gap-2">
              <FaPlus className="text-xs" />
              Post New Job
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="card text-center py-12">
              <FaBriefcase className="text-5xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-base mb-4">You haven't posted any jobs yet</p>
              <Link to="/post-job" className="btn-primary inline-block">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.job_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/jobs/${job.job_id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {job.title}
                        </Link>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <FaBriefcase className="text-xs" />
                          {job.company}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-xs" />
                            {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <FaMoneyBillWave className="text-xs" />
                            ${job.salary.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaUsers className="text-xs" />
                          {job.applications_count || 0} applicants
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEye className="text-xs" />
                          {job.views || 0} views
                        </span>
                        <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Link
                        to={`/applicants/${job.job_id}`}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                        title="View Applicants"
                      >
                        <FaUsers />
                      </Link>
                      <button
                        onClick={() => navigate(`/edit-job/${job.job_id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Job"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(job.job_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Job"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyJobs;
