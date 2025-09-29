import { useState } from 'react';
import { locationAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SimpleLocationForm = ({ onClose, onSuccess, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    location_name: initialData?.location_name || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    country: initialData?.country || '',
    postal_code: initialData?.postal_code || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        await locationAPI.update(initialData.location_id, formData);
      } else {
        await locationAPI.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'create'} location`);
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
          <Label htmlFor="location_name">
            Location Name *
          </Label>
          <Input
            type="text"
            name="location_name"
            id="location_name"
            value={formData.location_name}
            onChange={handleChange}
            required
            placeholder="e.g., Main Office, Warehouse A"
          />
        </div>

        <div>
          <Label htmlFor="address">
            Address *
          </Label>
          <Input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Street address"
          />
        </div>

        <div>
          <Label htmlFor="city">
            City
          </Label>
          <Input
            type="text"
            name="city"
            id="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City name"
          />
        </div>

        <div>
          <Label htmlFor="state">
            State/Province
          </Label>
          <Input
            type="text"
            name="state"
            id="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State or province"
          />
        </div>

        <div>
          <Label htmlFor="country">
            Country
          </Label>
          <Input
            type="text"
            name="country"
            id="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country name"
          />
        </div>

        <div>
          <Label htmlFor="postal_code">
            Postal Code
          </Label>
          <Input
            type="text"
            name="postal_code"
            id="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="ZIP or postal code"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Location' : 'Create Location')}
        </Button>
      </div>
    </form>
  );
};

export default SimpleLocationForm;
