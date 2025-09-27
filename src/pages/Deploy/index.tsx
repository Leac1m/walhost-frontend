import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import DeploySuccess from '@/components/deploy/DeploySuccess';
import DeployLoading from '@/components/deploy/DeployLoading';
import { useState } from 'react';
import DeployInit from '@/components/deploy/DeployInit';
import DeployFailed from '@/components/deploy/DeployFailed';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useDeploymentClient } from '@/hooks/useDeploymensts';

const Deploy = () => {
  const [state, setState] = useState<
    'loading' | 'success' | 'failed' | 'default'
  >('default');

  const { uploadedData, uploadProgress, error, deploy, reset } =
    (useDeploymentClient()).uploadClient;

  const handleDeploy = async (file: File) => {
    try {
      setState('loading');
      await deploy(file);
      setState('success');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setState('failed');
    }
  };

  const handleRetry = () => {
    setState('default');
    reset();
  };

  const renderCurrentState = () => {
    switch (state) {
      case 'loading':
        return <DeployLoading progress={uploadProgress} />;
      case 'success':
        return <DeploySuccess uploadedData={uploadedData} />;
      case 'failed':
        return <DeployFailed error={error} onRetry={handleRetry} />;
      default:
        return <DeployInit handleDeploy={handleDeploy} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16 flex items-center justify-center">
        {renderCurrentState()}
      </main>

      {/* Development State Toggle Buttons - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="flex justify-center mb-2 gap-4">
          <Button variant={'outline'} onClick={() => setState('default')}>
            Default
          </Button>
          <Button variant={'outline'} onClick={() => setState('loading')}>
            Loading
          </Button>
          <Button variant={'outline'} onClick={() => setState('success')}>
            Success
          </Button>
          <Button variant={'outline'} onClick={() => setState('failed')}>
            Failed
          </Button>
        </div>
      )}

      <Toaster />
      <Footer />
    </div>
  );
};

export default Deploy;
