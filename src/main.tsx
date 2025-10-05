import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mysten/dapp-kit/dist/index.css';

import { createNetworkConfig, SuiClientProvider, WalletProvider} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') }
});
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork='testnet'>
        <WalletProvider>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>,
)
