import { useState, useCallback } from "react";
import { DeploymentAPI, type UploadProgress } from "@/lib/api";
import { toast } from "sonner";

export interface uploadedData {
    deploymentId: string;
    url?: string;
    message?: string;
}

export interface UseUploadReturn {
    isUploading: boolean;
    uploadedData: uploadedData | null;
    uploadProgress: UploadProgress | null;
    error: string | null;
    deploy: (file: File) => Promise<void>;
    reset: () => void;
}

export const useUploadClient = (): UseUploadReturn => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedData, setUploadedData] = useState<uploadedData | null>(null);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
    const [error, setError] = useState<string | null>(null);

    const deploy = useCallback(async (file: File) => {
        try {
            setIsUploading(true);
            setError(null);
            setUploadProgress(null);
            setUploadedData(null);

            const response = await DeploymentAPI.uploadProject(
                file,
                (progress) => {
                    setUploadProgress(progress);
                }
            );

            if (response.success) {
                setUploadedData({
                    deploymentId: response.data.deploymentId,
                    url: response.data.url,
                    message: response.message
                });
                toast.success("Project deployed successfully!");
            } else {
                throw new Error(response?.error || "Deployment failed");
            }
        } catch (error) {
            console.error("Deployment error:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            setError(errorMessage);
            toast.error(`Deployment failed: ${errorMessage}`);
            throw error; // Re-throw to let the caller handle it
        } finally {
            setIsUploading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setIsUploading(false);
        setUploadedData(null);
        setUploadProgress(null);
        setError(null);
    }, []);

    return {
        isUploading,
        uploadedData,
        uploadProgress,
        error,
        deploy,
        reset
    };
};