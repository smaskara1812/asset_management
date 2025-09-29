import { useState, useEffect, useMemo } from 'react';
import { categoryAPI, locationAPI, vendorAPI, statusAPI, assetAPI } from '../services/api';
import DynamicForm from './DynamicForm';
import { assetFormConfig, getCategorySpecificFields } from '../config/formConfigs';

const SmartAssetForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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

  // Create dynamic form config with fetched data and category-specific fields
  const dynamicConfig = useMemo(() => {
    const config = { ...assetFormConfig };
    
    // Update select fields with fetched data
    config.fields = config.fields.map(field => {
      if (field.name === 'category') {
        return { 
          ...field, 
          options: categories.map(cat => ({ value: cat.category_id, label: cat.category_name }))
        };
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

    // Add category-specific fields
    if (selectedCategory) {
      const categoryFields = getCategorySpecificFields(selectedCategory);
      if (categoryFields.length > 0) {
        // Insert category-specific fields after the basic fields
        const basicFieldsEndIndex = config.fields.findIndex(field => field.name === 'description');
        if (basicFieldsEndIndex !== -1) {
          config.fields.splice(basicFieldsEndIndex, 0, ...categoryFields);
        } else {
          config.fields.push(...categoryFields);
        }
      }
    }
    
    return config;
  }, [categories, locations, vendors, statuses, selectedCategory]);

  // Handle category change to show category-specific fields
  const handleCategoryChange = (value) => {
    const category = categories.find(cat => cat.category_id == value);
    if (category) {
      setSelectedCategory(category.category_name);
    } else {
      setSelectedCategory('');
    }
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
    <div className="space-y-4">
      {selectedCategory && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Smart Form Active
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Additional fields for <strong>{selectedCategory}</strong> category have been added to help you track specific details.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <DynamicForm
        config={dynamicConfig}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        onFieldChange={(fieldName, value) => {
          if (fieldName === 'category') {
            handleCategoryChange(value);
          }
        }}
      />
    </div>
  );
};

export default SmartAssetForm;
