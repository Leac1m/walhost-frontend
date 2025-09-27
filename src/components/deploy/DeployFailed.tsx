import { Grid3X3, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

interface DeployFailedProps {
  error: string | null;
  onRetry: () => void;
}

const DeployFailed = ({ error }: DeployFailedProps) => {
  const navigate = useNavigate();

  const retryDeployment = () => {};
  return (
    <div className="max-w-2xl w-full">
      {/* Success Card */}
      <div className="bg-card border border-border rounded-lg p-6 text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-400/10 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Oops!! Your deployment failed
          </h1>
          <p className="text-muted-foreground">
            Please review the error details and try again
          </p>
        </div>

        {/* Deployment Details */}
        <div className="space-y-6 text-left max-w-md mx-auto">
          {/* Error Message */}
          <div className="border-black border rounded-lg px-3 py-1 text-center my-10">
            <p>
              Error:{"  "}
              <span className="text-sm text-muted-foreground">
                { error ? error : "Missing environment variables"}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              size={"lg"}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 cursor-pointer"
              onClick={retryDeployment}
            >
              Retry Deployment
            </Button>
            <Button
              size={"lg"}
              variant="secondary"
              className="text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeployFailed;
