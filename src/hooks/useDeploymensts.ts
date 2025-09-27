import { useCallback, useState } from "react";
import { type IDeployment } from "@/types";
import { DeploymentAPI } from "@/lib/api";
import { toast } from "sonner";
import { useUploadClient, type UseUploadReturn } from "./useUpload";

interface UseDeploymentClientReturn {
    loading: boolean,
    deploymentsData: IDeployment[],
    error: string | null,
    uploadClient: UseUploadReturn,
    getAllDeployments: () => Promise<void>
}

export const useDeploymentClient = (): UseDeploymentClientReturn => {
    const [loading, setIsLoading] = useState(true);
    const [deploymentsData, setDeploymentsData] = useState<IDeployment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const uploadClient = useUploadClient();

    const getAllDeployments = useCallback(async () => {
        try {
            setIsLoading(true);

            const deployments = await DeploymentAPI.getAllDeploymentStatus();
            console.log(deployments);
            if (deployments.success) {
                setDeploymentsData(deployments.data.deployments);
                toast.success("Dashboard Loaded Successfully");
            } else {
                throw new Error("Failed to fetch all deployments");
            }
        } catch (error) {
            console.error("Deployment error:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            setError(errorMessage);
            toast.error(`Deployment failed: ${errorMessage}`);
            throw error; // Re-throw to let the caller handle it
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        loading,
        deploymentsData,
        error,
        uploadClient,
        getAllDeployments,
    }
}