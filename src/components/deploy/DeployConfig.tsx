import React, { useEffect, useState } from 'react';
import { Loader2, Settings } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useDeploymentClient } from '@/hooks/useDeploymensts';
import type { DeploymentPriceResponse } from '@/types';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface DeployConfigProps {
  deploymentId: string;
  onConfigured?: (config: {
    siteName: string;
    epochs: number;
    totalFee: number;
  }) => void;
  onDeploymentSuccess?: () => void;
}

const DeployConfig: React.FC<DeployConfigProps> = ({
  deploymentId,
  onConfigured,
  onDeploymentSuccess,
}) => {
  const { getDeploymentBasePrice, startDeployment } = useDeploymentClient();
  const [siteName, setSiteName] = useState('');
  const [epochs, setEpoch] = useState(1);
  const [priceDetail, setPriceDetails] = useState<DeploymentPriceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    let mounted = true;
    async function fetchPrice() {
      setLoading(true);
      setError(null);
      try {
        const priceData = await getDeploymentBasePrice(deploymentId);
        console.log("PriceData", priceData);
        // priceEstimate is string, convert to number
        if (priceData) {
          setPriceDetails(priceData);
        } else {
          setPriceDetails(null);
        }
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'message' in e) {
          setError(
            (e as { message?: string }).message || 'Failed to fetch price'
          );
        } else {
          setError('Failed to fetch price');
        }
        setPriceDetails(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchPrice();
    return () => {
      mounted = false;
    };
  }, [deploymentId, getDeploymentBasePrice]);

  const totalFee = priceDetail && priceDetail?.estimatedPrice !== null ? Number(priceDetail.estimatedPrice) * epochs : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (onConfigured && totalFee !== null) {
    if (totalFee !== null) {
      try {
        setLoading(true);
        setError(null);
        
        // Call the config callback first
        if (onConfigured) {
          onConfigured({ siteName, epochs, totalFee });
        }

        // Start deployment
        await startDeployment(deploymentId, {
          amount: totalFee,
          epochs: epochs,
          recipientAddress: priceDetail!.recipientAddress,
          sender: currentAccount?.address || '0x123',
        },{
          siteName,
          epochs
        });

        // If deployment is successful, call success callback
        if (onDeploymentSuccess) {
          onDeploymentSuccess();
        }
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'message' in e) {
          setError(
            (e as { message?: string }).message || 'Failed to start deployment'
          );
        } else {
          setError('Failed to start deployment');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-2xl w-full">
      <div className="bg-card border border-border rounded-lg p-12 text-center space-y-8">
        {/* Config Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Settings className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Config Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Configure your deployment
          </h1>
          <p className="text-muted-foreground">
            Set your site name and deployment duration.
          </p>
        </div>

        {/* Config Form */}
        <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="text-left space-y-3">
            <label className="block text-sm font-medium text-foreground mb-1">
              Site Name
            </label>
            <Input
              type="text"
              placeholder="Enter site name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
            />
          </div>
          <div className="text-left space-y-3">
            <label className="block text-sm font-medium text-foreground mb-1">
              Epochs: <span className="font-bold">{epochs}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={epochs}
              onChange={(e) => setEpoch(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
          <div className="text-left space-y-1">
            <label className="block text-sm font-medium text-foreground mb-1">
              Estimated Fee
            </label>
            <div className="text-lg font-bold">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                </span>
              ) : error ? (
                <span className="text-destructive">{error}</span>
              ) : priceDetail && priceDetail.estimatedPrice !== null ? (
                <span>
                  {priceDetail && priceDetail.estimatedPrice} FROST x {epochs} = {totalFee} FROST
                </span>
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading || !siteName || priceDetail!.estimatedPrice === null}
            className="w-full"
          >
            Confirm Configuration
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DeployConfig;
