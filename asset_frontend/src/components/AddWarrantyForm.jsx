import { useState, useEffect } from 'react';
import { warrantyAPI, assetAPI } from '../services/api';
import DynamicForm from './DynamicForm';
import { warrantyFormConfig } from '../config/formConfigs';

const AddWarrantyForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assets, setAssets] = useState([]);

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

  // Create dynamic form config with fetched data
  const getDynamicConfig = () => {
    const config = { ...warrantyFormConfig };
    
    // Update asset select field with fetched data
    config.fields = config.fields.map(field => {
      if (field.name === 'asset') {
        return { 
          ...field, 
          options: assets.map(asset => ({ 
            value: asset.asset_id, 
            label: `${asset.asset_name} (${asset.asset_code})` 
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
      await warrantyAPI.create(formData);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create warranty');
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

export default AddWarrantyForm;