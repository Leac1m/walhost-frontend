import React, { useEffect, useState } from 'react';
import { Loader2, Settings } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useDeploymentClient } from '@/hooks/useDeploymensts';

interface DeployConfigProps {
  deploymentId: string;
  onConfigured?: (config: {
    siteName: string;
    epoch: number;
    totalFee: number;
  }) => void;
}

const DeployConfig: React.FC<DeployConfigProps> = ({
  deploymentId,
  onConfigured,
}) => {
  const { getDeploymentBasePrice } = useDeploymentClient();
  const [siteName, setSiteName] = useState('');
  const [epoch, setEpoch] = useState(1);
  const [estimatePrice, setEstimatePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchPrice() {
      setLoading(true);
      setError(null);
      try {
        const priceData = await getDeploymentBasePrice(deploymentId);
        // priceEstimate is string, convert to number
        if (priceData && priceData.priceEstimate) {
          setEstimatePrice(Number(priceData.priceEstimate));
        } else {
          setEstimatePrice(null);
        }
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'message' in e) {
          setError(
            (e as { message?: string }).message || 'Failed to fetch price'
          );
        } else {
          setError('Failed to fetch price');
        }
        setEstimatePrice(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchPrice();
    return () => {
      mounted = false;
    };
  }, [deploymentId, getDeploymentBasePrice]);

  const totalFee = estimatePrice !== null ? estimatePrice * epoch : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConfigured && totalFee !== null) {
      onConfigured({ siteName, epoch, totalFee });
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
              Epochs: <span className="font-bold">{epoch}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={epoch}
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
              ) : estimatePrice !== null ? (
                <span>
                  {estimatePrice} FROST x {epoch} = {totalFee} FROST
                </span>
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading || !siteName || estimatePrice === null}
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
