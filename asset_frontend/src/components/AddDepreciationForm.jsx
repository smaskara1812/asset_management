import { useState, useEffect } from 'react';
import { depreciationAPI, assetAPI, depreciationMethodAPI } from '../services/api';
import DynamicForm from './DynamicForm';
import { depreciationFormConfig } from '../config/formConfigs';

const AddDepreciationForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assets, setAssets] = useState([]);
  const [methods, setMethods] = useState([]);

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

  // Create dynamic form config with fetched data
  const getDynamicConfig = () => {
    const config = { ...depreciationFormConfig };
    
    // Update select fields with fetched data
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
      if (field.name === 'method') {
        return { 
          ...field, 
          options: methods.map(method => ({ 
            value: method.method_id, 
            label: method.method_name 
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
      await depreciationAPI.create(formData);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create depreciation record');
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

export default AddDepreciationForm;