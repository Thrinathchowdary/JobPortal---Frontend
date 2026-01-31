import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaBriefcase, FaUser, FaFileAlt, FaUsers, FaPlus, FaChartBar, FaCog, FaSignOutAlt, FaHome, FaBuilding, FaUserTie, FaGraduationCap, FaRobot } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../App';

const Sidebar = () => {
  const { sidebarOpen: isOpen, setSidebarOpen: setIsOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    const commonItems = [
      { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
      { path: '/profile', icon: FaUser, label: 'My Profile' },
      { path: '/career-tools', icon: FaRobot, label: 'Career Assist' },
      { path: '/resume-review', icon: FaFileAlt, label: 'Resume Review' },
      { path: '/ai-interview', icon: FaRobot, label: 'AI Interview' },
    ];

    const roleSpecificItems = {
      job_seeker: [
        { path: '/jobs', icon: FaBriefcase, label: 'Browse Jobs' },
        { path: '/applications', icon: FaFileAlt, label: 'My Applications' },
        { path: '/chapters', icon: FaUsers, label: 'Alumni Chapters' },
      ],
      student: [
        { path: '/jobs', icon: FaBriefcase, label: 'Browse Jobs' },
        { path: '/applications', icon: FaFileAlt, label: 'My Applications' },
        { path: '/chapters', icon: FaUsers, label: 'Alumni Chapters' },
      ],
      job_poster: [
        { path: '/post-job', icon: FaPlus, label: 'Post New Job' },
        { path: '/my-jobs', icon: FaBriefcase, label: 'My Job Posts' },
        { path: '/applicants', icon: FaFileAlt, label: 'Applicants' },
        { path: '/company-profile', icon: FaBuilding, label: 'Company Profile' },
      ],
      alumni: [
        { path: '/jobs', icon: FaBriefcase, label: 'Browse Jobs' },
        { path: '/post-job', icon: FaPlus, label: 'Post Job' },
        { path: '/my-jobs', icon: FaFileAlt, label: 'My Job Posts' },
        { path: '/applicants', icon: FaUsers, label: 'Applicants' },
        { path: '/chapters', icon: FaUsers, label: 'My Chapters' },
        { path: '/create-chapter', icon: FaGraduationCap, label: 'Create Chapter' },
      ],
      admin: [
        { path: '/admin', icon: FaChartBar, label: 'Admin Panel' },
        { path: '/jobs', icon: FaBriefcase, label: 'All Jobs' },
        { path: '/applicants', icon: FaUsers, label: 'Applicants' },
        { path: '/users', icon: FaUserTie, label: 'Manage Users' },
        { path: '/chapters', icon: FaUsers, label: 'Manage Chapters' },
      ],
    };

    const roleItems = roleSpecificItems[user?.role] || [];
    return [...commonItems, ...roleItems];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-white/95 backdrop-blur-sm border-r border-gray-200 transition-all duration-300 z-40 ${
          isOpen ? 'w-60' : 'w-[4.75rem]'
        } shadow-md`}
      >
        <div className="flex flex-col h-full">
          {/* Toggle Button Inside Sidebar */}
          <div className={`p-3 border-b border-gray-200 flex ${isOpen ? 'justify-end' : 'justify-center'}`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
              title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <FaBars size={16} />
            </button>
          </div>

          {/* User Info */}
          {isOpen && (
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-white text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize truncate">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed User Avatar */}
          {!isOpen && (
            <div className="p-3 border-b border-gray-200 flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-3">
            <ul className="space-y-1.5 px-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`flex items-center ${isOpen ? 'space-x-3 px-3.5' : 'justify-center px-2.5'} py-2.5 rounded-xl text-[0.95rem] font-medium transition-all relative ${
                        isActive
                          ? 'bg-primary-50 text-primary-600 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      title={item.label}
                    >
                      <Icon className={`text-lg flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                      {isOpen && <span className="truncate tracking-tight">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-gray-200 py-3 px-2 space-y-1.5">
            <Link
              to="/settings"
              className={`flex items-center ${isOpen ? 'space-x-3 px-3.5' : 'justify-center px-2.5'} py-2.5 rounded-xl text-[0.95rem] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors`}
              title="Settings"
            >
              <FaCog className="text-base text-gray-500 group-hover:text-gray-700 flex-shrink-0" />
              {isOpen && <span>Settings</span>}
            </Link>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${isOpen ? 'space-x-3 px-3.5' : 'justify-center px-2.5'} py-2.5 rounded-xl text-[0.95rem] text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors`}
              title="Logout"
            >
              <FaSignOutAlt className="text-base text-gray-500 group-hover:text-red-600 flex-shrink-0" />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;
