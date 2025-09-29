import { useState, useEffect } from 'react';
import { categoryAPI, locationAPI, vendorAPI, statusAPI, assetAPI } from '../services/api';
import DynamicForm from './DynamicForm';
import { assetFormConfig } from '../config/formConfigs';

const AddAssetForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [statuses, setStatuses] = useState([]);

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

  // Create dynamic form config with fetched data
  const getDynamicConfig = () => {
    const config = { ...assetFormConfig };
    
    // Update select fields with fetched data
    config.fields = config.fields.map(field => {
      if (field.name === 'category') {
        return { ...field, options: categories.map(cat => ({ value: cat.category_id, label: cat.category_name })) };
      }
      if (field.name === 'location') {
        return { ...field, options: locations.map(loc => ({ value: loc.location_id, label: loc.location_name })) };
      }
      if (field.name === 'vendor') {
        return { ...field, options: vendors.map(vendor => ({ value: vendor.vendor_id, label: vendor.vendor_name })) };
      }
      if (field.name === 'status') {
        return { ...field, options: statuses.map(status => ({ value: status.status_id, label: status.status_name })) };
      }
      return field;
    });
    
    return config;
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      await assetAPI.create(formData);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create asset');
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

export default AddAssetForm;