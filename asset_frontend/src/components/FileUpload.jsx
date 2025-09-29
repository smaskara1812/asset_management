import { useState, useRef } from 'react';
import { Upload, X, Eye, Download, File, Image, FileText } from 'lucide-react';

const FileUpload = ({ 
  label, 
  value, 
  onChange, 
  accept = "image/*,.pdf,.doc,.docx", 
  maxSize = 10 * 1024 * 1024, // 10MB
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileName.endsWith(type);
      } else if (type.includes('/*')) {
        return fileType.startsWith(type.replace('/*', '/'));
      } else {
        return fileType === type;
      }
    });

    if (!isValidType) {
      setError('Invalid file type. Please select a valid file.');
      return;
    }

    setError('');
    onChange(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = () => {
    onChange(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file) => {
    if (!file) return <File className="h-8 w-8 text-gray-400" />;
    
    const fileName = file.name.toLowerCase();
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (fileName.endsWith('.pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      {!value ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-primary-600 hover:text-primary-500">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {accept.includes('image/*') ? 'Images, PDF, DOC, DOCX' : 'PDF, DOC, DOCX'} up to {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(value)}
              <div>
                <p className="text-sm font-medium text-gray-900">{value.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(value.size)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {preview && (
                <button
                  type="button"
                  onClick={() => window.open(preview, '_blank')}
                  className="text-gray-400 hover:text-gray-600"
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={removeFile}
                className="text-gray-400 hover:text-red-600"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview"
                className="h-32 w-full object-cover rounded border"
              />
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
