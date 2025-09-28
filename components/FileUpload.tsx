
import React, { useRef } from 'react';
import Icon from './icons/Icon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  uploadPrompt: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, uploadPrompt }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };
  
  const onButtonClick = () => {
    fileInputRef.current?.click();
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileSelect(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div 
        className="w-full max-w-lg mx-auto border-2 border-dashed border-pastel-blue rounded-xl p-8 text-center cursor-pointer hover:bg-pastel-green/20 transition-colors duration-300"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={onButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div className="flex flex-col items-center justify-center text-gray-500">
        <Icon name="upload" className="w-12 h-12 text-brand-primary mb-4" />
        <p className="text-lg font-semibold">{uploadPrompt}</p>
        <p className="text-sm mt-1">PNG, JPG, WEBP</p>
      </div>
    </div>
  );
};

export default FileUpload;
