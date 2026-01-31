import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBriefcase, FaFileAlt, FaUsers, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [myChapters, setMyChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user applications
      if (user.role === 'job_seeker' || user.role === 'student') {
        const appsRes = await api.get('/user/applications');
        setApplications(appsRes.data.data);
      }
      
      // Fetch posted jobs for job posters
      if (user.role === 'job_poster' || user.role === 'alumni' || user.role === 'admin') {
        const jobsRes = await api.get('/jobs/user/my-jobs');
        setMyJobs(jobsRes.data.data);
      }
      
      // Fetch chapters
      const chaptersRes = await api.get('/chapters/user/my-chapters');
      setMyChapters(chaptersRes.data.data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Welcome, {user.name}!</h1>
          <p className="text-sm text-gray-600">Here's your overview</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
              </div>
              <FaFileAlt className="text-2xl text-primary-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Jobs Posted</p>
                <p className="text-2xl font-semibold text-gray-900">{myJobs.length}</p>
              </div>
              <FaBriefcase className="text-2xl text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">My Chapters</p>
                <p className="text-2xl font-semibold text-gray-900">{myChapters.length}</p>
              </div>
              <FaUsers className="text-2xl text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Profile Views</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
              <FaChartLine className="text-2xl text-blue-600" />
            </div>
          </motion.div>
        </div>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div key={app.application_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100 hover:border-gray-200 transition-colors">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{app.title}</h3>
                    <p className="text-xs text-gray-600">{app.company} • {app.location}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      app.status === 'accepted' ? 'bg-green-50 text-green-700 border border-green-200' :
                      app.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {app.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* My Posted Jobs */}
        {myJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Posted Jobs</h2>
              <Link to="/post-job" className="btn-primary">
                Post New Job
              </Link>
            </div>
            <div className="space-y-3">
              {myJobs.slice(0, 5).map((job) => (
                <Link key={job.job_id} to={`/jobs/${job.job_id}`}>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100 hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                      <p className="text-xs text-gray-600">{job.company} • {job.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">
                        {job.applications_count} applications
                      </p>
                      <p className="text-xs text-gray-500">
                        {job.views} views
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* My Chapters */}
        {myChapters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Alumni Chapters</h2>
              <Link to="/create-chapter" className="btn-primary">
                Create Chapter
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myChapters.map((chapter) => (
                <Link key={chapter.chapter_id} to={`/chapters/${chapter.chapter_id}`}>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-100 hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{chapter.chapter_name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{chapter.college_name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{chapter.member_count} members</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        chapter.membership_status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                        chapter.membership_status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        {chapter.membership_status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card mt-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link to="/jobs" className="btn-outline w-full">
              Browse Jobs
            </Link>
            <Link to="/chapters" className="btn-outline w-full">
              Explore Chapters
            </Link>
            <Link to="/profile" className="btn-outline w-full">
              Edit Profile
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
