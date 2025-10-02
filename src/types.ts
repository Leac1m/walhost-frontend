export interface IDeployment {
    deploymentId: string,
    status: "deployed" | "deploying" | "uploaded" | "failed",
    siteUrl?: string,
    siteName?: string,
    siteObjectId?: string,
    createdAt: string,
    updatedAt: string
}

export interface DeploymentPaymentRequest {
    transactionBytes: string,
    signature: string,
    recipientAddress: string,
    amount: number,
    sender: string,
    epochs: number
}

export interface DeploymentPriceResponse {
    deploymentId: string;
    priceEstimate: string;
    priceUnit: "FROST";
    timestamp: Date;
}

// "deploymentId": "68d6c50046ab68851f23398b",
//     "status": "deployed",
//     "url": "http://59y86thgl1elnrz13pphhv9cd98osvl1xhz69wnsos2f42u6b2.localhost:3000",
//     "siteName": "My Walrus Site",
//     "siteObjectId": "0xd3b35ca6a3342879c4518fb4a174f9e5c31ab17109262165e77cea3ffe9dbd6e",
//     "siteUrl": "http://59y86thgl1elnrz13pphhv9cd98osvl1xhz69wnsos2f42u6b2.localhost:3000",
//     "createdAt": "2025-09-26T16:53:20.971Z",
//     "updatedAt": "2025-09-26T16:55:46.836Z",