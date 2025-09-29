import { useState, useEffect } from 'react';
import { maintenanceAPI, assetAPI } from '../services/api';
import DynamicForm from './DynamicForm';
import { maintenanceFormConfig } from '../config/formConfigs';

const AddMaintenanceForm = ({ onClose, onSuccess }) => {
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
    const config = { ...maintenanceFormConfig };
    
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
      await maintenanceAPI.create(formData);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create maintenance record');
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

export default AddMaintenanceForm;