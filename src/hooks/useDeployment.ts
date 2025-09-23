import { useState, useCallback } from "react";
import { DeploymentAPI, type UploadProgress } from "@/lib/api";
import { toast } from "sonner";

interface DeploymentData {
    deploymentId: string;
    url?: string;
    message?: string;
}

interface UseDeploymentReturn {
    isDeploying: boolean;
    deploymentData: DeploymentData | null;
    uploadProgress: UploadProgress | null;
    error: string | null;
    deploy: (file: File) => Promise<void>;
    reset: () => void;
}

export const useDeployment = (): UseDeploymentReturn => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentData, setDeploymentData] = useState<DeploymentData | null>(null);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
    const [error, setError] = useState<string | null>(null);

    const deploy = useCallback(async (file: File) => {
        try {
            setIsDeploying(true);
            setError(null);
            setUploadProgress(null);
            setDeploymentData(null);

            const response = await DeploymentAPI.uploadProject(
                file,
                (progress) => {
                    setUploadProgress(progress);
                }
            );

            if (response.success) {
                setDeploymentData({
                    deploymentId: response.deploymentId,
                    url: response.url,
                    message: response.message
                });
                toast.success("Project deployed successfully!");
            } else {
                throw new Error(response.message || "Deployment failed");
            }
        } catch (error) {
            console.error("Deployment error:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            setError(errorMessage);
            toast.error(`Deployment failed: ${errorMessage}`);
            throw error; // Re-throw to let the caller handle it
        } finally {
            setIsDeploying(false);
        }
    }, []);

    const reset = useCallback(() => {
        setIsDeploying(false);
        setDeploymentData(null);
        setUploadProgress(null);
        setError(null);
    }, []);

    return {
        isDeploying,
        deploymentData,
        uploadProgress,
        error,
        deploy,
        reset
    };
};