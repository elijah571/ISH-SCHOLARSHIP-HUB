import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import Button from '../components/Button';
import userService from '../services/userService';
import { getAccessToken } from '../services/api';
import {
  PlusIcon,
  MessageIcon,
  OverviewIcon,
  ApplicationIcon,
  BookmarkIcon,
  UserIcon,
  SettingsIcon,
  LogoutIcon,
  CubeIcon,
  GlobeIcon,
  CalendarIcon,
  ExternalLinkIcon,
  TrashIcon,
} from '../components/icons/Icons';
import { ConversationList } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';


const LoadingSpinner = () => (
  <svg className="w-6 h-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Sidebar = ({ activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { name: 'Overview', icon: OverviewIcon, tab: 'overview' },
    { name: 'My Applications', icon: ApplicationIcon, tab: 'applied' },
    { name: 'Saved Scholarships', icon: BookmarkIcon, tab: 'saved' },
    { name: 'Chat', icon: MessageIcon, tab: 'chat' },
    { name: 'My Profile', icon: UserIcon, tab: 'profile' },
    { name: 'Settings', icon: SettingsIcon, tab: 'settings' },
  ];

  return (
    <aside className="w-[260px] bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
      <div className="mb-6">
        <p className="text-[11px] tracking-widest text-gray-400 font-semibold mb-2.5">DASHBOARD</p>
        {menuItems.slice(0, 3).map((item) => (
          <button
            key={item.name}
            onClick={() => onTabChange(item.tab)}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg cursor-pointer mb-1.5 transition-colors ${
              activeTab === item.tab
                ? 'bg-blue-50 text-blue-700 font-semibold relative'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {activeTab === item.tab && (
              <div className="absolute left-0 w-[3px] h-full bg-blue-700 rounded-r" />
            )}
            <item.icon />
            <span className="text-[14px]">{item.name}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-[11px] tracking-widest text-gray-400 font-semibold mb-2.5">ACCOUNT</p>
        {menuItems.slice(3).map((item) => (
          <button
            key={item.name}
            onClick={() => onTabChange(item.tab)}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg cursor-pointer mb-1.5 transition-colors ${
              activeTab === item.tab
                ? 'bg-blue-50 text-blue-700 font-semibold relative'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {activeTab === item.tab && (
              <div className="absolute left-0 w-[3px] h-full bg-blue-700 rounded-r" />
            )}
            <item.icon />
            <span className="text-[14px]">{item.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg cursor-pointer text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogoutIcon />
          <span className="text-[14px] font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const StatCard = ({ icon, iconBg, label, value, subtitle }) => {
  const IconComponent = icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2.5">
      <div className={`w-[42px] h-[42px] rounded-lg flex items-center justify-center ${iconBg}`}>
        {IconComponent && <IconComponent />}
      </div>
      <p className="text-[13px] text-gray-500">{label}</p>
      <p className="text-[26px] font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-[12px] text-gray-400">{subtitle}</p>}
    </div>
  );
};

const ScholarshipCard = ({
  scholarship,
  onUnsave,
  onApply,
  showApply = true,
  showUnsave = false,
  appliedAt = null,
}) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isDeadlinePassed = new Date(scholarship.deadline) < new Date();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {scholarship.image?.url ? (
          <img
            src={scholarship.image.url}
            alt={scholarship.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <CubeIcon />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="text-[15px] font-semibold text-gray-800 truncate">{scholarship.title}</h4>

          <div className="flex items-center gap-4 mt-1.5 text-[13px] text-gray-500">
            <span className="flex items-center gap-1">
              <GlobeIcon />
              {scholarship.country}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon />
              {formatDate(scholarship.deadline)}
            </span>
          </div>

          {appliedAt && (
            <p className="text-[12px] text-green-600 mt-1">Applied on {formatDate(appliedAt)}</p>
          )}

          {scholarship.funding_type && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-[11px] rounded-full">
              {scholarship.funding_type}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        {showApply && scholarship.link && (
          <a
            href={scholarship.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onApply?.(scholarship.id)}
            disabled={isDeadlinePassed}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              isDeadlinePassed
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}
          >
            <ExternalLinkIcon />
            {isDeadlinePassed ? 'Expired' : 'Apply Now'}
          </a>
        )}

        {showUnsave && (
          <button
            onClick={() => onUnsave?.(scholarship.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <TrashIcon />
            Remove
          </button>
        )}

        <Link
          to={`/scholarships/${scholarship.id}`}
          className="ml-auto text-[13px] text-blue-600 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { logout, user } = useAuth();
  const { authenticateSocket } = useChat();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Data state
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [appliedScholarships, setAppliedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [savedRes, appliedRes] = await Promise.all([
          userService.getSavedScholarships(),
          userService.getAppliedScholarships(),
        ]);

        setSavedScholarships(savedRes.data.data || []);
        setAppliedScholarships(appliedRes.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load your dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (activeTab !== 'chat') {
      return;
    }

    const token = getAccessToken();
    if (token) {
      authenticateSocket(token);
    }
  }, [activeTab, authenticateSocket]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUnsave = async (scholarshipId) => {
    try {
      await userService.unsaveScholarship(scholarshipId);
      setSavedScholarships((prev) => prev.filter((s) => s.id !== scholarshipId));
      toast.success('Scholarship removed from saved list.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove scholarship.');
    }
  };

  const handleApply = async (scholarshipId) => {
    try {
      await userService.markAsApplied(scholarshipId);
      const scholarship = savedScholarships.find((s) => s.id === scholarshipId);
      if (scholarship) {
        setSavedScholarships((prev) => prev.filter((s) => s.id !== scholarshipId));
        setAppliedScholarships((prev) => [
          {
            scholarship,
            appliedAt: new Date().toISOString(),
            _id: Date.now().toString(),
          },
          ...prev,
        ]);
      }
      toast.success('Scholarship marked as applied.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark scholarship as applied.');
    }
  };

  // Calculate stats
  const stats = {
    totalApplications: appliedScholarships.length,
    saved: savedScholarships.length,
  };

  const getFirstName = () => {
    if (!user) return 'User';
    return user.fullName?.split(' ')[0] || user.firstName || 'User';
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="grid grid-cols-4 gap-5 mb-6">
              <StatCard
                icon={ApplicationIcon}
                iconBg="bg-blue-100 text-blue-600"
                label="My Applications"
                value={stats.totalApplications}
                subtitle="Total applied"
              />
              <StatCard
                icon={BookmarkIcon}
                iconBg="bg-purple-100 text-purple-600"
                label="Saved Scholarships"
                value={stats.saved}
                subtitle="Ready to apply"
              />
            </div>

            {appliedScholarships.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-7">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[18px] font-semibold text-gray-800">My Applications</h2>
                  <button
                    onClick={() => setActiveTab('applied')}
                    className="text-[14px] text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {appliedScholarships.slice(0, 3).map((app) => (
                    <ScholarshipCard
                      key={app.id}
                      scholarship={app.scholarship}
                      appliedAt={app.appliedAt}
                      showApply={true}
                      showUnsave={false}
                      onApply={handleApply}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 mb-7 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApplicationIcon />
                </div>
                <h3 className="text-[18px] font-semibold text-gray-800 mb-2">
                  No applications yet
                </h3>
                <p className="text-[14px] text-gray-500 mb-4">
                  Start exploring scholarships and apply to your dream programs.
                </p>
                <Button onClick={() => navigate('/scholarships')}>Browse Scholarships</Button>
              </div>
            )}

            {savedScholarships.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-7">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[18px] font-semibold text-gray-800">Saved Scholarships</h2>
                  <button
                    onClick={() => setActiveTab('saved')}
                    className="text-[14px] text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {savedScholarships.slice(0, 3).map((scholarship) => (
                    <ScholarshipCard
                      key={scholarship.id}
                      scholarship={scholarship}
                      showApply={true}
                      showUnsave={true}
                      onUnsave={handleUnsave}
                      onApply={handleApply}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookmarkIcon />
                </div>
                <h3 className="text-[18px] font-semibold text-gray-800 mb-2">
                  No saved scholarships
                </h3>
                <p className="text-[14px] text-gray-500 mb-4">
                  Save scholarships you're interested in to apply later.
                </p>
                <Button onClick={() => navigate('/scholarships')}>Find Scholarships</Button>
              </div>
            )}
          </>
        );

      case 'applied':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-semibold text-gray-800">
                My Applications ({appliedScholarships.length})
              </h2>
            </div>

            {appliedScholarships.length > 0 ? (
              <div className="space-y-3">
                {appliedScholarships.map((app) => (
                  <ScholarshipCard
                    key={app.id}
                    scholarship={app.scholarship}
                    appliedAt={app.appliedAt}
                    showApply={true}
                    showUnsave={false}
                    onApply={handleApply}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApplicationIcon />
                </div>
                <h3 className="text-[18px] font-semibold text-gray-800 mb-2">
                  No applications yet
                </h3>
                <p className="text-[14px] text-gray-500 mb-4">
                  Start applying to scholarships you're interested in.
                </p>
                <Button onClick={() => navigate('/scholarships')}>Browse Scholarships</Button>
              </div>
            )}
          </div>
        );

      case 'saved':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-semibold text-gray-800">
                Saved Scholarships ({savedScholarships.length})
              </h2>
            </div>

            {savedScholarships.length > 0 ? (
              <div className="space-y-3">
                {savedScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    showApply={true}
                    showUnsave={true}
                    onUnsave={handleUnsave}
                    onApply={handleApply}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookmarkIcon />
                </div>
                <h3 className="text-[18px] font-semibold text-gray-800 mb-2">
                  No saved scholarships
                </h3>
                <p className="text-[14px] text-gray-500 mb-4">
                  Save scholarships you're interested in to apply later.
                </p>
                <Button onClick={() => navigate('/scholarships')}>Find Scholarships</Button>
              </div>
            )}
          </div>
        );

      case 'chat':
        return (
          <div
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            style={{ height: 'calc(100vh - 200px)' }}
          >
            <div className="flex h-full">
              <div className="w-80 border-r border-gray-200">
                <ConversationList
                  onSelectConversation={setSelectedConversation}
                  selectedConversationId={selectedConversation}
                  adminMode={false}
                />
              </div>
              <div className="flex-1">
                {selectedConversation ? (
                  <ChatWindow conversationId={selectedConversation} adminMode={false} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <MessageIcon />
                      <p className="mt-2">Select a conversation to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-[18px] font-semibold text-gray-800 mb-6">My Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-[32px] font-bold text-blue-700">
                    {getFirstName().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-[20px] font-semibold text-gray-800">
                    {user?.fullName || 'User'}
                  </h3>
                  <p className="text-[14px] text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[12px] text-gray-400 uppercase tracking-wide mb-1">Email</p>
                  <p className="text-[14px] text-gray-800">{user?.email}</p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-400 uppercase tracking-wide mb-1">Role</p>
                  <p className="text-[14px] text-gray-800 capitalize">{user?.role || 'User'}</p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-400 uppercase tracking-wide mb-1">
                    Saved Scholarships
                  </p>
                  <p className="text-[14px] text-gray-800">{stats.saved}</p>
                </div>
                <div>
                  <p className="text-[12px] text-gray-400 uppercase tracking-wide mb-1">
                    Applications
                  </p>
                  <p className="text-[14px] text-gray-800">{stats.totalApplications}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-[18px] font-semibold text-gray-800 mb-6">Settings</h2>
            <p className="text-[14px] text-gray-500">Settings panel coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen grid grid-cols-[260px_1fr]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />

      <main className="bg-gray-100 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-7">
          <div>
            <h1 className="text-[30px] font-bold text-gray-800">Welcome back, {getFirstName()}!</h1>
            <p className="text-[15px] text-gray-500 mt-1">
              {activeTab === 'overview' &&
                "Here's what's happening with your scholarship applications today."}
              {activeTab === 'applied' && 'Track all your scholarship applications.'}
              {activeTab === 'saved' && "Scholarships you've saved for later."}
              {activeTab === 'profile' && 'Manage your account details.'}
              {activeTab === 'settings' && 'Customize your preferences.'}
              {activeTab === 'chat' && 'Chat with support.'}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/scholarships')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-lg text-[14px] font-semibold hover:bg-blue-800 transition-colors"
            >
              <PlusIcon />
              Find Scholarships
            </button>
          </div>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardPage;
