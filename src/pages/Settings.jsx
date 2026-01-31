import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaBell, FaShieldAlt, FaSave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    newsletterSubscription: false,
  });

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaLock },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'privacy', label: 'Privacy', icon: FaShieldAlt },
  ];

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-blue-700 p-8 shadow-xl">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative">
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-base text-blue-100">Manage your account settings and preferences</p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card p-3">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md transform scale-105'
                          : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="card">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                      <p className="text-sm text-gray-600">Update your personal information</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input type="text" defaultValue={user?.name} className="input-field text-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <input type="email" defaultValue={user?.email} className="input-field text-base bg-gray-50" disabled />
                        <FaCheckCircle className="absolute right-3 top-3.5 text-green-500" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center space-x-1">
                        <FaExclamationCircle className="text-blue-500" />
                        <span>Email is verified and cannot be changed</span>
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input type="tel" placeholder="+1 (234) 567-8900" className="input-field text-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                      <textarea rows="4" placeholder="Tell us about yourself..." className="input-field text-base resize-none"></textarea>
                    </div>
                    <button className="btn-primary inline-flex items-center space-x-2 px-6 py-3 text-base">
                      <FaSave />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                      <FaLock className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                      <p className="text-sm text-gray-600">Keep your account secure</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                      <input type="password" className="input-field text-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                      <input type="password" className="input-field text-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                      <input type="password" className="input-field text-base" />
                    </div>
                    <button className="btn-primary px-6 py-3 text-base">Update Password</button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <FaBell className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                      <p className="text-sm text-gray-600">Choose what you want to be notified about</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(settings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div>
                          <p className="text-base font-semibold text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {key === 'emailNotifications' && 'Receive email notifications'}
                            {key === 'jobAlerts' && 'Get notified about new job opportunities'}
                            {key === 'applicationUpdates' && 'Updates on your job applications'}
                            {key === 'newsletterSubscription' && 'Weekly newsletter and updates'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleToggle(key)}
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors shadow-inner ${
                            value ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                              value ? 'translate-x-8' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                    <button className="btn-primary px-6 py-3 text-base">Save Preferences</button>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <FaShieldAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>
                      <p className="text-sm text-gray-600">Control your privacy and data</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">Profile Visibility</h3>
                      <p className="text-sm text-gray-600 mb-3">Control who can see your profile information</p>
                      <select className="input-field text-base">
                        <option>Everyone</option>
                        <option>Registered Users Only</option>
                        <option>Only Me</option>
                      </select>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">Search Visibility</h3>
                      <p className="text-sm text-gray-600 mb-3">Allow employers to find your profile in search</p>
                      <select className="input-field text-base">
                        <option>Visible to All Employers</option>
                        <option>Only Selected Companies</option>
                        <option>Not Visible</option>
                      </select>
                    </div>
                    <button className="btn-primary px-6 py-3 text-base">Save Privacy Settings</button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
