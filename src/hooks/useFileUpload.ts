import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

interface FileUploadConfig {
    maxSize?: number; // in bytes
    acceptedTypes?: string[];
}

export const useFileUpload = (config: FileUploadConfig = {}) => {
    const {
        maxSize = 100 * 1024 * 1024, // 100MB default
        acceptedTypes = ['.zip']
    } = config;

    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback((file: File): boolean => {
        // Check file type
        const isValidType = acceptedTypes.some(type =>
            file.name.toLowerCase().endsWith(type.toLowerCase())
        );

        if (!isValidType) {
            const typesString = acceptedTypes.join(', ').toUpperCase();
            toast.error(`Please upload ${typesString} files only`);
            return false;
        }

        // Check file size
        if (file.size > maxSize) {
            const maxSizeMB = Math.round(maxSize / (1024 * 1024));
            toast.error(`File size must be less than ${maxSizeMB}MB`);
            return false;
        }

        return true;
    }, [maxSize, acceptedTypes]);

    const handleFileSelection = useCallback((selectedFile: File) => {
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
            toast.success(`File "${selectedFile.name}" selected successfully`);
        }
    }, [validateFile]);

    const browseFiles = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelection(selectedFile);
        }
    }, [handleFileSelection]);

    const clearFile = useCallback(() => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    return {
        file,
        fileInputRef,
        handleFileSelection,
        handleFileInputChange,
        browseFiles,
        clearFile
    };
};