import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/Icons';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      // FIX: Explicitly type the 'file' parameter as 'File' to resolve TypeScript error.
      const pdfFiles = droppedFiles.filter((file: File) => file.type === 'application/pdf');
      
      if (pdfFiles.length > 0) {
        onFileSelect(pdfFiles);
      } else {
        alert('Please drop at least one PDF file.');
      }
      e.dataTransfer.clearData();
    }
  }, [onFileSelect, disabled]);

  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-300 ${isDragging ? 'border-indigo-400 bg-gray-700/50' : 'border-gray-600 hover:border-indigo-500'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={disabled}
        multiple
      />
      <label htmlFor="file-upload" className={`flex flex-col items-center justify-center space-y-4 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <UploadIcon className="w-12 h-12 text-gray-400" />
        <p className="text-gray-300">
          <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">PDF files only</p>
      </label>
    </div>
  );
};
