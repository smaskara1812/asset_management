import { useState, useEffect } from 'react';
import { invoiceAPI, vendorAPI } from '../services/api';
import FileUpload from './FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

const SimpleInvoiceForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    invoice_number: '',
    vendor: '',
    invoice_date: '',
    total_amount: '',
    currency: 'USD',
    description: '',
  });

  const [invoiceFile, setInvoiceFile] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await vendorAPI.getAll();
        setVendors(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

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
      if (invoiceFile) {
        const base64Data = await convertFileToBase64(invoiceFile);
        submitData.invoice_file_data = base64Data;
        submitData.invoice_file_name = invoiceFile.name;
        submitData.invoice_file_type = invoiceFile.type;
        submitData.invoice_file_size = invoiceFile.size;
      }

      await invoiceAPI.create(submitData);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create invoice');
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number *
          </label>
          <input
            type="text"
            name="invoice_number"
            value={formData.invoice_number}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., INV-2024-001"
          />
        </div>

        <div>
          <Label htmlFor="vendor">
            Vendor *
          </Label>
          <Select
            value={formData.vendor}
            onValueChange={(value) => setFormData(prev => ({ ...prev, vendor: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.vendor_id} value={vendor.vendor_id}>
                  {vendor.vendor_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="invoice_date">
            Invoice Date *
          </Label>
          <DatePicker
            value={formData.invoice_date}
            onChange={(value) => setFormData(prev => ({ ...prev, invoice_date: value }))}
            placeholder="Select invoice date"
            required
          />
        </div>

        <div>
          <Label htmlFor="total_amount">
            Total Amount (₹) *
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input
              type="number"
              name="total_amount"
              value={formData.total_amount}
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
          <Label htmlFor="currency">
            Currency *
          </Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
              <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
              <SelectItem value="INR">INR - Indian Rupee</SelectItem>
            </SelectContent>
          </Select>
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
          placeholder="What was purchased..."
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Invoice File</h3>
        <FileUpload
          label="Invoice File"
          value={invoiceFile}
          onChange={setInvoiceFile}
          accept="image/*,.pdf"
          maxSize={5 * 1024 * 1024} // 5MB
          helpText="Upload the invoice or receipt"
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
          {loading ? 'Creating...' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
};

export default SimpleInvoiceForm;
