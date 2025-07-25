import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { resumeService } from '@/services/resume';

const ResumeUpload = ({ onUploadSuccess, onUploadError }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

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

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file) => {
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (!allowedTypes.includes(file.type)) {
            onUploadError?.('Please select a PDF or DOCX file.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            onUploadError?.('File size must be less than 10MB.');
            return;
        }

        setSelectedFile(file);
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const response = await resumeService.uploadResume(selectedFile);
            onUploadSuccess?.(response);
            setSelectedFile(null);
        } catch (error) {
            console.error('Upload failed:', error);
            onUploadError?.(error.message || 'Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div
                className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${selectedFile ? 'border-green-400 bg-green-50' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="resume-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.docx"
                    onChange={handleFileInputChange}
                    disabled={isUploading}
                />

                {selectedFile ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                            <FileText className="h-8 w-8 text-green-600" />
                            <div className="text-left">
                                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-sm text-gray-500">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSelectedFile}
                                disabled={isUploading}
                                className="text-gray-500 hover:text-red-600"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="w-full"
                        >
                            {isUploading ? 'Uploading...' : 'Upload Resume'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                            <p className="text-lg font-medium text-gray-900">
                                Drop your resume here
                            </p>
                            <p className="text-sm text-gray-500">
                                or click to browse files
                            </p>
                        </div>
                        <p className="text-xs text-gray-400">
                            Supports PDF and DOCX files up to 10MB
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeUpload;
