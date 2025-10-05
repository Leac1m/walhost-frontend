import type { DeploymentPaymentRequest, DeploymentPriceResponse, IDeployment, IDeploymentConfig, IDeploymentDetails } from "@/types";

export interface DeploymentResponse {
    success: boolean;
    message?: string;
    error?: string;
    data: {
        deploymentId: string;
        url?: string;
        status: IDeployment["status"];
    };
}

export interface GetStatusResponce<IDeployment> {
    success: boolean
    data: IDeployment;
}

export interface GetAllStatusResponce<IDeployment> {
    success: boolean
    data: { deployments: IDeployment[] }
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export class DeploymentAPI {
    // Checks if in production or development
    private static isDevelopment = import.meta.env.VITE_API_BASE_URL ? false : import.meta.env.DEV;

    // Sets the right endpoint based on environment
    private static baseUrl = (this.isDevelopment ? '/' :
        (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/'));

    static async uploadProject(
        file: File,
        onProgress?: (progress: UploadProgress) => void
    ): Promise<DeploymentResponse> {
        // Mock implementation for development
        if (this.isDevelopment) {
            return this.mockUploadProject(file, onProgress);
        }

        // Real implementation for production
        const response = await this.realUploadProject(file, onProgress);


        return response;
    }

    // Get price api call
    static async getDeploymentBasePrice(deploymentId: string): Promise<{
        data: DeploymentPriceResponse
    }> {

        if (this.isDevelopment) {
            return this.mockGetDeploymentBasePrice(deploymentId);
        }

        const response = await fetch(`${this.baseUrl}/deploy/price/${deploymentId}`);

        if (!response.ok) {
            throw new Error(`Failed to get deployment price: ${response.statusText}`);
        }


        return await response.json();
    }

    static async startDeployment(
        deploymentId: string,
        payment: DeploymentPaymentRequest,
        config: IDeploymentConfig

    ): Promise<DeploymentResponse> {
        if (this.isDevelopment) {
            return this.mockStartDeployment(deploymentId, payment);
        }

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ deploymentId, payment, config })
            
        };

        console.log("Before deployploment", { deploymentId, payment, config })

        const response = await fetch(`${this.baseUrl}/deploy`, options);
        
        const data = await response.json();
        if (!data.success) {
            console.error("Start Deployment Failed: ", response)
            throw new Error(`Failed to get deployment status: ${data?.error}`);
        }
        console.log(data);


        return data;
    }

    static async restartDeployment(deploymentId: string): Promise<DeploymentResponse> {
        // Mock implementation for development
        if (this.isDevelopment) {
            return await this.mockRetryDeployment(deploymentId);
        }
        // mockRetryDeployment
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: `{"deploymentId":"${deploymentId}"}`
        };

        const response = await fetch(`${this.baseUrl}/deploy`, options);

        if (!response.ok) {
            throw new Error(`Failed to get deployment status: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);


        return data;
    }

    // Mock implementation for development/testing
    private static async mockUploadProject(
        file: File,
        onProgress?: (progress: UploadProgress) => void
    ): Promise<DeploymentResponse> {
        console.log('🚀 Mock deployment started for:', file.name);

        // Simulate upload progress
        if (onProgress) {
            const totalSteps = 20;
            const stepSize = file.size / totalSteps;

            for (let i = 0; i <= totalSteps; i++) {
                const loaded = Math.min(i * stepSize, file.size);
                const progress: UploadProgress = {
                    loaded,
                    total: file.size,
                    percentage: Math.round((loaded / file.size) * 100)
                };

                onProgress(progress);

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        // Simulate random success/failure for testing
        const shouldSucceed = Math.random() > 0.2; // 80% success rate

        if (shouldSucceed) {
            const mockDeploymentId = `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const mockUrl = `https://${file.name.replace('.zip', '')}-${mockDeploymentId.slice(-8)}.walhost.app`;

            return {
                success: true,
                data: {
                    status: "uploaded",
                    deploymentId: mockDeploymentId,
                    url: mockUrl,
                },
                message: 'Project deployed successfully to the cloud!'
            };
        } else {
            throw new Error('Mock deployment failed: Simulated server error');
        }
    }

