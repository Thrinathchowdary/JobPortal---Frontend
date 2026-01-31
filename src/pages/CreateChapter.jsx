import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaGraduationCap, FaUpload } from 'react-icons/fa';

const CreateChapter = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    chapter_name: '',
    college_name: '',
    department: '',
    batch: '',
    description: ''
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      if (logo) {
        submitData.append('logo', logo);
      }

      const response = await api.post('/chapters', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Chapter created successfully!');
      navigate(`/chapters/${response.data.chapterId}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create chapter');
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
          <div className="flex items-center gap-2 mb-6">
            <FaGraduationCap className="text-2xl text-primary-600" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Create Alumni Chapter</h1>
              <p className="text-sm text-gray-600">Build a community for your college</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="card">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Chapter Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter Name *
                  </label>
                  <input
                    type="text"
                    name="chapter_name"
                    value={formData.chapter_name}
                    onChange={handleChange}
                    className="input-field text-sm"
                    placeholder="e.g. MIT Alumni Chapter 2020"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College/University Name *
                  </label>
                  <input
                    type="text"
                    name="college_name"
                    value={formData.college_name}
                    onChange={handleChange}
                    className="input-field text-sm"
                    placeholder="e.g. Massachusetts Institute of Technology"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="e.g. Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch Year
                    </label>
                    <input
                      type="text"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="e.g. 2020"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="input-field resize-none text-sm"
                    placeholder="Describe the purpose and goals of this chapter..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter Logo (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="btn-secondary cursor-pointer">
                      <FaUpload className="inline mr-1 text-xs" />
                      {logo ? 'Change Logo' : 'Upload Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                    {logo && (
                      <span className="text-gray-600 text-xs">{logo.name}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Recommended: Square image, max 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-primary-50 border-primary-200">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Chapter Admin Responsibilities</h3>
              <ul className="text-gray-700 space-y-1 text-xs">
                <li>✓ Approve or reject member join requests</li>
                <li>✓ Post exclusive jobs and opportunities for chapter members</li>
                <li>✓ Create announcements, events, and mentorship opportunities</li>
                <li>✓ Moderate chapter content and maintain community guidelines</li>
                <li>✓ Connect alumni with current students and fellow graduates</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Creating Chapter...' : 'Create Chapter'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/chapters')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateChapter;
