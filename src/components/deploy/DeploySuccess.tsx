import { CheckCircle, Eye, Share2, Grid3X3, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { uploadedData } from "@/hooks/useUpload";

interface DeploySuccessProp {
  uploadedData: uploadedData | null
}

const DeploySuccess = ({ uploadedData }: DeploySuccessProp) => {
  const navigate = useNavigate();

  const deploymentId = uploadedData?.deploymentId;
  const projectUrl =  uploadedData ? uploadedData.url : "Projectone.wal.app";
  const walrusObjectId = "0x3e...45DH";
  const suiTxHash = "0x3e...45DH";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied!", {
      description: `${label} copied to clipboard`,
    });
  };

  console.log("DeploymentId",deploymentId);

  return (
    <div className="max-w-2xl w-full">
      {/* Success Card */}
      <div className="bg-card border border-border rounded-lg p-6 text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Your site is Live!
          </h1>
          <p className="text-muted-foreground">
            Congratulations! your site has been successfully deployed.
          </p>
        </div>

        {/* Deployment Details */}
        <div className="space-y-6 text-left max-w-md mx-auto">
          {/* Live Site URL */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Live site URL</span>
            <a
              href={`https://${projectUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium"
            >
              {projectUrl}
            </a>
          </div>

          {/* Walrus Object ID */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Walrus object ID</span>
            <div className="flex items-center space-x-2">
              <span className="text-foreground font-mono text-sm">
                {walrusObjectId}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
                onClick={() =>
                  copyToClipboard(walrusObjectId, "Walrus object ID")
                }
              >
                <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>
          </div>

          {/* Sui TX Hash */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Sui TX hash</span>
            <div className="flex items-center space-x-2">
              <span className="text-foreground font-mono text-sm">
                {suiTxHash}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
                onClick={() => copyToClipboard(suiTxHash, "Sui TX hash")}
              >
                <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 flex-1 cursor-pointer"
              // onClick={() => window.open(`https://${projectUrl}`, "_blank")}
              onClick={() => navigate(`/deploy/${deploymentId}`)}
            >
              <Eye className="w-4 h-4" />
              View Site
            </Button>
            <Button
              variant="outline"
              size={"lg"}
              className="px-6 flex-1 cursor-pointer"
              onClick={() =>
                copyToClipboard(`https://${projectUrl}`, "Site URL")
              }
            >
              <Share2 className="w-4 h-4" />
              Share link
            </Button>
          </div>
        </div>

        {/* Go to Dashboard */}
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/dashboard")}
        >
          <Grid3X3 className="w-4 h-4 mr-1" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default DeploySuccess;
