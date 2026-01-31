import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaClock, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUndoAlt, FaExclamationTriangle } from 'react-icons/fa';

const withdrawableStatuses = new Set(['pending', 'reviewed', 'shortlisted']);
const statusFilters = ['all', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [confirmApplication, setConfirmApplication] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const showToast = (variant, message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ variant, message });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const fetchApplications = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setApiUnavailable(false);
    try {
      const response = await api.get('/applications');
      setApplications(response.data.data || []);
      setApiMessage('');
    } catch (error) {
      console.error('Error fetching applications:', error);
      const isServerOffline = error.code === 'ERR_NETWORK' || error.response?.data?.message === 'Route not found';
      const msg = isServerOffline
        ? 'API server is unavailable. Please start the backend.'
        : (error.response?.data?.message || 'Failed to load applications');
      setApiUnavailable(isServerOffline);
      setApiMessage(msg);
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'shortlisted':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'reviewed':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <FaCheckCircle className="text-green-600" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-600" />;
      case 'shortlisted':
        return <FaCheckCircle className="text-blue-600" />;
      case 'reviewed':
        return <FaHourglassHalf className="text-purple-600" />;
      default:
        return <FaHourglassHalf className="text-yellow-600" />;
    }
  };

  const handleWithdraw = async (applicationId) => {
    setWithdrawingId(applicationId);

    try {
      await api.delete(`/applications/${applicationId}`);
      setApplications((prev) => prev.filter((app) => app.application_id !== applicationId));
      showToast('success', 'Application withdrawn successfully.');
      setConfirmApplication(null); // Close modal on success
    } catch (error) {
      console.error('Error withdrawing application:', error);
      const isServerOffline = error.code === 'ERR_NETWORK' || error.response?.data?.message === 'Route not found';
      let message;
      
      if (isServerOffline) {
        message = 'API server is unavailable. Please start the backend.';
        setApiUnavailable(true);
        setApiMessage(message);
      } else if (error.response?.status === 404) {
        message = 'Application not found. It may have already been withdrawn.';
        setConfirmApplication(null); // Close modal if application doesn't exist
        // Refresh applications list
        fetchApplications(false);
      } else {
        message = error.response?.data?.message || 'Failed to withdraw application';
      }
      
      showToast('error', message);
    } finally {
      setWithdrawingId(null);
    }
  };

  const openWithdrawModal = (application) => {
    setConfirmApplication(application);
  };

  const closeWithdrawModal = () => {
    if (withdrawingId) return; // avoid closing while request active
    setConfirmApplication(null);
  };

  const confirmWithdraw = () => {
    if (!confirmApplication) return;
    handleWithdraw(confirmApplication.application_id);
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-medium">Fetching your applications…</p>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="card animate-pulse">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-3">
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-28"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">My Applications</h1>
            <p className="text-sm text-gray-600">Track your job applications</p>
          </div>

          {/* Filters */}
          <div className="card mb-4">
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map(status => (
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

          {apiUnavailable && (
            <div className="card border border-amber-200 bg-amber-50 text-amber-900 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-xl text-amber-500 mt-0.5" />
                <div>
                  <p className="font-semibold">Backend unavailable</p>
                  <p className="text-sm text-amber-800">{apiMessage || 'Please start the backend server to continue managing applications.'}</p>
                </div>
              </div>
              <button
                onClick={() => fetchApplications(true)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-amber-900 bg-white border border-amber-200 rounded-lg hover:bg-amber-100"
              >
                Retry
              </button>
            </div>
          )}

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="card text-center py-12">
              <FaBriefcase className="text-5xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-base">No applications found</p>
              <Link to="/jobs" className="btn-primary inline-block mt-4">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((app, index) => (
                <motion.div
                  key={app.application_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/jobs/${app.job_id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600 mb-2 block"
                      >
                        {app.job_title}
                      </Link>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <FaBuilding className="text-xs" />
                          {app.company_name}
                        </span>
                        {app.location && (
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-xs" />
                            {app.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FaClock className="text-xs" />
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                      {app.cover_letter && (
                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                          {app.cover_letter}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      {withdrawableStatuses.has(app.status) && !apiUnavailable && (
                        <button
                          onClick={() => openWithdrawModal(app)}
                          disabled={withdrawingId === app.application_id}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50/80 hover:bg-red-100 px-3 py-1.5 rounded-full disabled:opacity-60"
                          title="Withdraw application"
                        >
                          <FaUndoAlt className="text-[0.65rem]" />
                          {withdrawingId === app.application_id ? 'Withdrawing…' : 'Withdraw'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

        {confirmApplication && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-primary-600">Confirm withdraw</p>
                <h2 className="text-lg font-semibold text-gray-900">Remove this application?</h2>
                <p className="text-sm text-gray-600">This will permanently delete your application for <span className="font-medium text-gray-800">{confirmApplication.job_title}</span> at <span className="font-medium text-gray-800">{confirmApplication.company_name}</span>. You can apply again later if the job is still open.</p>
              </div>
              <div className="rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                Applied on {new Date(confirmApplication.applied_at).toLocaleDateString()} · Status {confirmApplication.status}
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeWithdrawModal}
                  className="inline-flex justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  disabled={Boolean(withdrawingId)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmWithdraw}
                  disabled={Boolean(withdrawingId && withdrawingId === confirmApplication.application_id)}
                  className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-red-400"
                >
                  {withdrawingId === confirmApplication.application_id ? 'Deleting…' : 'Yes, delete it'}
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed top-20 right-6 z-50">
            <div
              className={`min-w-[260px] rounded-2xl shadow-lg px-4 py-3 text-sm text-white flex items-start gap-3 ${
                toast.variant === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            >
              <span className="font-semibold capitalize">{toast.variant}</span>
              <p className="text-white/90 flex-1">{toast.message}</p>
              <button onClick={() => setToast(null)} className="text-white/80 text-xs font-bold">×</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Applications;
