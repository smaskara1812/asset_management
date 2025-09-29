import { useState, useEffect } from 'react';
import { invoiceAPI, vendorAPI } from '../services/api';
import DynamicForm from './DynamicForm';
import { invoiceFormConfig } from '../config/formConfigs';

const AddInvoiceForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vendors, setVendors] = useState([]);

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

  // Create dynamic form config with fetched data
  const getDynamicConfig = () => {
    const config = { ...invoiceFormConfig };
    
    // Update vendor select field with fetched data
    config.fields = config.fields.map(field => {
      if (field.name === 'vendor') {
        return { 
          ...field, 
          options: vendors.map(vendor => ({ 
            value: vendor.vendor_id, 
            label: vendor.vendor_name 
          })) 
        };
      }
      return field;
    });
    
    return config;
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      await invoiceAPI.create(formData);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create invoice');
      throw error; // Re-throw to let DynamicForm handle it
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <DynamicForm
      config={getDynamicConfig()}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
    />
  );
};

export default AddInvoiceForm;