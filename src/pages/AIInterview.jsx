import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaMicrophoneAlt, FaCheckCircle, FaChartLine, FaClock, FaHistory } from 'react-icons/fa';

const mockPrompts = [
  'Tell me about a time you unblocked a teammate.',
  'How do you manage multiple stakeholders with conflicting priorities?',
  'Walk me through the most data-heavy decision you made.',
  'How would you ship a feature in 48 hours with limited context?',
  'Describe a situation where you had to learn a new technology quickly.',
  'Tell me about a time when you disagreed with your manager.',
  'How do you prioritize tasks when everything is urgent?',
  'Describe a project where you had to collaborate with a difficult team member.',
];

const AIInterview = () => {
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/career/interview-history');
      setHistory(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPrompt || !response.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/career/mock-interview', {
        prompt: selectedPrompt,
        response
      });
      setFeedback(res.data.data);
      setResponse('');
      fetchHistory();
    } catch (error) {
      console.error('Interview submission failed:', error);
      setFeedback({ error: 'Failed to analyze response. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <FaMicrophoneAlt className="text-2xl text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Mock Interview</h1>
                <p className="text-sm text-gray-600">Practice behavioral questions with instant feedback</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Prompts */}
            <div className="card lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Question</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mockPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPrompt(prompt)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                      selectedPrompt === prompt
                        ? 'border-primary-500 bg-primary-50 text-gray-900 font-medium'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Response & Feedback */}
            <div className="lg:col-span-2 space-y-6">
              {/* Response Input */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Response</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Use the STAR method: <span className="font-medium">Situation, Task, Action, Result</span>
                </p>
                {selectedPrompt && (
                  <div className="mb-4 p-3 bg-primary-50 border border-primary-100 rounded-lg text-sm text-gray-800">
                    <strong>Question:</strong> {selectedPrompt}
                  </div>
                )}
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder={selectedPrompt ? "Type your answer here..." : "Please select a question first"}
                  disabled={!selectedPrompt}
                  className="w-full h-48 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm p-4 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600">
                    {response.trim().split(/\s+/).filter(w => w).length} words
                  </span>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedPrompt || !response.trim() || loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      'Submit & Get Feedback'
                    )}
                  </button>
                </div>
              </div>

              {/* Feedback */}
              {feedback && !feedback.error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card bg-gradient-to-br from-green-50 to-white border-green-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Feedback</h2>
                    <div className="flex items-center gap-2">
                      <FaChartLine className="text-green-600" />
                      <span className="text-2xl font-bold text-green-600">{feedback.score}%</span>
                    </div>
                  </div>

                  {/* STAR Components */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {Object.entries(feedback.starComponents || {}).map(([key, present]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        {present ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className="capitalize font-medium text-gray-700">{key}</span>
                      </div>
                    ))}
                  </div>

                  {/* Word Count */}
                  <div className="mb-4 p-3 bg-white rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaClock />
                      <span>Word count: <strong className="text-gray-900">{feedback.wordCount}</strong></span>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm">Improvement Tips:</h3>
                    {feedback.feedback.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-600 mt-0.5">•</span>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {feedback?.error && (
                <div className="card bg-red-50 border-red-200 text-red-800">
                  {feedback.error}
                </div>
              )}

              {/* History */}
              {history.length > 0 && (
                <div className="card">
                  <div className="flex items-center gap-2 mb-4">
                    <FaHistory className="text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Practice History</h2>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">Score: {item.score}%</span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 line-clamp-2">{item.prompt}</p>
                      </div>
                    ))}
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

export default AIInterview;
