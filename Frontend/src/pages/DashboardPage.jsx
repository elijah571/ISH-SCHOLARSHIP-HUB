import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const CubeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const OverviewIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ApplicationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const MoreIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);


const TopNavbar = () => {
  const navLinks = [
    { name: 'Scholarships', href: '/scholarships' },
    { name: 'Internships', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Services', href: '#' }
  ];

  return (
    <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center">
          <CubeIcon />
        </div>
        <span className="text-[18px] font-semibold text-gray-800">Scholarships Hub</span>
      </div>

      <div className="flex items-center gap-7">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className="text-[14px] font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center">
        <Button className="px-4 py-2 text-[14px] font-semibold">
          Get Started
        </Button>
        <button className="ml-4.5 text-gray-500">
          <MoonIcon />
        </button>
      </div>
    </header>
  );
};


const Sidebar = () => {
  const menuItems = [
    { name: 'Overview', icon: OverviewIcon, active: true },
    { name: 'Manage Applications', icon: ApplicationIcon, active: false },
    { name: 'Saved Scholarships', icon: BookmarkIcon, active: false },
    { name: 'My Profile', icon: UserIcon, active: false },
    { name: 'Settings', icon: SettingsIcon, active: false }
  ];

  return (
    <aside className="w-[260px] bg-gray-50 border-r border-gray-200 p-6">
      <div className="mb-6">
        <p className="text-[11px] tracking-widest text-gray-400 font-semibold mb-2.5">
          DASHBOARD
        </p>
        {menuItems.slice(0, 3).map((item) => (
          <div
            key={item.name}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-lg cursor-pointer mb-1.5 ${
              item.active
                ? 'bg-blue-50 text-blue-700 font-semibold relative'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.active && (
              <div className="absolute left-0 w-[3px] h-full bg-blue-700 rounded-r" />
            )}
            <item.icon />
            <span className="text-[14px]">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-[11px] tracking-widest text-gray-400 font-semibold mb-2.5">
          ACCOUNT
        </p>
        {menuItems.slice(3).map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-3 px-3.5 py-3 rounded-lg cursor-pointer mb-1.5 text-gray-600 hover:bg-gray-100"
          >
            <item.icon />
            <span className="text-[14px]">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-3 px-3.5 py-3 rounded-lg cursor-pointer text-red-500 hover:bg-red-50">
          <LogoutIcon />
          <span className="text-[14px] font-medium">Logout</span>
        </div>
      </div>
    </aside>
  );
};

const StatCard = ({ icon: IconComponent, iconBg, label, value, badge, badgeColor }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2.5">
    <div className={`w-[42px] h-[42px] rounded-lg flex items-center justify-center ${iconBg}`}>
      <IconComponent />
    </div>
    <p className="text-[13px] text-gray-500">{label}</p>
    <p className="text-[26px] font-bold text-gray-800">{value}</p>
    {badge && (
      <span className={`text-[12px] px-2 py-1 rounded-full w-fit ${badgeColor}`}>
        {badge}
      </span>
    )}
  </div>
);

const ApplicationRow = ({ scholarship, university, country, deadline, status }) => {
  const statusStyles = {
    Submitted: 'bg-blue-100 text-blue-600',
    Approved: 'bg-green-100 text-green-600',
    Draft: 'bg-gray-200 text-gray-600'
  };

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center py-3.5 border-t border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <CubeIcon />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-gray-800">{scholarship}</p>
          <p className="text-[12px] text-gray-500">{university}</p>
        </div>
      </div>
      <p className="text-[14px] text-gray-600">{country}</p>
      <p className="text-[14px] text-gray-600">{deadline}</p>
      <span className={`text-[12px] px-2.5 py-1 rounded-full w-fit ${statusStyles[status]}`}>
        {status}
      </span>
      <div className="flex items-center gap-3">
        <button className="text-blue-600 font-medium text-[14px]">View</button>
        <button className="text-blue-600 font-medium text-[14px]">Edit</button>
        <button className="text-gray-400">
          <MoreIcon />
        </button>
      </div>
    </div>
  );
};

const DashboardPage = () => {

  // TODO: Fetch data from API
  //MOCK DATA
  const applications = [
    { scholarship: 'Fulbright Scholarship', university: 'University of Harvard', country: 'United States', deadline: 'Mar 15, 2024', status: 'Approved' },
    { scholarship: 'Chevening Award', university: 'University of Oxford', country: 'United Kingdom', deadline: 'Mar 20, 2024', status: 'Submitted' },
    { scholarship: 'Eiffel Excellence', university: 'Sciences Po Paris', country: 'France', deadline: 'Apr 01, 2024', status: 'Draft' },
    { scholarship: 'Commonwealth', university: 'University of Toronto', country: 'Canada', deadline: 'Apr 10, 2024', status: 'Submitted' }
  ];

  return (
    <div className="h-screen grid grid-rows-[72px_1fr]">
      {/* <TopNavbar /> */}

      <div className="grid grid-cols-[260px_1fr]">
        <Sidebar />

        <main className="bg-gray-100 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-7">
            <div>
              <h1 className="text-[30px] font-bold text-gray-800">
                Welcome back, Alex!
              </h1>
              <p className="text-[15px] text-gray-500 mt-1">
                Here's what's happening with your scholarship applications today.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 bg-white rounded-lg text-[14px] text-gray-700">
                <FilterIcon />
                Filter
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-lg text-[14px] font-semibold">
                <PlusIcon />
                Find New
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5 mb-6">
            <StatCard
              icon={() => <ApplicationIcon />}
              iconBg="bg-blue-100 text-blue-600"
              label="Total Applications"
              value="24"
              badge="+12%"
              badgeColor="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={() => <div className="text-orange-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>}
              iconBg="bg-amber-100"
              label="In Progress"
              value="8"
              badge="Steady"
              badgeColor="bg-amber-100 text-amber-600"
            />
            <StatCard
              icon={() => <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              iconBg="bg-green-100"
              label="Approved"
              value="5"
              badge="+3 New"
              badgeColor="bg-green-100 text-green-600"
            />
            <StatCard
              icon={() => <BookmarkIcon />}
              iconBg="bg-purple-100 text-purple-600"
              label="Saved"
              value="12"
              badge="+2"
              badgeColor="bg-purple-100 text-purple-600"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-7">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-semibold text-gray-800">
                Recent Scholarship Applications
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="w-60 h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 pl-9 text-[14px] focus:outline-none focus:border-blue-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 text-[12px] text-gray-400 uppercase tracking-wide pb-3 border-b">
              <p>Scholarship Name</p>
              <p>Country</p>
              <p>Deadline</p>
              <p>Status</p>
              <p>Actions</p>
            </div>

            {applications.map((app, idx) => (
              <ApplicationRow key={idx} {...app} />
            ))}

            <div className="flex justify-between items-center mt-3.5">
              <p className="text-[13px] text-gray-500">
                Showing 1 to 4 of 24 applications
              </p>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50">
                  <ChevronLeftIcon />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-700 text-white text-[14px] font-medium">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 text-[14px]">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 text-[14px]">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50">
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[18px] font-semibold text-gray-800">
                  Expert Application Tips
                </h3>
                <Link to="#" className="text-[14px] text-blue-600 font-medium hover:underline">
                  View All
                </Link>
              </div>

              <div className="flex gap-4">
                <div className="w-[90px] h-[90px] rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-gray-800 mb-2">
                    How to write a winning Statement of Purpose
                  </h4>
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-2">
                    Learn the key structures and emotional hooks that admissions committees are looking for in 2024.
                  </p>
                  <p className="text-[12px] text-gray-400">5 min read • 2.4k views</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-700 rounded-xl p-5.5 text-white">
              <h3 className="text-[18px] font-semibold mb-2">
                Need a Boost?
              </h3>
              <p className="text-[14px] text-white/80 mb-3">
                Our experts can review your essay and provide detailed feedback in 24 hours.
              </p>
              <button className="w-full bg-white text-blue-700 py-2.5 px-4 rounded-lg text-[14px] font-semibold">
                Book Essay Review
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
