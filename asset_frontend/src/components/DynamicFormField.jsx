import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Hash, FileText, User, Building, MapPin, Package, Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DynamicFormField = ({ 
  field, 
  value, 
  onChange, 
  options = [], 
  loading = false,
  className = "" 
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (field.type === 'select' && options.length > 0) {
      setFilteredOptions(options);
    }
  }, [options, field.type]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    // Auto-suggestions for text inputs
    if (field.type === 'text' && field.suggestions && newValue.length > 0) {
      const filtered = field.suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const getFieldIcon = () => {
    const iconClass = "h-4 w-4 text-gray-400";
    
    switch (field.name) {
      case 'purchase_date':
      case 'start_date':
      case 'end_date':
      case 'performed_on':
      case 'calculated_on':
        return <Calendar className={iconClass} />;
      case 'cost':
      case 'total_amount':
      case 'book_value':
        return <DollarSign className={iconClass} />;
      case 'asset_code':
      case 'serial_number':
      case 'model_number':
      case 'rate':
        return <Hash className={iconClass} />;
      case 'description':
      case 'coverage_details':
      case 'remarks':
      case 'notes':
        return <FileText className={iconClass} />;
      case 'performed_by':
      case 'contact_person':
        return <User className={iconClass} />;
      case 'department':
      case 'vendor':
        return <Building className={iconClass} />;
      case 'location':
        return <MapPin className={iconClass} />;
      case 'category':
        return <Package className={iconClass} />;
      case 'warranty_provider':
        return <Shield className={iconClass} />;
      default:
        return null;
    }
  };

  const getInputType = () => {
    if (field.type === 'number') {
      if (field.name.includes('date') || field.name.includes('year')) {
        return 'number';
      }
      if (field.name.includes('cost') || field.name.includes('amount') || field.name.includes('value')) {
        return 'number';
      }
      if (field.name.includes('rate') || field.name.includes('percentage')) {
        return 'number';
      }
    }
    if (field.type === 'date') return 'date';
    if (field.type === 'email') return 'email';
    if (field.type === 'tel') return 'tel';
    if (field.type === 'url') return 'url';
    return 'text';
  };

  const getPlaceholder = () => {
    if (field.placeholder) return field.placeholder;
    
    switch (field.name) {
      case 'asset_name':
        return 'e.g., MacBook Pro 16", Samsung 55" TV';
      case 'asset_code':
        return 'e.g., LAPTOP-001, TV-001';
      case 'serial_number':
        return 'e.g., ABC123456789';
      case 'model_number':
        return 'e.g., MBP16-2023, QN55Q80A';
      case 'brand':
        return 'e.g., Apple, Samsung, Dell';
      case 'cost':
        return '0.00';
      case 'rate':
        return '10.00';
      case 'book_value':
        return '0.00';
      case 'performed_by':
        return 'e.g., John Smith or ABC Maintenance Co.';
      case 'warranty_provider':
        return 'e.g., Apple, Samsung, Dell';
      case 'contact_person':
        return 'e.g., John Smith';
      case 'email':
        return 'e.g., john@company.com';
      case 'contact_number':
        return 'e.g., +1 (555) 123-4567';
      default:
        return field.label;
    }
  };

  const getValidationAttributes = () => {
    const attrs = {};
    
    if (field.required) attrs.required = true;
    if (field.min) attrs.min = field.min;
    if (field.max) attrs.max = field.max;
    if (field.minLength) attrs.minLength = field.minLength;
    if (field.maxLength) attrs.maxLength = field.maxLength;
    if (field.step) attrs.step = field.step;
    
    // Auto-validation based on field type
    if (field.name.includes('cost') || field.name.includes('amount') || field.name.includes('value')) {
      attrs.min = 0;
      attrs.step = 0.01;
    }
    if (field.name.includes('rate') || field.name.includes('percentage')) {
      attrs.min = 0;
      attrs.max = 100;
      attrs.step = 0.01;
    }
    if (field.type === 'email') {
      attrs.pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
    }
    
    return attrs;
  };

  const renderField = () => {
    const baseClasses = "input";
    const iconClasses = "absolute left-3 top-1/2 transform -translate-y-1/2";
    const inputClasses = field.icon ? "pl-10" : "";

    if (field.type === 'select') {
      return (
        <div className="relative">
          {field.icon && (
            <div className={iconClasses}>
              {getFieldIcon()}
            </div>
          )}
          <Select
            value={inputValue ? String(inputValue) : ""}
            onValueChange={(value) => {
              setInputValue(value);
              onChange(value);
            }}
            disabled={loading}
          >
            <SelectTrigger className={`${inputClasses} ${className}`}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value || option} value={String(option.value || option)}>
                  {option.label || option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div className="relative">
          {field.icon && (
            <div className="absolute left-3 top-3">
              {getFieldIcon()}
            </div>
          )}
          <textarea
            name={field.name}
            value={inputValue}
            onChange={handleInputChange}
            rows={field.rows || 3}
            className={`${baseClasses} ${inputClasses} ${className}`}
            placeholder={getPlaceholder()}
            {...getValidationAttributes()}
            disabled={loading}
          />
        </div>
      );
    }

    // Text, number, date, email, etc.
    return (
      <div className="relative">
        {field.icon && (
          <div className={iconClasses}>
            {getFieldIcon()}
          </div>
        )}
        <input
          type={getInputType()}
          name={field.name}
          value={inputValue}
          onChange={handleInputChange}
          className={`${baseClasses} ${inputClasses} ${className}`}
          placeholder={getPlaceholder()}
          {...getValidationAttributes()}
          disabled={loading}
          autoComplete={field.autoComplete || 'off'}
        />
        
        {/* Auto-suggestions dropdown */}
        {showSuggestions && field.suggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        {field.helpText && (
          <span className="text-xs text-gray-500 ml-2">({field.helpText})</span>
        )}
      </label>
      {renderField()}
      {field.description && (
        <p className="text-xs text-gray-500 mt-1">{field.description}</p>
      )}
    </div>
  );
};

export default DynamicFormField;
