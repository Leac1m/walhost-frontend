import { useState, useCallback } from "react";
import { toast } from "sonner";

interface DragAndDropOptions {
    onFilesDrop: (files: File[]) => void;
    maxFiles?: number;
}

export const useDragAndDrop = ({ onFilesDrop, maxFiles = 1 }: DragAndDropOptions) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);

        if (droppedFiles.length > maxFiles) {
            toast.error(`Please upload only ${maxFiles} file${maxFiles > 1 ? 's' : ''} at a time`);
            return;
        }

        if (droppedFiles.length > 0) {
            onFilesDrop(droppedFiles);
        }
    }, [onFilesDrop, maxFiles]);

    const dragProps = {
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop
    };

    return {
        isDragOver,
        dragProps
    };
};