import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { TableRow } from "../../pages/AdminDashboardPage";
import { PlusIcon, SearchIcon, EditIcon, EyeIcon, TrashIcon } from "../icons/Icons";
import Button from "../Button";
import Loader from "../Loader";
import api from "../../services/api";
import InternshipFormModal from "./InternshipFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export const InternshipsTab = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchInternships = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search,
        type: typeFilter,
      });
      const { data } = await api.get(`/api/internship?${params}`);
      setInternships(data.internships || data.data || []);
      if (data.pagination) {
        setPagination({
          total: data.pagination.total,
          pages: data.pagination.totalPages,
        });
      }
    } catch (err) {
      console.error('Failed to fetch internships:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, typeFilter]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

  const handleCreate = () => {
    setSelectedInternship(null);
    setShowFormModal(true);
  };

  const handleEdit = (internship) => {
    setSelectedInternship(internship);
    setShowFormModal(true);
  };

  const handleDelete = (internship) => {
    setSelectedInternship(internship);
    setShowDeleteModal(true);
  };

  const handleView = (internship) => {
    console.log('View internship:', internship);
  };

  const handleFormSubmit = async (formData, id) => {
    setFormLoading(true);
    try {
      if (id) {
        await api.patch(`/api/internship/${id}`, formData);
        toast.success("Internship updated successfully");
      } else {
        await api.post('/api/internship/create', formData);
        toast.success("Internship created successfully");
      }
      setShowFormModal(false);
      fetchInternships();
    } catch (err) {
      console.error('Failed to save internship:', err);
      toast.error("Failed to save internship");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSuccess = () => {
    fetchInternships();
    toast.success("Internship deleted successfully");
  };

  const filteredInternships = internships.filter(internship =>
    internship.title?.toLowerCase().includes(search.toLowerCase()) ||
    internship.institution?.toLowerCase().includes(search.toLowerCase()) ||
    internship.country?.toLowerCase().includes(search.toLowerCase())
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

  const columns = [
    { key: 'title', render: (val) => <span className="font-medium text-gray-800">{val}</span> },
    { key: 'institution' },
    { key: 'country' },
    { key: 'type', render: (val) => (
      <span className={`px-2 py-1 text-xs rounded-full ${val === 'Paid' ? 'bg-green-100 text-green-700' : val === 'Stipend' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
        {val}
      </span>
    )},
    { key: 'deadline', render: (val) => (
      <span className={isDeadlinePassed(val) ? 'text-red-500' : ''}>
        {formatDate(val)}
      </span>
    )},
    { key: 'deadline', render: (val) => (
      <span className={`px-2 py-1 text-xs rounded-full ${isDeadlinePassed(val) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        {isDeadlinePassed(val) ? 'Closed' : 'Open'}
      </span>
    )},
    { key: 'createdAt', render: () => 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Internships</h2>
          <p className="text-gray-500 mt-1">Manage all internship listings.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon />
          Add Internship
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search internships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
          </div>
          <select 
            className="h-10 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Paid">Paid</option>
            <option value="Stipend">Stipend</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Deadline</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredInternships.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No internships found
                    </td>
                  </tr>
                ) : (
                  filteredInternships.map((internship) => (
                    <tr key={internship._id || internship.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-gray-800">{internship.title}</span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {internship.institution || '-'}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {internship.country || '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          internship.type === 'Paid' ? 'bg-green-100 text-green-700' : 
                          internship.type === 'Stipend' ? 'bg-blue-100 text-blue-700' : 
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {internship.type || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {formatDate(internship.deadline)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isDeadlinePassed(internship.deadline) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {isDeadlinePassed(internship.deadline) ? 'Closed' : 'Open'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(internship)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View"
                          >
                            <EyeIcon />
                          </button>
                          <button
                            onClick={() => handleEdit(internship)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(internship)}
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
                Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, pagination.total)} of {pagination.total} internships
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">1</button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-1.5 rounded border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <InternshipFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        internship={selectedInternship}
        loading={formLoading}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
        item={selectedInternship}
        itemType="internship"
        deleteEndpoint={`/api/internship/${selectedInternship?._id}`}
      />
    </div>
  );
};
