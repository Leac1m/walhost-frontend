import { useCallback, useState } from "react";
import { type DeploymentPaymentRequest, type DeploymentPriceResponse, type IDeployment, type IDeploymentConfig, type IDeploymentDetails } from "@/types";
import { DeploymentAPI } from "@/lib/api";
import { toast } from "sonner";
import { useUploadClient, type UseUploadReturn } from "./useUpload";
import { useCurrentAccount, useSignTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";


interface UseDeploymentClientReturn {
    loading: boolean,
    deploymentsData: IDeployment[],
    deploymentData: IDeploymentDetails | null,
    error: string | null,
    uploadClient: UseUploadReturn,
    getAllDeployments: (address: string) => Promise<void>,
    getDeployment: (id: string) => Promise<void>,
    getDeploymentBasePrice: (deploymentId: string) => Promise<DeploymentPriceResponse | null>,
    startDeployment: (deploymentId: string, payment: Omit<DeploymentPaymentRequest, "transactionBytes" | "signature">, config: IDeploymentConfig) => Promise<void>,
}

export const useDeploymentClient = (): UseDeploymentClientReturn => {
    const [loading, setIsLoading] = useState(true);
    const [deploymentsData, setDeploymentsData] = useState<IDeployment[]>([]);
    const [deploymentData, setDeploymentData] = useState<IDeploymentDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const uploadClient = useUploadClient();
    const { mutateAsync: signTransaction } = useSignTransaction();
    const currentAccount = useCurrentAccount();
    const suiClient = useSuiClient();

    const startDeployment = useCallback(async (deploymentId: string, payment: Omit<DeploymentPaymentRequest, "transactionBytes" | "signature">, config: IDeploymentConfig) => {
        try {
            setIsLoading(true);
            const sender = currentAccount?.address;
            if (!sender) {
                throw new Error("Connect to Wallet!");
            }

            const tx = new Transaction();

            // // Get FROST coins owned by sender
            // const frostCoins = await suiClient.getCoins({
            //     owner: sender,
            //     coinType: '0x9f992cc2430a1f442ca7a5ca7638169f5d5c00e0ebc3977a65e9ac6e497fe5ef::wal::WAL' // FROST coin type
            // });
            
            // if (!frostCoins.data || frostCoins.data.length === 0) {
            //     throw new Error('No FROST coins found in wallet');
            // }
            
            // // Use the first available FROST coin
            // const frostCoin = frostCoins.data[0];
            
            // // Check if we have enough balance
            // const balance = parseInt(frostCoin.balance);
            // if (balance < payment.amount) {
            //     throw new Error(`Insufficient FROST balance. Available: ${balance}, Required: ${payment.amount}`);
            // }
            
            // // Split FROST coins and transfer
            // const [coin] = tx.splitCoins(frostCoin.coinObjectId, [payment.amount]);
            // tx.transferObjects([coin],payment.recipientAddress);

            const [coin] = tx.splitCoins(tx.gas, [payment.amount]);
            tx.transferObjects([coin], payment.recipientAddress);

            const { bytes, signature } = await signTransaction({
                transaction: tx,
            })

            const response = await DeploymentAPI.startDeployment(deploymentId, { ...payment, transactionBytes: bytes, signature }, config);

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
    }, [currentAccount?.address, signTransaction, suiClient])

    const getDeploymentBasePrice = useCallback(async (deploymentId: string): Promise<DeploymentPriceResponse | null> => {
        try {
            setIsLoading(true);

            const { data: paymentData } = await DeploymentAPI.getDeploymentBasePrice(deploymentId);

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


    const getAllDeployments = useCallback(async (address: string) => {
        try {
            setIsLoading(true);

            const deployments = await DeploymentAPI.getAllDeploymentStatus(address);
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