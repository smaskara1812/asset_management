import { useState } from 'react';
import { Download, Eye, File, Image, FileText, X, ExternalLink } from 'lucide-react';

const FileDisplay = ({ 
  fileData, 
  fileName, 
  fileType, 
  fileSize, 
  label,
  onRemove,
  className = ""
}) => {
  const [showPreview, setShowPreview] = useState(false);

  if (!fileData || !fileName) {
    return null;
  }

  const getFileIcon = () => {
    if (fileType?.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = () => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType || 'application/octet-stream' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const openPreview = () => {
    try {
      // Convert base64 to blob URL for preview
      const byteCharacters = atob(fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      
      window.open(url, '_blank');
      
      // Clean up the URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error('Error opening preview:', error);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const getPreviewUrl = () => {
    if (fileType?.startsWith('image/')) {
      return `data:${fileType};base64,${fileData}`;
    }
    return null;
  };

  const previewUrl = getPreviewUrl();

  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
      {label && (
        <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getFileIcon()}
          <div>
            <p className="text-sm font-medium text-gray-900">{fileName}</p>
            <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {previewUrl && (
            <button
              type="button"
              onClick={togglePreview}
              className="text-gray-400 hover:text-gray-600"
              title={showPreview ? "Hide Preview" : "Show Preview"}
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          
          <button
            type="button"
            onClick={openPreview}
            className="text-gray-400 hover:text-gray-600"
            title="Open in New Tab"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            onClick={downloadFile}
            className="text-gray-400 hover:text-blue-600"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-gray-400 hover:text-red-600"
              title="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {previewUrl && showPreview && (
        <div className="mt-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-32 w-full object-cover rounded border"
          />
        </div>
      )}
    </div>
  );
};

export default FileDisplay;