    // Real implementation for production
    private static async realUploadProject(
        file: File,
        onProgress?: (progress: UploadProgress) => void
    ): Promise<DeploymentResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('fileSize', file.size.toString());


        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress: UploadProgress = {
                            loaded: event.loaded,
                            total: event.total,
                            percentage: Math.round((event.loaded / event.total) * 100)
                        };
                        onProgress(progress);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response: DeploymentResponse = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch {
                        reject(new Error(`Invalid response format :`));
                    }
                } else {
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        reject(new Error(errorResponse.message || `HTTP ${xhr.status}: ${xhr.statusText}`));
                    } catch {
                        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                    }
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error occurred'));
            });

            xhr.addEventListener('timeout', () => {
                reject(new Error('Upload timeout'));
            });

            xhr.open('POST', `${this.baseUrl}/upload`);

            // Set timeout (5 minutes for large files)
            xhr.timeout = 5 * 60 * 1000;

            // Add authentication header if needed
            const token = localStorage.getItem('authToken');
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            xhr.send(formData);
        });
    }

    static async getDeploymentStatus(deploymentId: string): Promise<GetStatusResponce<IDeploymentDetails>> {
        if (this.isDevelopment) {
            return this.mockGetDeploymentStatus(deploymentId);
        }

        const response = await fetch(`${this.baseUrl}/deploy/status/${deploymentId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to get deployment status: ${response.statusText}`);
        }

        console.log(response)
        const data = await response.json();
        console.log("Data :", data);

        return data;
    }

    // Get All Deployments
    static async getAllDeploymentStatus(address: string): Promise<GetAllStatusResponce<IDeployment>> {
        if (this.isDevelopment) {
            const mockIds = Array.from({ length: 5 }, (_, i) => `mock_deploy_${i + 1}`);
            const deployments = await Promise.all(
                mockIds.map(id => this.mockGetDeploymentStatus(id))
            );
            return {
                success: true,
                data: { deployments: deployments.map(d => d.data) }
            };
        }

        const response = await fetch(`${this.baseUrl}/deploy/${address}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to get deployment projects: ${response.statusText}`);
        }
        console.log(response)
        const data = await response.json();
        console.log("Data :", data);

        return data;
    }

    // Mock deployment status for development
    private static async mockGetDeploymentStatus(deploymentId: string) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const statuses = ['uploading', 'deploying', 'ready', 'failed'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        const deployment = {
            deploymentId,
            siteName: "demo site name",
            status: randomStatus as IDeployment["status"],
            siteUrl: randomStatus === 'ready' ? `https://example-${deploymentId.slice(-8)}.walhost.app` : undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            fileHash: "f6e54aa1f8ce2bf74956e8c5a2f1e71267a9a868d28b2c72c60a6f1488e5d624",
            owner: "0x000400000300005003",
            metadata: {
                extractedFiles: ["file1.txt", "file2.txt", "file3.txt"],
                fileSize: 1851,
                originalFilename: "counter-dapp.zip"
            }
        } as IDeploymentDetails;

        return {
            success: true,
            data: deployment
        }
    }

    private static async mockRetryDeployment(deploymentId: string) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const deployment = {
            deploymentId,
            status: "deploying" as IDeployment["status"],
            message: "Deployment started successfully"
        };

        return {
            success: true,
            data: deployment
        }
    }

    // Mock implementation for deployment price
    private static async mockGetDeploymentBasePrice(deploymentId: string): Promise<{ data: DeploymentPriceResponse }> {

        await new Promise(resolve => setTimeout(resolve, 300));

        // Generate mock price between 100k and 500k FROST
        const mockPrice = (Math.random() * (500000 - 100000) + 100000).toFixed(0);

        const data = {
            deploymentId,
            estimatedPrice: mockPrice,
            priceUnit: "FROST" as const,
            recipientAddress: "0x12345",
            timestamp: new Date(),
        }
        return { data };
    }

    // Mock implementation for starting deployment
    private static async mockStartDeployment(
        deploymentId: string,
        payment: DeploymentPaymentRequest
    ): Promise<DeploymentResponse> {
        console.log('🚀 Mock starting deployment for:', deploymentId);
        console.log('💰 Mock payment received:', payment);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Simulate random success/failure for testing
        const shouldSucceed = Math.random() > 0.15; // 85% success rate

        if (shouldSucceed) {
            return {
                success: true,
                data: {
                    deploymentId,
                    status: "deploying",
                    url: `https://mock-${deploymentId.slice(-8)}.walhost.app`,
                },
                message: 'Deployment started successfully with payment!'
            };
        } else {
            throw new Error('Mock deployment start failed: Payment verification failed');
        }
    }


    // Utility method to toggle between mock and real API
    static setMockMode(enabled: boolean) {
        // You can use this to manually override the mock mode
        this.isDevelopment = enabled;
    }
}

// Helper function to generate mock deployment data for testing
export const generateMockDeployment = (overrides: Partial<DeploymentResponse> = {}): DeploymentResponse => {
    const mockId = `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
        success: true,
        data: {
            deploymentId: mockId,
            status: "uploaded",
            url: `https://example-${mockId.slice(-8)}.walhost.app`,
        },
        message: 'Mock deployment created successfully!',
        ...overrides
    };
};

DeploymentAPI.setMockMode(false);