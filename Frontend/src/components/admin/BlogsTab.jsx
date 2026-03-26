import { useState } from "react";
import api from "../../services/api";
import { EditIcon, EyeIcon, PlusIcon, SearchIcon, TrashIcon } from "../icons/Icons";
import Loader from "../Loader";
import BlogFormModal from "./BlogFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useCallback } from "react";
import { useEffect } from "react";
import Button from "../Button";

export const BlogsTab = () => {
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/blog');
      setBlogs(data.data || []);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleCreate = () => {
    setSelectedBlog(null);
    setShowFormModal(true);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setShowFormModal(true);
  };

  const handleDelete = (blog) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  const handleView = (blog) => {
    window.open(`/blog/${blog._id}`, '_blank');
  };

  const handleFormSuccess = () => {
    fetchBlogs();
  };

  const handleDeleteSuccess = () => {
    fetchBlogs();
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(search.toLowerCase()) ||
    blog.createdBy?.name?.toLowerCase().includes(search.toLowerCase()) ||
    blog.createdBy?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Blog Posts</h2>
          <p className="text-gray-500 mt-1">Manage all blog content and articles.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <PlusIcon />
          Write Post
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
          </div>
          <select className="h-10 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
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
                  <th className="px-4 py-3 font-semibold">Author</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No blog posts found
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-gray-800">{blog.title}</span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {blog.createdBy?.name || blog.createdBy?.email || 'Admin'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-1 text-xs rounded-full ${blog.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(blog)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View"
                          >
                            <EyeIcon />
                          </button>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(blog)}
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
                Showing {filteredBlogs.length} of {blogs.length} posts
              </p>
            </div>
          </>
        )}
      </div>

      <BlogFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSuccess={handleFormSuccess}
        blog={selectedBlog}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
        item={selectedBlog}
        itemType="blog post"
      />
    </div>
  );
};