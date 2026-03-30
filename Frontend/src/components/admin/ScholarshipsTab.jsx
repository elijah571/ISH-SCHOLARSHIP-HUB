import { useState } from 'react';
import { toast } from 'react-toastify';
import { useScholarships } from '../../context/ScholarshipContext';
import { EditIcon, EyeIcon, PlusIcon, SearchIcon, TrashIcon } from '../icons/Icons';
import Loader from '../Loader';
import DeleteConfirmationModal from '../scholarships/DeleteConfirmationModal';
import ScholarshipModal from '../scholarships/ScholarshipModal';
import { useEffect } from 'react';
import Button from '../Button';

export const ScholarshipsTab = () => {
  const [search, setSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const { scholarships, fetchScholarships, createScholarship, updateScholarship, deleteScholarship, loading: contextLoading } = useScholarships();

  useEffect(() => {
    fetchScholarships({ limit: 100 });
  }, [fetchScholarships]);

  const handleCreate = () => {
    setSelectedScholarship(null);
    setShowFormModal(true);
  };

  const handleEdit = (scholarship) => {
    setSelectedScholarship(scholarship);
    setShowFormModal(true);
  };

  const handleDelete = (scholarship) => {
    setSelectedScholarship(scholarship);
    setShowDeleteModal(true);
  };

  const handleView = (scholarship) => {
    window.open(`/scholarships/${scholarship._id || scholarship.id}`, '_blank');
  };

  const handleFormSubmit = async (formData, id) => {
    setLoading(true);
    let result;
    if (id) {
      result = await updateScholarship(id, formData);
    } else {
      result = await createScholarship(formData);
    }
    setLoading(false);
    
    if (result.success) {
      toast.success(id ? 'Scholarship updated successfully.' : 'Scholarship created successfully.');
      setShowFormModal(false);
      setSelectedScholarship(null);
      fetchScholarships({ limit: 100 });
    } else {
      toast.error(result.error || (id ? 'Failed to update scholarship.' : 'Failed to create scholarship.'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedScholarship) return;
    setDeleting(true);
    const result = await deleteScholarship(selectedScholarship._id || selectedScholarship.id);
    setDeleting(false);
    
    if (result.success) {
      toast.success('Scholarship deleted successfully.');
      setShowDeleteModal(false);
      setSelectedScholarship(null);
    } else {
      toast.error(result.error || 'Failed to delete scholarship.');
    }
  };

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.title?.toLowerCase().includes(search.toLowerCase()) ||
    scholarship.country?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDeadlinePassed = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Scholarships</h2>
          <p className="text-gray-500 mt-1">Manage all scholarship listings.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon />
          Add Scholarship
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search scholarships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
          </div>
          <select className="h-10 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500">
            <option value="">All Funding</option>
            <option value="Fully Funded">Fully Funded</option>
            <option value="Partial Funding">Partial Funding</option>
          </select>
        </div>

        {contextLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Country</th>
                  <th className="px-4 py-3 font-semibold">Funding</th>
                  <th className="px-4 py-3 font-semibold">Deadline</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredScholarships.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No scholarships found
                    </td>
                  </tr>
                ) : (
                  filteredScholarships.map((scholarship) => (
                    <tr key={scholarship._id || scholarship.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-gray-800">{scholarship.title}</span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {scholarship.country || '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          scholarship.funding_type === 'Fully Funded' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {scholarship.funding_type || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {formatDate(scholarship.deadline)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isDeadlinePassed(scholarship.deadline) 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isDeadlinePassed(scholarship.deadline) ? 'Closed' : 'Open'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(scholarship)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View"
                          >
                            <EyeIcon />
                          </button>
                          <button
                            onClick={() => handleEdit(scholarship)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(scholarship)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {filteredScholarships.length} of {scholarships.length} scholarships
              </p>
            </div>
          </>
        )}
      </div>

      <ScholarshipModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        scholarship={selectedScholarship}
        loading={loading}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        scholarship={selectedScholarship}
        loading={deleting}
      />
    </div>
  );
};
