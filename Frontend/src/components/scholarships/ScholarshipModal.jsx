import React, { useState, useCallback } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { getNames } from 'country-list';

const FIELD_OF_STUDY_OPTIONS = [
  'All Fields', 'Computer Science', 'Engineering', 'Business & Management',
  'Medicine & Health', 'Law', 'Arts & Humanities', 'Social Sciences', 'Natural Sciences',
];

const EMPTY_FORM = {
  title: '',
  description: '',
  country: '',
  deadline: '',
  funding_type: '',
  duration: '',
  link: '',
  fieldOfStudy: '',
  imageUrl: '',
};

// get all countries
const countries = getNames();

const getInitialFormData = (scholarship) => {
  if (!scholarship) return EMPTY_FORM;
  return {
    title: scholarship.title || '',
    description: scholarship.description || '',
    country: scholarship.country || '',
    deadline: scholarship.deadline ? scholarship.deadline.split('T')[0] : '',
    funding_type: scholarship.fundingType || scholarship.funding_type || '',
    duration: scholarship.duration || '',
    link: scholarship.link || '',
    fieldOfStudy: scholarship.fieldOfStudy || '',
    imageUrl: scholarship.imageUrl || scholarship.image?.url || scholarship.image || '',
  };
};

const ScholarshipModal = ({ isOpen, onClose, onSubmit, scholarship, loading }) => {
  const isEdit = !!scholarship;
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [useUrl, setUseUrl] = useState(true);


  const initForm = useCallback(() => {
    const initialData = getInitialFormData(scholarship);
    setFormData(initialData);
    setImagePreview(scholarship?.image?.url || scholarship?.image || '');
    setImageFile(null);
    setUseUrl(true);
    setErrors({});
  }, [scholarship]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, imageUrl: value }));
    setImageFile(null);
    if (value) {
      setImagePreview(value);
    } else {
      setImagePreview('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    if (!formData.funding_type) newErrors.funding_type = 'Funding type is required';
    if (!formData.link.trim()) newErrors.link = 'Application link is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('description', formData.description.trim());
    data.append('country', formData.country.trim());
    data.append('deadline', formData.deadline);
    data.append('funding_type', formData.funding_type);
    if (formData.duration) data.append('duration', formData.duration.trim());
    if (formData.fieldOfStudy) data.append('fieldOfStudy', formData.fieldOfStudy);
    if (formData.link) data.append('link', formData.link.trim());
    if (imageFile) {
      data.append('image', imageFile);
    }

    onSubmit(data, scholarship?.id || scholarship?.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Scholarship' : 'Add New Scholarship'}
      size="lg"
      key={scholarship?.id || scholarship?.id || 'new'}
      onOpen={initForm}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Fulbright Scholarship"
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.title ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the scholarship details, requirements, and benefits..."
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select 
            name="country" 
            id="country" 
            value={formData.country} 
            onChange={handleChange}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.country ? 'border-red-500' : 'border-gray-200'
            }`}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funding Type <span className="text-red-500">*</span>
            </label>
            <select
              name="funding_type"
              value={formData.funding_type}
              onChange={handleChange}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white ${
                errors.funding_type ? 'border-red-500' : 'border-gray-200'
              }`}
            >
              <option value="">Select funding type</option>
              <option value="Fully Funded">Fully Funded</option>
              <option value="Partial Funding">Partial Funding</option>
              <option value="Self-Funded">Self-Funded</option>
            </select>
            {errors.funding_type && <p className="mt-1 text-sm text-red-600">{errors.funding_type}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.deadline ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 2 years"
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field of Study
          </label>
          <select
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
          >
            <option value="">Select field of study</option>
            {FIELD_OF_STUDY_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Application Link
          </label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com/apply"
            className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <div className="flex gap-3 mb-3">
            <button
              type="button"
              onClick={() => setUseUrl(true)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                useUrl
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setUseUrl(false)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !useUrl
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upload File
            </button>
          </div>

          {useUrl ? (
            <div>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter an image URL or switch to file upload
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </label>
            </div>
          )}

          {imagePreview && (
            <div className="mt-3 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
                onError={() => setImagePreview('')}
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview('');
                  setImageFile(null);
                  setFormData((prev) => ({ ...prev, imageUrl: '' }));
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isEdit ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEdit ? 'Update Scholarship' : 'Create Scholarship'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ScholarshipModal;
