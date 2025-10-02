import { useCallback, useState } from "react";
import { type DeploymentPaymentRequest, type DeploymentPriceResponse, type IDeployment } from "@/types";
import { DeploymentAPI } from "@/lib/api";
import { toast } from "sonner";
import { useUploadClient, type UseUploadReturn } from "./useUpload";

interface UseDeploymentClientReturn {
    loading: boolean,
    deploymentsData: IDeployment[],
    deploymentData: IDeployment | null,
    error: string | null,
    uploadClient: UseUploadReturn,
    getAllDeployments: () => Promise<void>,
    getDeployment: (id: string) => Promise<void>,
    getDeploymentBasePrice: (deploymentId: string) => Promise<DeploymentPriceResponse | null>,
    startDeployment: (deploymentId: string, payment: DeploymentPaymentRequest) => Promise<void>,
}

export const useDeploymentClient = (): UseDeploymentClientReturn => {
    const [loading, setIsLoading] = useState(true);
    const [deploymentsData, setDeploymentsData] = useState<IDeployment[]>([]);
    const [deploymentData, setDeploymentData] = useState<IDeployment | null>(null);
    const [error, setError] = useState<string | null>(null);
    const uploadClient = useUploadClient();

    const startDeployment = useCallback(async (deploymentId: string, payment: DeploymentPaymentRequest) => {
        try {
            setIsLoading(true);

            const response = await DeploymentAPI.startDeployment(deploymentId, payment);

            if (!response.success) {
                throw new Error(response.error);
            }

            toast.success(response.message);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            setError(errorMessage);
            toast.error(`Deployment failed: ${errorMessage}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [])

    const getDeploymentBasePrice = useCallback(async (deploymentId: string): Promise<DeploymentPriceResponse | null> => {
        try {
            setIsLoading(true);

            const paymentData = await DeploymentAPI.getDeploymentBasePrice(deploymentId);

            if (!paymentData) {
                throw new Error("Failed to fetch deployment price");
            }

            return paymentData;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknow error occured";
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [])


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

    const getDeployment = useCallback(async (id: string) => {
        try {
            setIsLoading(true);

            const deployment = await DeploymentAPI.getDeploymentStatus(id);
            if (deployment.success) {
                setDeploymentData(deployment.data);
                toast.success("Dashboard Loaded Successfully");
            } else {
                throw new Error("Failed to fetch deployment");
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

    // DeploymentAPI.setMockMode(false);

    return {
        loading,
        deploymentsData,
        deploymentData,

        error,
        uploadClient,
        getAllDeployments,
        getDeployment,
        getDeploymentBasePrice,
        startDeployment,
    }
}