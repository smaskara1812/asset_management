import { useState, useEffect } from 'react';
import DynamicFormField from './DynamicFormField';
import FileUpload from './FileUpload';

const DynamicForm = ({ 
  config, 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  loading = false,
  className = "",
  onFieldChange = null
}) => {
  const [formData, setFormData] = useState({});
  const [fileData, setFileData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize form data with initial values only once
    const initialFormData = {};
    config.fields.forEach(field => {
      initialFormData[field.name] = initialData[field.name] || '';
    });
    setFormData(initialFormData);
  }, []); // Empty dependency array - only run once on mount

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Call custom field change handler if provided
    if (onFieldChange) {
      onFieldChange(fieldName, value);
    }
  };

  const handleFileChange = (fieldName, file) => {
    setFileData(prev => ({
      ...prev,
      [fieldName]: file
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
    setError('');

    try {
      const submitData = { ...formData };

      // Handle file uploads
      if (config.fileFields) {
        for (const fileField of config.fileFields) {
          const file = fileData[fileField.name];
          if (file) {
            const base64Data = await convertFileToBase64(file);
            submitData[`${fileField.name}_data`] = base64Data;
            submitData[`${fileField.name}_name`] = file.name;
            submitData[`${fileField.name}_type`] = file.type;
            submitData[`${fileField.name}_size`] = file.size;
          }
        }
      }

      await onSubmit(submitData);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to submit form');
    }
  };

  const renderField = (field) => {
    return (
      <DynamicFormField
        key={field.name}
        field={field}
        value={formData[field.name]}
        onChange={(value) => handleFieldChange(field.name, value)}
        options={field.options || []}
        loading={loading}
      />
    );
  };

  const renderFileField = (fileField) => (
    <FileUpload
      key={fileField.name}
      label={fileField.label}
      value={fileData[fileField.name]}
      onChange={(file) => handleFileChange(fileField.name, file)}
      accept={fileField.accept}
      maxSize={fileField.maxSize}
      helpText={fileField.helpText}
    />
  );

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Regular form fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {config.fields.map(field => renderField(field))}
      </div>

      {/* File upload fields */}
      {config.fileFields && config.fileFields.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Documents & Files</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {config.fileFields.map(fileField => renderFileField(fileField))}
          </div>
        </div>
      )}

      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
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
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
