import { useState } from "react";
import { MailIcon } from "../icons/Icons";
import SendNewsletterModal from "./SendNewsletterModal";
import Button from "../Button";


export const NewsletterTab = () => {
  const [showSendModal, setShowSendModal] = useState(false);
  const [stats, setStats] = useState({
    totalSubscribers: 1250,
    sentNewsletters: 24,
  });

  const handleSendSuccess = () => {
    setStats(prev => ({
      ...prev,
      sentNewsletters: prev.sentNewsletters + 1,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Newsletter</h2>
          <p className="text-gray-500 mt-1">Manage your email subscribers and send newsletters.</p>
        </div>
        <Button onClick={() => setShowSendModal(true)} className="flex items-center gap-2">
          <MailIcon />
          Send Newsletter
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MailIcon />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalSubscribers.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Subscribers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.sentNewsletters}</p>
              <p className="text-sm text-gray-500">Newsletters Sent</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">Send New Newsletter</p>
              <p className="text-sm text-gray-500">Email all subscribers</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">View History</p>
              <p className="text-sm text-gray-500">See sent newsletters</p>
            </div>
          </button>
        </div>
      </div>

      <SendNewsletterModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSuccess={handleSendSuccess}
      />
    </div>
  );
};