import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaUsers, FaBriefcase, FaGraduationCap, FaFileAlt, FaChartBar, FaCheckCircle, FaBan, FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, jobsRes, chaptersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users?limit=50'),
        api.get('/admin/jobs?limit=50'),
        api.get('/admin/chapters')
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setJobs(jobsRes.data.data);
      setChapters(chaptersRes.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, status) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status });
      alert(`User ${status} successfully`);
      fetchDashboardData();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      alert('User deleted successfully');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleJobStatusChange = async (jobId, status) => {
    try {
      await api.put(`/admin/jobs/${jobId}/status`, { status });
      alert(`Job ${status} successfully`);
      fetchDashboardData();
    } catch (error) {
      alert('Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      alert('Job deleted successfully');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to delete job');
    }
  };

  const handleChapterStatusChange = async (chapterId, status) => {
    try {
      await api.put(`/admin/chapters/${chapterId}/status`, { status });
      alert(`Chapter ${status} successfully`);
      fetchDashboardData();
    } catch (error) {
      alert('Failed to update chapter status');
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs mb-0.5">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {stats.activeUsers} active, {stats.suspendedUsers} suspended
                    </p>
                  </div>
                  <FaUsers className="text-3xl text-primary-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs mb-0.5">Total Jobs</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</p>
                  </div>
                  <FaBriefcase className="text-3xl text-green-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs mb-0.5">Total Chapters</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalChapters}</p>
                  </div>
                  <FaGraduationCap className="text-3xl text-purple-600" />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs mb-0.5">Total Applications</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
                  </div>
                  <FaFileAlt className="text-3xl text-blue-600" />
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="card mb-4">
            <div className="flex gap-2 border-b border-gray-200 pb-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-md transition-colors text-sm ${
                  activeTab === 'overview'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-1.5 rounded-md transition-colors text-sm ${
                  activeTab === 'users'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-3 py-1.5 rounded-md transition-colors text-sm ${
                  activeTab === 'jobs'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Jobs ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-3 py-1.5 rounded-md transition-colors text-sm ${
                  activeTab === 'chapters'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Chapters ({chapters.length})
              </button>
            </div>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Manage Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-gray-700 font-medium text-xs">Name</th>
                      <th className="text-left py-2 px-3 text-gray-700 font-medium text-xs">Email</th>
                      <th className="text-left py-2 px-3 text-gray-700 font-medium text-xs">Role</th>
                      <th className="text-left py-2 px-3 text-gray-700 font-medium text-xs">Status</th>
                      <th className="text-left py-2 px-3 text-gray-700 font-medium text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.user_id} className="border-b border-gray-200">
                        <td className="py-2 px-3 text-gray-900 text-xs">{user.name}</td>
                        <td className="py-2 px-3 text-gray-600 text-xs">{user.email}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 bg-primary-50 border border-primary-200 text-primary-700 rounded text-xs">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            user.status === 'active' ? 'bg-green-50 border border-green-200 text-green-700' :
                            user.status === 'suspended' ? 'bg-red-50 border border-red-200 text-red-700' :
                            'bg-yellow-50 border border-yellow-200 text-yellow-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex gap-2">
                            {user.status === 'active' ? (
                              <button
                                onClick={() => handleUserStatusChange(user.user_id, 'suspended')}
                                className="text-red-600 hover:text-red-700 text-xs"
                                title="Suspend"
                              >
                                <FaBan />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserStatusChange(user.user_id, 'active')}
                                className="text-green-600 hover:text-green-700 text-xs"
                                title="Activate"
                              >
                                <FaCheckCircle />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.user_id)}
                              className="text-red-600 hover:text-red-700 text-xs"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Manage Jobs</h2>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.job_id} className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600 text-xs mb-1">{job.company} • {job.location}</p>
                        <p className="text-gray-500 text-xs">Posted by: {job.poster_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          job.status === 'active' ? 'bg-green-50 border border-green-200 text-green-700' :
                          job.status === 'closed' ? 'bg-gray-300 text-gray-600' :
                          'bg-yellow-50 border border-yellow-200 text-yellow-700'
                        }`}>
                          {job.status}
                        </span>
                        <div className="flex gap-1">
                          {job.status !== 'active' && (
                            <button
                              onClick={() => handleJobStatusChange(job.job_id, 'active')}
                              className="text-green-600 hover:text-green-700 text-xs"
                              title="Approve"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                          {job.status !== 'rejected' && (
                            <button
                              onClick={() => handleJobStatusChange(job.job_id, 'rejected')}
                              className="text-red-600 hover:text-red-700 text-xs"
                              title="Reject"
                            >
                              <FaBan />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteJob(job.job_id)}
                            className="text-red-600 hover:text-red-700 text-xs"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chapters Tab */}
          {activeTab === 'chapters' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Manage Chapters</h2>
              <div className="space-y-3">
                {chapters.map((chapter) => (
                  <div key={chapter.chapter_id} className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{chapter.chapter_name}</h3>
                        <p className="text-gray-600 text-xs mb-1">{chapter.college_name}</p>
                        <p className="text-gray-500 text-xs">
                          Created by: {chapter.creator_name} • {chapter.member_count} members
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          chapter.status === 'active' ? 'bg-green-50 border border-green-200 text-green-700' :
                          chapter.status === 'blocked' ? 'bg-red-50 border border-red-200 text-red-700' :
                          'bg-yellow-50 border border-yellow-200 text-yellow-700'
                        }`}>
                          {chapter.status}
                        </span>
                        <div className="flex gap-1">
                          {chapter.status !== 'active' && (
                            <button
                              onClick={() => handleChapterStatusChange(chapter.chapter_id, 'active')}
                              className="text-green-600 hover:text-green-700 text-xs"
                              title="Activate"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                          {chapter.status !== 'blocked' && (
                            <button
                              onClick={() => handleChapterStatusChange(chapter.chapter_id, 'blocked')}
                              className="text-red-600 hover:text-red-700 text-xs"
                              title="Block"
                            >
                              <FaBan />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <FaChartBar className="text-primary-600 text-sm" />
                    Recent Activity
                  </h3>
                  <div className="space-y-1 text-gray-700 text-xs">
                    <p>• {users.filter(u => u.status === 'active').length} active users</p>
                    <p>• {jobs.filter(j => j.status === 'active').length} active jobs</p>
                    <p>• {chapters.filter(c => c.status === 'active').length} active chapters</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Quick Stats</h3>
                  <div className="space-y-1 text-gray-700 text-xs">
                    <p>• Total platform users: {stats?.totalUsers}</p>
                    <p>• Total job postings: {stats?.totalJobs}</p>
                    <p>• Total applications: {stats?.totalApplications}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
