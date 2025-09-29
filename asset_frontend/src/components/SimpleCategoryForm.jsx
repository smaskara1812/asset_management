import { useState } from 'react';
import { categoryAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SimpleCategoryForm = ({ onClose, onSuccess, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    category_name: initialData?.category_name || '',
    description: initialData?.description || '',
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
        await categoryAPI.update(initialData.category_id, formData);
      } else {
        await categoryAPI.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'create'} category`);
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

      <div>
        <Label htmlFor="category_name">
          Category Name *
        </Label>
        <Input
          type="text"
          name="category_name"
          id="category_name"
          value={formData.category_name}
          onChange={handleChange}
          required
          placeholder="e.g., Electronics, Furniture, Vehicles"
        />
      </div>

      <div>
        <Label htmlFor="description">
          Description
        </Label>
        <Textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Brief description of the category..."
        />
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
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Category' : 'Create Category')}
        </Button>
      </div>
    </form>
  );
};

export default SimpleCategoryForm;
