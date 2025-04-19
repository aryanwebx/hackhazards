import React, { useState, useRef } from 'react';
import { Upload, FileType, X, Loader2 } from 'lucide-react';

const FileUploader = ({colorbtn ,hvcolor}) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError('');
    
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileInput = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;
    
    // Only check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to analyze');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate file processing delay
    setTimeout(() => {
      setIsLoading(false);
      // you would handle the file upload and processing here
      // navigate to results page or update UI with analysis results
    }, 2000);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <div className="text-red-500"><FileType className="h-6 w-6" /></div>;
      case 'txt':
        return <div className="text-blue-500"><FileType className="h-6 w-6" /></div>;
      case 'doc':
      case 'docx':
        return <div className="text-blue-700"><FileType className="h-6 w-6" /></div>;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
        return <div className="text-green-500"><FileType className="h-6 w-6" /></div>;
      default:
        return <div className="text-gray-500"><FileType className="h-6 w-6" /></div>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 text-center cursor-pointer relative ${
            isDragging 
              ? 'border-indigo-600 bg-indigo-50' 
              : 'border-gray-500 hover:border-indigo-300 bg-gray-100'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-12 w-12 text-indigo-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">Drag & drop your file here</h3>
            <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
            <p className="text-xs text-gray-400">Accepts all file types (Max 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileTypeIcon(file.name)}
              <div>
                <p className="font-medium text-gray-800 text-sm truncate max-w-[250px]">
                  {file.name}
                </p>
                <p className="flex text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={removeFile}
              className="text-gray-500 hover:text-red-500 cursor-pointer"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-red-500 text-sm animate-fade-in">
          {error}
        </p>
      )}
      
      <div className="mt-4">
        <button
          type="submit"
          disabled={!file || isLoading}
          className={`w-full ${colorbtn} ${hvcolor} text-white cursor-pointer font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center ${
            (!file || isLoading) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Analyzing file...
            </>
          ) : (
            'Analyze File'
          )}
        </button>
      </div>
    </form>
  );
};

export default FileUploader;