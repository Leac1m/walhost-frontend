import type { IDeployment } from "@/types";

export interface DeploymentResponse {
    success: boolean;
    deploymentId: string;
    url?: string;
    message?: string;
    status: string;
    error?: string;
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
    private static baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/';
    private static isDevelopment = import.meta.env.DEV;

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

        console.log("Upload response: ",response)

        const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: `{"deploymentId":"${response.deploymentId}"}`
        };

        try {
        const res = await fetch('/api/deploy', options);
        const data = await res.json();
        console.log(data);
        } catch (error) {
        console.error(error);
}
        return response;
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
                status: "uploaded",
                deploymentId: mockDeploymentId,
                url: mockUrl,
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

            xhr.open('POST', `api/upload`);

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

    static async getDeploymentStatus(deploymentId: string): Promise<GetStatusResponce<IDeployment>> {
        if (this.isDevelopment) {
            return this.mockGetDeploymentStatus(deploymentId);
        }

        const response = await fetch(`/api/deploy/status/${deploymentId}`, {
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
    static async getAllDeploymentStatus(): Promise<GetAllStatusResponce<IDeployment>> {
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

        const response = await fetch(`/api/deploy/status`, {
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
            // logs: [
            //     '📦 Extracting project files...',
            //     '🔍 Analyzing project structure...',
            //     '📋 Installing dependencies...',
            //     '🏗️ Building project...',
            //     randomStatus === 'ready' ? '✅ Deployment completed successfully!' : '⏳ Deployment in progress...'
            // ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        } as IDeployment;

        return {
            success: true,
            data: deployment
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
        deploymentId: mockId,
        status: "uploaded",
        url: `https://example-${mockId.slice(-8)}.walhost.app`,
        message: 'Mock deployment created successfully!',
        ...overrides
    };
};
