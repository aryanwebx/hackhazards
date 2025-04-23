import React, { useState, useRef } from 'react';
import { Upload, FileType, X, Loader2, AlertCircle,ShieldCheck,ShieldX,Info,FileText, } from 'lucide-react';
import axios from 'axios';
import mammoth from 'mammoth';

const FileUploader = ({ colorbtn = 'bg-indigo-600', hvcolor = 'hover:bg-indigo-700' }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(true);
  const fileInputRef = useRef(null);

  // Supported file types
  const supportedAudioFormats = ['audio/flac', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/webm'];
  const supportedImageFormats = ['image/jpeg', 'image/png', 'image/webp'];
  const supportedTextExtensions = ['txt', 'doc', 'docx'];

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
    setResult(null);

    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileInput = (e) => {
    setError('');
    setResult(null);
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    // Check file type
    const extension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    if (
      !supportedAudioFormats.includes(selectedFile.type) &&
      !supportedImageFormats.includes(selectedFile.type) &&
      !supportedTextExtensions.includes(extension)
    ) {
      setError('Unsupported file type. Please upload audio, image, or text files (.txt, .doc, .docx).');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to analyze');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      let response;

      // Route based on file type
      if (supportedAudioFormats.includes(file.type)) {
        const formData = new FormData();
        formData.append('audio', file);
        response = await axios.post('http://localhost:3001/moderate-audio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else if (supportedImageFormats.includes(file.type)) {
        const formData = new FormData();
        formData.append('image', file);
        response = await axios.post('http://localhost:3001/moderate-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else if (supportedTextExtensions.includes(extension)) {
        let textContent = '';
        const arrayBuffer = await file.arrayBuffer();

        if (extension === 'txt') {
          textContent = await file.text();
        } else if (extension === 'docx') {
          const result = await mammoth.extractRawText({ arrayBuffer });
          textContent = result.value;
        } else if (extension === 'doc') {
          setError('Text extraction for .doc files is not fully supported client-side. Please convert to .docx or .txt.');
          setIsLoading(false);
          return;
        }

        if (!textContent) {
          setError('Failed to extract text from the file.');
          setIsLoading(false);
          return;
        }

        response = await axios.post('http://localhost:3001/moderate-text', {
          text: textContent,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // Validate and set result
      if (response.data && (response.data.result || response.data.error)) {
        setResult(response.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze file. Please try again.');
      console.error('Upload error:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    switch (extension) {
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
      case 'mp3':
      case 'wav':
      case 'm4a':
      case 'ogg':
      case 'flac':
      case 'webm':
        return <div className="text-purple-500"><FileType className="h-6 w-6" /></div>;
      default:
        return <div className="text-gray-500"><FileType className="h-6 w-6" /></div>;
    }
  };

  const getClassificationText = (classification) => {
    if (!classification) return 'Unknown';
    return classification.charAt(0).toUpperCase() + classification.slice(1);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
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
              accept="audio/*,image/jpeg,image/png,image/webp,.txt,.doc,.docx"
            />
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="h-12 w-12 text-indigo-500 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">Drag & drop your file here</h3>
              <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
              <p className="text-xs text-gray-400">
                Accepts audio, images, and text files (.txt, .doc, .docx) (Max 10MB)
              </p>
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
                className="text-gray-500 hover:text-red-500"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-2 text-red-500 text-sm flex items-center animate-fade-in">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}

        <div className="mt-4">
          <button
            type="submit"
            disabled={!file || isLoading}
            className={`w-full ${colorbtn} ${hvcolor} text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center ${
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

      {result && (
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-blue-600" size={20} />
            <h3 className="text-xl font-semibold text-gray-800">Analysis Results</h3>
          </div>

          <div className="space-y-6">
            {/* Result */}
            <div className="flex items-start gap-3">
              <Info className="text-gray-500 mt-1" size={18} />
              <div>
                <p className="flex text-sm font-semibold text-gray-600">Result</p>
                <p className="text-base text-gray-800 mt-1">
                  {result.result || 'No result available'}
                </p>
              </div>
            </div>

            {/* Classification */}
            <div className="flex items-start gap-3">
              {result.classification === 'safe' ? (
                <ShieldCheck className="text-green-600 mt-1" size={18} />
              ) : (
                <ShieldX className="text-red-600 mt-1" size={18} />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-600">Classification</p>
                <p
                  className={`text-base font-bold mt-1 ${
                    result.classification === 'safe' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {getClassificationText(result.classification)}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="flex items-start gap-3">
              <Info className="text-gray-500 mt-1" size={18} />
              <div>
                <p className="flex text-sm font-semibold text-gray-600">Details</p>
                <p className="text-base text-gray-800 mt-1">
                  {result.details || 'No details available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;