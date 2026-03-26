import React from 'react';
import Modal from '../Modal';
import Button from '../Button';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, scholarship, loading }) => {
  if (!scholarship) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Scholarship"
      size="sm"
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Delete Scholarship?
        </h3>

        <p className="text-gray-600 mb-1">
          Are you sure you want to delete <span className="font-medium">{scholarship.title}</span>?
        </p>

        <p className="text-sm text-gray-500 mb-6">
          This action cannot be undone. The scholarship will be permanently removed.
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Deleting...
              </span>
            ) : (
              'Delete Scholarship'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
