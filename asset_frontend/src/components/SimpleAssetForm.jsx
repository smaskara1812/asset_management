import { useState, useEffect } from 'react';
import { categoryAPI, locationAPI, vendorAPI, statusAPI, assetAPI } from '../services/api';
import FileUpload from './FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

const SimpleAssetForm = ({ onClose, onSuccess, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    asset_code: '',
    asset_name: '',
    category: '',
    location: '',
    vendor: '',
    status: '',
    purchase_date: '',
    cost: '',
    end_of_life_date: '',
    description: '',
    serial_number: '',
    model_number: '',
    brand: '',
  });

  const [purchaseReceiptFile, setPurchaseReceiptFile] = useState(null);
  const [manualDocumentFile, setManualDocumentFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          categoriesRes,
          locationsRes,
          vendorsRes,
          statusesRes,
        ] = await Promise.all([
          categoryAPI.getAll(),
          locationAPI.getAll(),
          vendorAPI.getAll(),
          statusAPI.getAll(),
        ]);

        setCategories(categoriesRes.data.results || categoriesRes.data);
        setLocations(locationsRes.data.results || locationsRes.data);
        setVendors(vendorsRes.data.results || vendorsRes.data);
        setStatuses(statusesRes.data.results || statusesRes.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, []);

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        asset_code: initialData.asset_code || '',
        asset_name: initialData.asset_name || '',
        category: initialData.category || initialData.category_id || '',
        location: initialData.location || initialData.location_id || '',
        vendor: initialData.vendor || initialData.vendor_id || '',
        status: initialData.status || initialData.status_id || '',
        purchase_date: initialData.purchase_date || '',
        cost: initialData.cost || '',
        end_of_life_date: initialData.end_of_life_date || '',
        description: initialData.description || '',
        serial_number: initialData.serial_number || '',
        model_number: initialData.model_number || '',
        brand: initialData.brand || '',
        notes: initialData.notes || '',
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

  const validateForm = () => {
    const errors = [];

    // Required field validations
    if (!formData.asset_code?.trim()) {
      errors.push('Asset Code is required');
    }
    if (!formData.asset_name?.trim()) {
      errors.push('Asset Name is required');
    }
    if (!formData.category) {
      errors.push('Category is required');
    }
    if (!formData.location) {
      errors.push('Location is required');
    }
    if (!formData.vendor) {
      errors.push('Vendor is required');
    }
    if (!formData.status) {
      errors.push('Status is required');
    }
    if (!formData.purchase_date) {
      errors.push('Purchase Date is required');
    }
    if (!formData.cost || formData.cost <= 0) {
      errors.push('Cost must be greater than 0');
    }

    // Date validations
    if (formData.purchase_date && formData.end_of_life_date) {
      const purchaseDate = new Date(formData.purchase_date);
      const endOfLifeDate = new Date(formData.end_of_life_date);
      if (endOfLifeDate <= purchaseDate) {
        errors.push('End of Life Date must be after Purchase Date');
      }
    }

    // Cost validation
    if (formData.cost && (isNaN(formData.cost) || formData.cost < 0)) {
      errors.push('Cost must be a valid positive number');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError('Please fix the following errors:\n• ' + validationErrors.join('\n• '));
      setLoading(false);
      return;
    }

    try {
      const submitData = { ...formData };

      // Convert files to base64 and add to form data
      if (purchaseReceiptFile) {
        const base64Data = await convertFileToBase64(purchaseReceiptFile);
        submitData.purchase_receipt_data = base64Data;
        submitData.purchase_receipt_name = purchaseReceiptFile.name;
        submitData.purchase_receipt_type = purchaseReceiptFile.type;
        submitData.purchase_receipt_size = purchaseReceiptFile.size;
      }

      if (manualDocumentFile) {
        const base64Data = await convertFileToBase64(manualDocumentFile);
        submitData.manual_document_data = base64Data;
        submitData.manual_document_name = manualDocumentFile.name;
        submitData.manual_document_type = manualDocumentFile.type;
        submitData.manual_document_size = manualDocumentFile.size;
      }

      if (isEdit && initialData) {
        await assetAPI.update(initialData.asset_id, submitData);
      } else {
        await assetAPI.create(submitData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
      if (errorMessage) {
        setError(`Failed to ${isEdit ? 'update' : 'create'} asset: ${errorMessage}`);
      } else {
        setError(`Failed to ${isEdit ? 'update' : 'create'} asset. Please check all required fields and try again.`);
      }
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
          <Label htmlFor="asset_code">
            Asset Code *
          </Label>
          <Input
            type="text"
            name="asset_code"
            id="asset_code"
            value={formData.asset_code}
            onChange={handleChange}
            required
            placeholder="e.g., LAPTOP-001, TV-001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset Name *
          </label>
          <input
            type="text"
            name="asset_name"
            value={formData.asset_name}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., MacBook Pro 16\"
          />
        </div>

        <div>
          <Label htmlFor="category">
            Category *
          </Label>
          <Select
            value={formData.category ? String(formData.category) : ""}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.category_id} value={String(category.category_id)}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        <div>
          <Label htmlFor="location">
            Location *
          </Label>
          <Select
            value={formData.location ? String(formData.location) : ""}
            onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.location_id} value={String(location.location_id)}>
                  {location.location_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="vendor">
            Vendor *
          </Label>
          <Select
            value={formData.vendor ? String(formData.vendor) : ""}
            onValueChange={(value) => setFormData(prev => ({ ...prev, vendor: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.vendor_id} value={String(vendor.vendor_id)}>
                  {vendor.vendor_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">
            Status *
          </Label>
          <Select
            value={formData.status ? String(formData.status) : ""}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.status_id} value={String(status.status_id)}>
                  {status.status_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="purchase_date">
            Purchase Date *
          </Label>
          <DatePicker
            value={formData.purchase_date}
            onChange={(value) => setFormData(prev => ({ ...prev, purchase_date: value }))}
            placeholder="Select purchase date"
            required
          />
        </div>

        <div>
          <Label htmlFor="cost">
            Cost (₹) *
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className="pl-8"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="end_of_life_date">
            End of Life Date
          </Label>
          <DatePicker
            value={formData.end_of_life_date}
            onChange={(value) => setFormData(prev => ({ ...prev, end_of_life_date: value }))}
            placeholder="Select end of life date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number
          </label>
          <input
            type="text"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            className="input"
            placeholder="e.g., ABC123456789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model Number
          </label>
          <input
            type="text"
            name="model_number"
            value={formData.model_number}
            onChange={handleChange}
            className="input"
            placeholder="e.g., MBP16-2023, QN55Q80A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Apple, Samsung, Dell"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="Additional details about this asset..."
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Documents & Files</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FileUpload
            label="Purchase Receipt"
            value={purchaseReceiptFile}
            onChange={setPurchaseReceiptFile}
            accept="image/*,.pdf"
            maxSize={5 * 1024 * 1024} // 5MB
            helpText="Receipt, invoice, or proof of purchase"
          />
          
          <FileUpload
            label="User Manual/Documentation"
            value={manualDocumentFile}
            onChange={setManualDocumentFile}
            accept=".pdf,.doc,.docx,image/*"
            maxSize={10 * 1024 * 1024} // 10MB
            helpText="User manual, warranty card, or other documentation"
          />
        </div>
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
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Asset' : 'Create Asset')}
        </button>
      </div>
    </form>
  );
};

export default SimpleAssetForm;
