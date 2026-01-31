import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaBuilding, FaCheckCircle } from 'react-icons/fa';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await api.post('/applications/apply', {
        job_id: id,
        cover_letter: coverLetter
      });
      setApplied(true);
      setShowApplyModal(false);
      alert('Application submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Job not found</h2>
          <button onClick={() => navigate('/jobs')} className="btn-primary">
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card mb-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 mb-3">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <FaBuilding className="text-primary-600 text-xs" />
                    <span className="font-medium text-gray-900">{job.company}</span>
                  </span>
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-primary-600 text-xs" />
                      {job.location}
                    </span>
                  )}
                  {job.salary && (
                    <span className="flex items-center gap-1">
                      <FaMoneyBillWave className="text-primary-600 text-xs" />
                      {job.salary}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-primary-50 border border-primary-200 text-primary-700 rounded-md text-xs">
                    {job.job_type?.replace('_', ' ')}
                  </span>
                  {job.experience_level && (
                    <span className="px-2 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-md text-xs">
                      {job.experience_level} Level
                    </span>
                  )}
                  {job.category && (
                    <span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-xs">
                      {job.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                {applied ? (
                  <button disabled className="btn-primary flex items-center gap-1 opacity-60 cursor-not-allowed">
                    <FaCheckCircle className="text-xs" /> Applied
                  </button>
                ) : (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="btn-primary"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Applications</p>
                  <p className="text-gray-900 font-semibold text-sm">{job.applications_count || 0}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Views</p>
                  <p className="text-gray-900 font-semibold text-sm">{job.views || 0}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Posted</p>
                  <p className="text-gray-900 font-semibold text-sm">
                    {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                {job.deadline && (
                  <div>
                    <p className="text-gray-600 text-xs mb-0.5">Deadline</p>
                    <p className="text-gray-900 font-semibold text-sm">
                      {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-2">Job Description</h2>
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{job.description}</p>
                </div>

                {job.skills && (
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-2">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.split(',').map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-xs"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-2">About the Company</h2>
                  <p className="text-gray-700 text-sm">Posted by: {job.poster_name}</p>
                  <p className="text-gray-700 text-sm">Contact: {job.poster_email}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-5 max-w-lg w-full"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Apply for {job.title}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="6"
                  className="input-field resize-none text-sm"
                  placeholder="Tell the employer why you're a great fit for this position..."
                />
              </div>
              <p className="text-gray-600 text-xs">
                Your profile information and resume will be submitted with this application.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn-primary flex-1"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
