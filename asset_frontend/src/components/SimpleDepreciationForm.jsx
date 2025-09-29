import { useState, useEffect } from 'react';
import { depreciationAPI, assetAPI, depreciationMethodAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

const SimpleDepreciationForm = ({ onClose, onSuccess, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    asset: '',
    method: '',
    rate: '',
    book_value: '',
    calculated_on: '',
    notes: '',
  });

  const [assets, setAssets] = useState([]);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, methodsRes] = await Promise.all([
          assetAPI.getAll(),
          depreciationMethodAPI.getAll(),
        ]);
        
        setAssets(assetsRes.data.results || assetsRes.data);
        setMethods(methodsRes.data.results || methodsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        asset: initialData.asset || initialData.asset_id || '',
        method: initialData.method || initialData.method_id || '',
        rate: initialData.rate || '',
        book_value: initialData.book_value || '',
        calculated_on: initialData.calculated_on || '',
        description: initialData.description || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit && initialData) {
        await depreciationAPI.update(initialData.depreciation_id, formData);
      } else {
        await depreciationAPI.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'create'} depreciation record`);
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
          <Label htmlFor="method">
            Depreciation Method *
          </Label>
          <Select
            value={formData.method ? String(formData.method) : ""}
            onValueChange={(value) => setFormData(prev => ({ ...prev, method: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Method" />
            </SelectTrigger>
            <SelectContent>
              {methods.map((method) => (
                <SelectItem key={method.method_id} value={String(method.method_id)}>
                  {method.method_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Depreciation Rate (%) *
          </label>
          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            required
            min="0"
            max="100"
            step="0.01"
            className="input"
            placeholder="e.g., 10.00"
          />
        </div>

        <div>
          <Label htmlFor="book_value">
            Book Value (₹) *
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              type="number"
              name="book_value"
              value={formData.book_value}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="pl-8"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="calculated_on">
            Calculated On *
          </Label>
          <DatePicker
            value={formData.calculated_on}
            onChange={(value) => setFormData(prev => ({ ...prev, calculated_on: value }))}
            placeholder="Select calculation date"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="Additional notes about the depreciation calculation..."
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
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Depreciation Record' : 'Create Depreciation Record')}
        </button>
      </div>
    </form>
  );
};

export default SimpleDepreciationForm;
