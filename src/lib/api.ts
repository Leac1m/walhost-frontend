export interface DeploymentResponse {
    success: boolean;
    deploymentId: string;
    url?: string;
    message?: string;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export class DeploymentAPI {
    private static baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
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
        return this.realUploadProject(file, onProgress);
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
        formData.append('project', file);
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
                    } catch (error) {
                        reject(new Error('Invalid response format'));
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

            xhr.open('POST', `${this.baseUrl}/deploy`);

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

    static async getDeploymentStatus(deploymentId: string): Promise<any> {
        if (this.isDevelopment) {
            return this.mockGetDeploymentStatus(deploymentId);
        }

        const response = await fetch(`${this.baseUrl}/deploy/${deploymentId}/status`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to get deployment status: ${response.statusText}`);
        }

        return response.json();
    }

    // Mock deployment status for development
    private static async mockGetDeploymentStatus(deploymentId: string) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const statuses = ['pending', 'building', 'deploying', 'ready', 'failed'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        return {
            deploymentId,
            status: randomStatus,
            url: randomStatus === 'ready' ? `https://example-${deploymentId.slice(-8)}.walhost.app` : undefined,
            logs: [
                '📦 Extracting project files...',
                '🔍 Analyzing project structure...',
                '📋 Installing dependencies...',
                '🏗️ Building project...',
                randomStatus === 'ready' ? '✅ Deployment completed successfully!' : '⏳ Deployment in progress...'
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    // Utility method to toggle between mock and real API
    static setMockMode(enabled: boolean) {
        // You can use this to manually override the mock mode
        (this as any).isDevelopment = enabled;
    }
}

// Helper function to generate mock deployment data for testing
export const generateMockDeployment = (overrides: Partial<DeploymentResponse> = {}): DeploymentResponse => {
    const mockId = `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
        success: true,
        deploymentId: mockId,
        url: `https://example-${mockId.slice(-8)}.walhost.app`,
        message: 'Mock deployment created successfully!',
        ...overrides
    };
};
