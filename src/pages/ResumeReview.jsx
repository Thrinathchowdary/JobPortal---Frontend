import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaFileUpload, FaCheckCircle, FaLightbulb, FaChartLine } from 'react-icons/fa';

const ResumeReview = () => {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/career/analyze-resume', { resumeText });
      setAnalysis(response.data.data);
    } catch (error) {
      console.error('Resume analysis failed:', error);
      setAnalysis({ error: 'Failed to analyze resume. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <FaFileUpload className="text-2xl text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Resume Review</h1>
                <p className="text-sm text-gray-600">AI-powered analysis of your resume</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Paste Your Resume</h2>
              <p className="text-sm text-gray-600 mb-4">
                Copy and paste your resume text below. We'll analyze keywords, metrics, action verbs, and provide improvement suggestions.
              </p>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm p-4 resize-none"
              />
              <button
                onClick={handleAnalyze}
                disabled={!resumeText.trim() || loading}
                className="btn-primary mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </div>

            {/* Results Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
              {!analysis ? (
                <div className="text-center py-12 text-gray-500">
                  <FaLightbulb className="text-5xl mx-auto mb-4 text-gray-300" />
                  <p>Paste your resume and click "Analyze" to get started</p>
                </div>
              ) : analysis.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  {analysis.error}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 border border-primary-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Resume Score</span>
                      <FaChartLine className="text-primary-600" />
                    </div>
                    <div className="text-4xl font-bold text-primary-600">{analysis.score}/100</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Check */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {analysis.hasMetrics ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className="font-semibold text-gray-900">Quantifiable Metrics</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">
                      {analysis.hasMetrics 
                        ? 'Great! Your resume includes measurable results.'
                        : 'Add numbers, percentages, or specific achievements.'}
                    </p>
                  </div>

                  {/* Keywords Found */}
                  {analysis.foundKeywords && analysis.foundKeywords.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Strong Action Words Found</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.foundKeywords.map((kw, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvement Tips */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Improvement Suggestions</h3>
                    <div className="space-y-3">
                      {analysis.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <FaLightbulb className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-800">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeReview;
