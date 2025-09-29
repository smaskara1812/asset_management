import { useState } from 'react';
import { vendorAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SimpleVendorForm = ({ onClose, onSuccess, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    vendor_name: initialData?.vendor_name || '',
    contact_person: initialData?.contact_person || '',
    contact_number: initialData?.contact_number || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit && initialData) {
        await vendorAPI.update(initialData.vendor_id, formData);
      } else {
        await vendorAPI.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'create'} vendor`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="vendor_name">
            Vendor Name *
          </Label>
          <Input
            type="text"
            name="vendor_name"
            id="vendor_name"
            value={formData.vendor_name}
            onChange={handleChange}
            required
            placeholder="e.g., Apple Inc., Samsung Electronics"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person
          </label>
          <input
            type="text"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            className="input"
            placeholder="e.g., John Smith"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            className="input"
            placeholder="e.g., +1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="e.g., contact@vendor.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="Vendor address..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Active Vendor
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Vendor' : 'Create Vendor')}
        </button>
      </div>
    </form>
  );
};

export default SimpleVendorForm;
