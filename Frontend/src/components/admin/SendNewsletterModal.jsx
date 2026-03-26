import React, { useState } from 'react';
import Modal from '../Modal';
import api from '../../services/api';

const SendNewsletterModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.subject.trim()) {
      setError('Subject is required');
      setLoading(false);
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      setLoading(false);
      return;
    }
    if (formData.content.trim().length < 10) {
      setError('Content must be at least 10 characters');
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/newsletter/send', formData);
      setSuccess(true);
      setFormData({ subject: '', content: '' });
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send newsletter');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ subject: '', content: '' });
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Send Newsletter"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
            Newsletter sent successfully!
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Newsletter subject line"
            maxLength={100}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.subject.length}/100 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your newsletter content here..."
            rows={10}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            This email will be sent to all subscribers
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || success}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Sending...' : success ? 'Sent!' : 'Send Newsletter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SendNewsletterModal;
