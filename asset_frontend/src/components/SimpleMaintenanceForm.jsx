import { useState, useEffect } from 'react';
import { maintenanceAPI, assetAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

const SimpleMaintenanceForm = ({ onClose, onSuccess, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    asset: '',
    maintenance_type: 'preventive',
    performed_on: '',
    performed_by: '',
    cost: '',
    remarks: '',
    next_maintenance_date: '',
  });

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const maintenanceTypes = [
    { value: 'preventive', label: 'Preventive' },
    { value: 'corrective', label: 'Corrective' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'upgrade', label: 'Upgrade' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'inspection', label: 'Inspection' }
  ];

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
        maintenance_type: initialData.maintenance_type || 'preventive',
        performed_on: initialData.performed_on || '',
        performed_by: initialData.performed_by || '',
        cost: initialData.cost || '',
        description: initialData.description || '',
        next_maintenance_date: initialData.next_maintenance_date || '',
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
        await maintenanceAPI.update(initialData.maintenance_id, formData);
      } else {
        await maintenanceAPI.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'create'} maintenance record`);
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
            value={formData.asset}
            onValueChange={(value) => setFormData(prev => ({ ...prev, asset: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Asset" />
            </SelectTrigger>
            <SelectContent>
              {assets.map((asset) => (
                <SelectItem key={asset.asset_id} value={asset.asset_id}>
                  {asset.asset_name} ({asset.asset_code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="maintenance_type">
            Maintenance Type *
          </Label>
          <Select
            value={formData.maintenance_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, maintenance_type: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {maintenanceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="performed_on">
            Performed On *
          </Label>
          <DatePicker
            value={formData.performed_on}
            onChange={(value) => setFormData(prev => ({ ...prev, performed_on: value }))}
            placeholder="Select performance date"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Performed By *
          </label>
          <input
            type="text"
            name="performed_by"
            value={formData.performed_by}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., John Smith or ABC Maintenance Co."
          />
        </div>

        <div>
          <Label htmlFor="cost">
            Cost (₹)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="pl-8"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="next_maintenance_date">
            Next Maintenance Date
          </Label>
          <DatePicker
            value={formData.next_maintenance_date}
            onChange={(value) => setFormData(prev => ({ ...prev, next_maintenance_date: value }))}
            placeholder="Select next maintenance date"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remarks
        </label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="Describe the maintenance work performed..."
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
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Maintenance Record' : 'Create Maintenance Record')}
        </button>
      </div>
    </form>
  );
};

export default SimpleMaintenanceForm;
