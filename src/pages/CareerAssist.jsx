import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaRobot, FaVideo, FaMicrophoneAlt, FaFileUpload, FaCheckCircle, FaBolt, FaTasks, FaChartLine } from 'react-icons/fa';

const aiHighlights = [
  {
    title: 'Resume Reviver',
    description: 'Paste your resume and instantly receive bullet-point suggestions that map to in-demand keywords and measurable impact statements.',
    icon: FaFileUpload,
  },
  {
    title: 'Interview Studio',
    description: 'Practice behavioral and technical prompts while getting tone, pace, and confidence scores from the AI mock-interviewer.',
    icon: FaMicrophoneAlt,
  },
  {
    title: 'Video Playlists',
    description: 'Curated 3-5 minute tutorials from alumni mentors covering salary negotiation, remote stand-ups, and portfolio storytelling.',
    icon: FaVideo,
  },
];

const quickWins = [
  'Align projects to metrics (“reduced load time by 38%”).',
  'Mirror the exact phrasing of the job responsibilities.',
  'Showcase leadership impact even if you had no title.',
  'Highlight chapter or volunteer initiatives for soft skills.',
];

const mockPrompts = [
  'Tell me about a time you unblocked a teammate.',
  'How do you manage multiple stakeholders with conflicting priorities?',
  'Walk me through the most data-heavy decision you made.',
  'How would you ship a feature in 48 hours with limited context?',
];

const focusTracks = [
  {
    title: 'Resume polish streak',
    progress: 78,
    trend: '+12% this week',
    icon: FaFileUpload,
    accent: 'from-amber-200 to-amber-100'
  },
  {
    title: 'Interview confidence',
    progress: 64,
    trend: '+2 sessions logged',
    icon: FaMicrophoneAlt,
    accent: 'from-sky-200 to-sky-100'
  },
  {
    title: 'Network reach-outs',
    progress: 35,
    trend: '3/5 intros sent',
    icon: FaBolt,
    accent: 'from-emerald-200 to-emerald-100'
  },
];

const actionStack = [
  {
    title: 'Upload STAR story',
    description: 'Turn a recent project into a 3-bullet impact statement.',
    eta: '5 min',
  },
  {
    title: 'Record a calm opener',
    description: 'Practice a confident “Tell me about yourself” intro.',
    eta: '3 min',
  },
  {
    title: 'Ping a chapter mentor',
    description: 'Share one career blocker and request a 15-min sync.',
    eta: '2 min',
  },
];

