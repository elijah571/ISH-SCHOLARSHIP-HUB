import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';
import Loader from '../components/Loader';
import UsersTab from '../components/admin/UsersTab';
import { BlogIcon, BriefcaseIcon, DashboardIcon, EditIcon, EyeIcon, LogoutIcon, MailIcon, MessageIcon, PlusIcon, ScholarshipIcon, TrashIcon, UsersIcon } from '../components/icons/Icons';
import { BlogsTab } from '../components/admin/BlogsTab';
import { ScholarshipsTab } from '../components/admin/ScholarshipsTab';
import { InternshipsTab } from '../components/admin/InternshipsTab';
import { NewsletterTab } from '../components/admin/NewsletterTab';
import { AdminChatDashboard } from '../components/chat/AdminChatDashboard';


const menuItems = [
  { name: 'Dashboard', icon: DashboardIcon, key: 'dashboard' },
  { name: 'Users', icon: UsersIcon, key: 'users' },
  { name: 'Blog Posts', icon: BlogIcon, key: 'blogs' },
  { name: 'Scholarships', icon: ScholarshipIcon, key: 'scholarships' },
  { name: 'Internships', icon: BriefcaseIcon, key: 'internships' },
  { name: 'Support Inbox', icon: MessageIcon, key: 'chat' },
  { name: 'Newsletter', icon: MailIcon, key: 'newsletter' },
];

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => (
  <aside className="w-[260px] bg-gray-900 text-white p-6">
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span className="text-lg font-bold">Admin Panel</span>
      </div>
      <p className="text-xs text-gray-400">Scholarship Hub CMS and support inbox</p>
    </div>

    {/* MENU ITEMS(SIDEBAR) */}
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <button
          key={item.key}
          onClick={() => setActiveTab(item.key)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activeTab === item.key
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <item.icon />
          <span className="text-[14px] font-medium">{item.name}</span>
        </button>
      ))}
    </nav>

    <div className="absolute bottom-6 left-6">
      {/* <Link to="/">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[14px] font-medium">Back to Site</span>
        </button>
      </Link> */}
      <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors">
        <LogoutIcon />
        <span className="text-[14px] font-medium">Logout</span>
      </button>
    </div>
  </aside>
);

// STAT CARDS
const StatCard = ({ icon, iconBg, label, value }) => {
  const IconComponent = icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`w-[42px] h-[42px] rounded-lg flex items-center justify-center ${iconBg}`}>
        {IconComponent && <IconComponent />}
      </div>
      <p className="text-2xl font-bold text-gray-800 mt-3">{value?.toLocaleString() ?? 0}</p>
      <p className="text-[13px] text-gray-500 mt-1">{label}</p>
    </div>
  );
};

export const TableRow = ({ data, columns, onEdit, onDelete, onView }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    {columns.map((col) => (
      <td key={col.key} className="px-4 py-3.5">
        {col.render ? col.render(data[col.key], data) : data[col.key]}
      </td>
    ))}
    <td className="px-4 py-3.5">
      <div className="flex items-center gap-2">
        {onView && (
          <button onClick={() => onView(data)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
            <EyeIcon />
          </button>
        )}
        {onEdit && (
          <button onClick={() => onEdit(data)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
            <EditIcon />
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(data)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
            <TrashIcon />
          </button>
        )}
      </div>
    </td>
  </tr>
);

const getActionText = (action) => {
  const map = {
    registered: 'registered',
    applied: 'applied to',
    saved: 'saved',
    unsaved: 'unsaved',
    blog_created: 'created blog',
    blog_updated: 'updated blog',
    blog_deleted: 'deleted blog',
    scholarship_created: 'created scholarship',
    scholarship_updated: 'updated scholarship',
    scholarship_deleted: 'deleted scholarship',
    internship_created: 'created internship',
    internship_updated: 'updated internship',
    internship_deleted: 'deleted internship',
    newsletter_subscribed: 'subscribed to newsletter',
  };
  return map[action] || action;
};

const Dashboard = ({ stats, loading, setActiveTab }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <StatCard icon={UsersIcon} iconBg="bg-blue-100 text-blue-600" label="Total Users" value={stats?.counts?.users} />
        <StatCard icon={BlogIcon} iconBg="bg-green-100 text-green-600" label="Blog Posts" value={stats?.counts?.blogs} />
        <StatCard icon={ScholarshipIcon} iconBg="bg-purple-100 text-purple-600" label="Scholarships" value={stats?.counts?.scholarships} />
        <StatCard icon={BriefcaseIcon} iconBg="bg-amber-100 text-amber-600" label="Internships" value={stats?.counts?.internships} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          {stats?.recentActivity?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{activity.user?.charAt(0) || '?'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{activity.user}</span> {getActionText(activity.action)}{' '}
                      <span className="text-blue-600">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">No recent activity</p>
          )}
        </div>

          {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('scholarships')}>
              <PlusIcon />
              Add New Scholarship
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('internships')}>
              <PlusIcon />
              Add New Internship
            </Button>
            <Button variant="outline" className="w-full justify-start"  onClick={() => setActiveTab('blogs')}>
              <PlusIcon />
              Write Blog Post
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('users')}>
              <PlusIcon />
              Create User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const { data } = await api.get('/api/admin/stats');
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} loading={statsLoading} setActiveTab={setActiveTab} />;
      case 'users': return <UsersTab />;
      case 'blogs': return <BlogsTab />;
      case 'scholarships': return <ScholarshipsTab />;
      case 'internships': return <InternshipsTab />;
      case 'newsletter': return <NewsletterTab />;
      case 'chat': return <AdminChatDashboard />;
      default: return <Dashboard stats={stats} loading={statsLoading} />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
