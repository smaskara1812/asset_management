import { useState, useEffect } from 'react';
import { warrantyAPI, assetAPI } from '../services/api';
import FileUpload from './FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

const SimpleWarrantyForm = ({ onClose, onSuccess, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    asset: '',
    start_date: '',
    end_date: '',
    coverage_details: '',
    warranty_provider: '',
    contact_info: '',
  });

  const [warrantyFile, setWarrantyFile] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await assetAPI.getAll();
        setAssets(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        asset: initialData.asset || initialData.asset_id || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        coverage_details: initialData.coverage_details || '',
        warranty_provider: initialData.warranty_provider || '',
        contact_info: initialData.contact_info || '',
      });
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = { ...formData };

      // Convert file to base64 and add to form data
      if (warrantyFile) {
        const base64Data = await convertFileToBase64(warrantyFile);
        submitData.warranty_document_data = base64Data;
        submitData.warranty_document_name = warrantyFile.name;
        submitData.warranty_document_type = warrantyFile.type;
        submitData.warranty_document_size = warrantyFile.size;
      }

      if (isEdit && initialData) {
        await warrantyAPI.update(initialData.warranty_id, submitData);
      } else {
        await warrantyAPI.create(submitData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'create'} warranty`);
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
          <Label htmlFor="asset">
            Asset *
          </Label>
          <Select
            value={formData.asset ? String(formData.asset) : ""}
            onValueChange={(value) => setFormData(prev => ({ ...prev, asset: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Asset" />
            </SelectTrigger>
            <SelectContent>
              {assets.map((asset) => (
                <SelectItem key={asset.asset_id} value={String(asset.asset_id)}>
                  {asset.asset_name} ({asset.asset_code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warranty Provider
          </label>
          <input
            type="text"
            name="warranty_provider"
            value={formData.warranty_provider}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Apple, Samsung, Dell"
          />
        </div>

        <div>
          <Label htmlFor="start_date">
            Start Date *
          </Label>
          <DatePicker
            value={formData.start_date}
            onChange={(value) => setFormData(prev => ({ ...prev, start_date: value }))}
            placeholder="Select start date"
            required
          />
        </div>

        <div>
          <Label htmlFor="end_date">
            End Date *
          </Label>
          <DatePicker
            value={formData.end_date}
            onChange={(value) => setFormData(prev => ({ ...prev, end_date: value }))}
            placeholder="Select end date"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Coverage Details
        </label>
        <textarea
          name="coverage_details"
          value={formData.coverage_details}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="Describe what is covered under this warranty..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Information
        </label>
        <textarea
          name="contact_info"
          value={formData.contact_info}
          onChange={handleChange}
          rows={2}
          className="input"
          placeholder="Warranty provider contact details..."
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Warranty Document</h3>
        <FileUpload
          label="Warranty Document"
          value={warrantyFile}
          onChange={setWarrantyFile}
          accept="image/*,.pdf"
          maxSize={5 * 1024 * 1024} // 5MB
          helpText="Warranty card, certificate, or documentation"
        />
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
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Warranty' : 'Create Warranty')}
        </button>
      </div>
    </form>
  );
};

export default SimpleWarrantyForm;
