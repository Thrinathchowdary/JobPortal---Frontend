import { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const SidebarContext = createContext();
export const useSidebar = () => useContext(SidebarContext);
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Chapters from './pages/Chapters';
import ChapterDetails from './pages/ChapterDetails';
import CreateChapter from './pages/CreateChapter';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import Applications from './pages/Applications';
import MyJobs from './pages/MyJobs';
import Applicants from './pages/Applicants';
import ApplicantsOverview from './pages/ApplicantsOverview';
import CompanyProfile from './pages/CompanyProfile';
import CareerAssist from './pages/CareerAssist';
import ResumeReview from './pages/ResumeReview';
import AIInterview from './pages/AIInterview';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const showSidebar = isAuthenticated && !['/login', '/register', '/'].includes(location.pathname);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {showSidebar && <Sidebar />}
        <div 
          className={`transition-all duration-300 ${
            showSidebar ? (sidebarOpen ? 'ml-60' : 'ml-20') : ''
          }`}
        >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/chapters/:id" element={<ChapterDetails />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/post-job" element={
            <ProtectedRoute roles={['job_poster', 'alumni', 'admin']}>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/edit-job/:jobId" element={
            <ProtectedRoute roles={['job_poster', 'alumni', 'admin']}>
              <EditJob />
            </ProtectedRoute>
          } />
          <Route path="/create-chapter" element={
            <ProtectedRoute>
              <CreateChapter />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute roles={['job_seeker', 'student']}>
              <Applications />
            </ProtectedRoute>
          } />
          <Route path="/my-jobs" element={
            <ProtectedRoute roles={['job_poster', 'alumni', 'admin']}>
              <MyJobs />
            </ProtectedRoute>
          } />
          <Route path="/applicants" element={
            <ProtectedRoute roles={['job_poster', 'alumni', 'admin']}>
              <ApplicantsOverview />
            </ProtectedRoute>
          } />
          <Route path="/applicants/:jobId" element={
            <ProtectedRoute roles={['job_poster', 'alumni', 'admin']}>
              <Applicants />
            </ProtectedRoute>
          } />
          <Route path="/company-profile" element={
            <ProtectedRoute roles={['job_poster', 'admin']}>
              <CompanyProfile />
            </ProtectedRoute>
          } />
          <Route path="/career-tools" element={
            <ProtectedRoute>
              <CareerAssist />
            </ProtectedRoute>
          } />
          <Route path="/resume-review" element={
            <ProtectedRoute>
              <ResumeReview />
            </ProtectedRoute>
          } />
          <Route path="/ai-interview" element={
            <ProtectedRoute>
              <AIInterview />
            </ProtectedRoute>
          } />
          
        </Routes>
      </div>
    </div>
    </SidebarContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
