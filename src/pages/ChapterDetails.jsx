import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaUsers, FaGraduationCap, FaUserPlus, FaPlus, FaBriefcase, FaBullhorn } from 'react-icons/fa';

const ChapterDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [chapter, setChapter] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postData, setPostData] = useState({
    type: 'job',
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    skills: ''
  });

  useEffect(() => {
    fetchChapterData();
  }, [id]);

  const fetchChapterData = async () => {
    try {
      setLoading(true);
      const chapterRes = await api.get(`/chapters/${id}`);
      setChapter(chapterRes.data.data);

      if (isAuthenticated) {
        try {
          const postsRes = await api.get(`/chapters/${id}/posts`);
          setPosts(postsRes.data.data);
          setIsMember(true);

          const membersRes = await api.get(`/chapters/${id}/members`);
          setMembers(membersRes.data.data);
        } catch (error) {
          setIsMember(false);
        }
      }
    } catch (error) {
      console.error('Error fetching chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChapter = async () => {
    if (!isAuthenticated) {
      alert('Please login to join chapter');
      return;
    }

    try {
      await api.post(`/chapters/${id}/join`);
      alert('Join request submitted!');
      fetchChapterData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join chapter');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/chapters/${id}/posts`, postData);
      alert('Post created successfully!');
      setShowPostModal(false);
      fetchChapterData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-xl font-semibold text-gray-900">Chapter not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-4"
        >
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            {chapter.logo && (
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`http://localhost:5000${chapter.logo}`}
                  alt={chapter.chapter_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">{chapter.chapter_name}</h1>
              <p className="text-base text-gray-600 mb-3">{chapter.college_name}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {chapter.department && (
                  <span className="px-2 py-1 bg-primary-50 border border-primary-200 text-primary-700 rounded-md text-xs">
                    {chapter.department}
                  </span>
                )}
                {chapter.batch && (
                  <span className="px-2 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-md text-xs">
                    Batch {chapter.batch}
                  </span>
                )}
                <span className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs">
                  <FaUsers className="text-xs" /> {chapter.member_count} members
                </span>
              </div>

              {chapter.description && (
                <p className="text-gray-700 text-sm mb-3">{chapter.description}</p>
              )}

              {!isMember && (
                <button onClick={handleJoinChapter} className="btn-primary">
                  <FaUserPlus className="inline mr-1 text-xs" />
                  Join Chapter
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Posts Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Chapter Feed</h2>
              {isMember && (
                <button onClick={() => setShowPostModal(true)} className="btn-primary">
                  <FaPlus className="inline mr-1 text-xs" />
                  Create Post
                </button>
              )}
            </div>

            {!isMember ? (
              <div className="card text-center py-12">
                <p className="text-gray-600 text-sm">Join this chapter to view posts and opportunities</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600 text-sm">No posts yet. Be the first to post!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <motion.div
                    key={post.post_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {post.type === 'job' ? (
                        <FaBriefcase className="text-primary-600 text-base mt-0.5" />
                      ) : (
                        <FaBullhorn className="text-purple-600 text-base mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-base font-semibold text-gray-900">{post.title}</h3>
                          <span className="px-2 py-0.5 bg-primary-50 border border-primary-200 text-primary-700 rounded text-xs">
                            {post.type}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs mb-1">Posted by {post.poster_name}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-2 whitespace-pre-line">{post.description}</p>
                    
                    {post.type === 'job' && (
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        {post.company && <span>🏢 {post.company}</span>}
                        {post.location && <span>📍 {post.location}</span>}
                        {post.salary && <span>💰 {post.salary}</span>}
                      </div>
                    )}
                    
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-gray-500 text-xs">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Members Sidebar */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Members</h2>
            {isMember && members.length > 0 ? (
              <div className="card">
                <div className="space-y-2">
                  {members.slice(0, 10).map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-50 border border-primary-200 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-semibold text-xs">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium text-sm">{member.name}</p>
                          <p className="text-gray-600 text-xs">{member.user_role}</p>
                        </div>
                      </div>
                      {member.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded text-xs">
                          Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card text-center py-8">
                <p className="text-gray-600 text-xs">Join to see members</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Create Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
                <select
                  value={postData.type}
                  onChange={(e) => setPostData({ ...postData, type: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="job">Job</option>
                  <option value="internship">Internship</option>
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                  <option value="mentoring">Mentoring</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={postData.title}
                  onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={postData.description}
                  onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                  rows="4"
                  className="input-field resize-none text-sm"
                  required
                />
              </div>

              {(postData.type === 'job' || postData.type === 'internship') && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={postData.company}
                        onChange={(e) => setPostData({ ...postData, company: e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={postData.location}
                        onChange={(e) => setPostData({ ...postData, location: e.target.value })}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary/Stipend</label>
                    <input
                      type="text"
                      value={postData.salary}
                      onChange={(e) => setPostData({ ...postData, salary: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">
                  Create Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChapterDetails;
