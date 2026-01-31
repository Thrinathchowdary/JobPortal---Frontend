import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaUsers, FaBriefcase, FaMapMarkerAlt, FaEye, FaSearch, FaUserCheck } from 'react-icons/fa';

const ApplicantsOverview = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/user/my-jobs');
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const overview = useMemo(() => {
    const totalApplicants = jobs.reduce((sum, job) => sum + (job.applications_count || 0), 0);
    const activeJobs = jobs.filter((job) => job.status !== 'closed').length;
    return { totalApplicants, activeJobs };
  }, [jobs]);

  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.toLowerCase();
    const matches = (value) => (value || '').toLowerCase().includes(search);
    return matches(job.title) || matches(job.company) || matches(job.location);
  });

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Applicant radar</p>
            <h1 className="text-2xl font-semibold text-gray-900 mt-1">Applicants</h1>
            <p className="text-sm text-gray-600">Monitor interest across every role and dive into detailed pipelines in seconds.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="card flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Applicants</p>
                <p className="text-2xl font-semibold text-gray-900">{overview.totalApplicants}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                <FaUsers />
              </div>
            </div>
            <div className="card flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Open Roles</p>
                <p className="text-2xl font-semibold text-gray-900">{overview.activeJobs}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <FaBriefcase />
              </div>
            </div>
            <div className="card flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Average Applicants</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {jobs.length ? Math.round(overview.totalApplicants / jobs.length) : 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FaUserCheck />
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by role, company, or location"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <Link to="/post-job" className="btn-primary text-sm whitespace-nowrap">
                Post another role
              </Link>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="card text-center py-12">
              <FaUsers className="text-5xl text-gray-300 mx-auto mb-3" />
              <p className="text-base text-gray-600">No applicants found yet.</p>
              {jobs.length === 0 ? (
                <p className="text-sm text-gray-500 mt-2">Post a role to start receiving candidates.</p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">Try another search term.</p>
              )}
              <Link to="/post-job" className="btn-primary inline-block mt-4">
                Post a job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.job_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      {typeof job.applications_count !== 'undefined' && (
                        <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                          {job.applications_count} applicants
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <FaBriefcase className="text-xs" />
                        {job.company}
                      </span>
                      {job.location && (
                        <span className="inline-flex items-center gap-1">
                          <FaMapMarkerAlt className="text-xs" />
                          {job.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <FaEye className="text-xs" />
                        {job.views || 0} views
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      to={`/applicants/${job.job_id}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700"
                    >
                      <FaUsers className="text-xs" />
                      View pipeline
                    </Link>
                    <Link
                      to={`/jobs/${job.job_id}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-300"
                    >
                      Preview listing
                    </Link>
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

export default ApplicantsOverview;
