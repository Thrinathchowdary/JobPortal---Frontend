import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBuilding, FaGlobe, FaMapMarkerAlt, FaUsers, FaIndustry, FaSave, FaUpload } from 'react-icons/fa';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [companyData, setCompanyData] = useState({
    company_name: '',
    company_website: '',
    company_location: '',
    company_size: '',
    industry: '',
    description: '',
    founded_year: '',
  });

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const response = await api.get('/profile/company');
      if (response.data.data) {
        setCompanyData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    }
  };

  const handleChange = (e) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.put('/profile/company', companyData);
      setMessage('Company profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update company profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-8 shadow-xl mb-6">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FaBuilding className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Company Profile</h1>
                <p className="text-base text-blue-100">Manage your company information</p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${
              message.includes('success')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={companyData.company_name}
                      onChange={handleChange}
                      className="input-field text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="url"
                        name="company_website"
                        value={companyData.company_website}
                        onChange={handleChange}
                        className="input-field text-base pl-10"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        name="company_location"
                        value={companyData.company_location}
                        onChange={handleChange}
                        className="input-field text-base pl-10"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Size
                    </label>
                    <select
                      name="company_size"
                      value={companyData.company_size}
                      onChange={handleChange}
                      className="input-field text-base"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <div className="relative">
                      <FaIndustry className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        name="industry"
                        value={companyData.industry}
                        onChange={handleChange}
                        className="input-field text-base pl-10"
                        placeholder="e.g. Technology, Healthcare"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      name="founded_year"
                      value={companyData.founded_year}
                      onChange={handleChange}
                      className="input-field text-base"
                      placeholder="e.g. 2020"
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Description
                  </label>
                  <textarea
                    name="description"
                    value={companyData.description}
                    onChange={handleChange}
                    rows="5"
                    className="input-field text-base resize-none"
                    placeholder="Tell us about your company..."
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base"
            >
              <FaSave />
              {loading ? 'Saving...' : 'Save Company Profile'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyProfile;
