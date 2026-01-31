import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaUser, FaEnvelope, FaPhone, FaFileAlt, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

const Applicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const [applicantsRes, jobRes] = await Promise.all([
        api.get(`/applications/job/${jobId}`),
        api.get(`/jobs/${jobId}`)
      ]);
      setApplicants(applicantsRes.data.data || []);
      setJob(jobRes.data.data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      setApplicants(applicants.map(app =>
        app.application_id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      alert('Failed to update application status');
    }
  };

  const filteredApplicants = applicants.filter(app =>
    filter === 'all' || app.status === filter
  );

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
          <Link
            to="/my-jobs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4 text-sm"
          >
            <FaArrowLeft className="text-xs" />
            Back to My Jobs
          </Link>

          <div className="card mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{job?.title}</h1>
            <p className="text-sm text-gray-600 mb-4">{job?.company}</p>
            <div className="flex gap-4 text-sm">
              <span className="text-gray-600">Total Applicants: <strong className="text-gray-900">{applicants.length}</strong></span>
              <span className="text-gray-600">Pending: <strong className="text-yellow-700">{applicants.filter(a => a.status === 'pending').length}</strong></span>
              <span className="text-gray-600">Accepted: <strong className="text-green-700">{applicants.filter(a => a.status === 'accepted').length}</strong></span>
              <span className="text-gray-600">Rejected: <strong className="text-red-700">{applicants.filter(a => a.status === 'rejected').length}</strong></span>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-4">
            <div className="flex gap-2">
              {['all', 'pending', 'accepted', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Applicants List */}
          {filteredApplicants.length === 0 ? (
            <div className="card text-center py-12">
              <FaUser className="text-5xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-base">No applicants found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplicants.map((applicant, index) => (
                <motion.div
                  key={applicant.application_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{applicant.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <FaEnvelope className="text-xs" />
                            {applicant.email}
                          </span>
                          {applicant.phone && (
                            <span className="flex items-center gap-1">
                              <FaPhone className="text-xs" />
                              {applicant.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      Applied {new Date(applicant.applied_at).toLocaleDateString()}
                    </span>
                  </div>

                  {applicant.cover_letter && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter:</p>
                      <p className="text-sm text-gray-600">{applicant.cover_letter}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {applicant.resume && (
                        <a
                          href={`http://localhost:5000${applicant.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                        >
                          <FaFileAlt />
                          View Resume
                        </a>
                      )}
                      {applicant.linkedin_url && (
                        <a
                          href={applicant.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FaLinkedin />
                        </a>
                      )}
                      {applicant.github_url && (
                        <a
                          href={applicant.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-gray-900"
                        >
                          <FaGithub />
                        </a>
                      )}
                      {applicant.portfolio_url && (
                        <a
                          href={applicant.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <FaGlobe />
                        </a>
                      )}
                    </div>

                    {applicant.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(applicant.application_id, 'accepted')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <FaCheckCircle />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(applicant.application_id, 'rejected')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          <FaTimesCircle />
                          Reject
                        </button>
                      </div>
                    )}
                    {applicant.status === 'accepted' && (
                      <span className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                        Accepted
                      </span>
                    )}
                    {applicant.status === 'rejected' && (
                      <span className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                        Rejected
                      </span>
                    )}
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

export default Applicants;