const CareerAssist = () => {
  const [resumeText, setResumeText] = useState('');
  const [generatedTips, setGeneratedTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [interviewResponse, setInterviewResponse] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/career/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/career/analyze-resume', { resumeText });
      setGeneratedTips(response.data.data.tips || []);
    } catch (error) {
      console.error('Resume analysis failed:', error);
      setGeneratedTips(['Failed to analyze resume. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewSubmit = async () => {
    if (!selectedPrompt || !interviewResponse.trim()) return;
    setInterviewLoading(true);
    try {
      const response = await api.post('/career/mock-interview', {
        prompt: selectedPrompt,
        response: interviewResponse
      });
      setInterviewFeedback(response.data.data);
      setInterviewResponse('');
      fetchStats(); // Refresh stats after submission
    } catch (error) {
      console.error('Interview submission failed:', error);
    } finally {
      setInterviewLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16 px-4 lg:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex-1">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 uppercase tracking-wide">
              <FaRobot /> Career Assist Beta
            </p>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">Personal coach for every application</h1>
            <p className="text-slate-600 mt-3">
              Blend AI guidance with alumni wisdom. Polish your resume, rehearse interviews, and binge quick masterclasses—all inside the portal.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={handleAnalyze} className="btn-primary text-sm px-5 py-2.5">
                Run Smart Suggestions
              </button>
              <a href="#tutorials" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                Browse Tutorials →
              </a>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-2xl p-6 w-full lg:max-w-sm">
            <p className="text-xs uppercase tracking-wide font-semibold text-primary-700">Today’s Confidence Pulse</p>
            <p className="text-4xl font-bold text-slate-900 mt-3">{stats?.confidencePulse || 0}%</p>
            <p className="text-sm text-slate-600 mt-2">Based on interview practice, applications, and career activity.</p>
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Interview Sessions</span>
                <span className="font-semibold text-slate-900">{stats?.interviewPracticeCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Avg Interview Score</span>
                <span className="font-semibold text-slate-900">{stats?.averageInterviewScore || 0}%</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Total Applications</span>
                <span className="font-semibold text-slate-900">{stats?.totalApplications || 0}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Resume sandbox</p>
            <h2 className="text-xl font-semibold text-slate-900 mt-2">Drop in your latest draft</h2>
            <p className="text-sm text-slate-600">We surface quantifiable wins, missing keywords, and tone improvements in seconds.</p>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="mt-4 w-full h-40 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-slate-700 placeholder:text-slate-400"
              placeholder="Paste a resume bullet or summary..."
            />
            <button
              onClick={handleAnalyze}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-60"
              disabled={!resumeText.trim() || loading}
            >
              {loading ? 'Analyzing…' : 'Suggest Enhancements'}
            </button>

            {generatedTips.length > 0 && (
              <div className="mt-6 space-y-3">
                {generatedTips.map((tip, index) => (
                  <p key={index} className="flex items-start gap-2 text-sm text-slate-700">
                    <FaCheckCircle className="mt-1 text-green-500" />
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Mock interview lab</p>
            <h2 className="text-xl font-semibold text-slate-900 mt-2">Spin up a 5-minute drill</h2>
            <p className="text-sm text-slate-600">Pick a prompt and type your answer. We highlight clarity, pacing, and depth.</p>
            <div className="mt-4 grid gap-3">
              {mockPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setSelectedPrompt(prompt)}
                  className={`text-left px-4 py-3 rounded-xl border transition-colors text-sm ${
                    selectedPrompt === prompt
                      ? 'border-primary-500 bg-primary-50 text-slate-900'
                      : 'border-slate-200 hover:border-primary-400 hover:bg-primary-50/50 text-slate-700'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
            {selectedPrompt && (
              <div className="mt-4">
                <textarea
                  value={interviewResponse}
                  onChange={(e) => setInterviewResponse(e.target.value)}
                  placeholder="Type your response using STAR method (Situation, Task, Action, Result)..."
                  className="w-full h-32 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-slate-700 placeholder:text-slate-400 p-3"
                />
                <button
                  onClick={handleInterviewSubmit}
                  disabled={!interviewResponse.trim() || interviewLoading}
                  className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {interviewLoading ? 'Analyzing...' : 'Submit & Get Feedback'}
                </button>
              </div>
            )}
            {interviewFeedback && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm font-semibold text-green-900">Score: {interviewFeedback.score}%</p>
                <p className="text-xs text-green-700 mt-1">Word count: {interviewFeedback.wordCount}</p>
                <ul className="mt-3 space-y-2 text-sm text-green-800">
                  {interviewFeedback.feedback.map((fb, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-600 mt-0.5" />
                      {fb}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6" id="tutorials">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Guided playlists</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-1">Bite-sized lessons from alumni mentors</h2>
            </div>
            <button className="text-sm font-semibold text-primary-600">View all episodes →</button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {aiHighlights.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-5 hover:border-primary-300 transition-colors bg-gradient-to-br from-white to-slate-50">
                <Icon className="text-primary-600 text-xl" />
                <h3 className="text-base font-semibold text-slate-900 mt-3">{title}</h3>
                <p className="text-sm text-slate-600 mt-2">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Quick wins</p>
            <h2 className="text-xl font-semibold text-slate-900 mt-2">Four ways to sound sharper</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {quickWins.map((tip) => (
                <li key={tip} className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Community challenges</p>
            <h2 className="text-2xl font-semibold mt-2">Launch a 7-day sprint</h2>
            <p className="text-sm text-white/90 mt-3">
              Commit to daily micro-actions—resume tweaks, applications, or mock interviews—and track progress alongside your chapter.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <p>🔥 122 members active this week</p>
              <p>🎯 Average completion time: 11 minutes/day</p>
              <p>💬 Live accountability thread every Friday</p>
            </div>
            <button className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-primary-600 font-semibold">
              Join Sprint
            </button>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          {focusTracks.map(({ title, progress, trend, icon: Icon, accent }) => (
            <div key={title} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${accent} p-5 shadow-sm`}> 
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Focus track</p>
                  <h3 className="text-lg font-semibold text-slate-900 mt-1">{title}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-primary-600 shadow-inner">
                  <Icon />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                  <span>Progress</span>
                  <span className="font-semibold text-slate-900">{progress}%</span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-slate-600 mt-3">{trend}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Action stack</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-1">Tiny tasks your future self will thank you for</h2>
            </div>
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
              <FaTasks /> Generate new stack
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {actionStack.map(({ title, description, eta }) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-4 hover:border-primary-300 transition-colors">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{eta}</p>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">{title}</h3>
                <p className="text-sm text-slate-600 mt-2">{description}</p>
                <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                  <FaChartLine /> Mark complete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CareerAssist;
