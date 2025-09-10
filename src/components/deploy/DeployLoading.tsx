import { Loader2, Upload } from "lucide-react";

const DeployLoading = () => {
  return (
    <div className="max-w-2xl w-full">
      {/* Loading Card */}
      <div className="bg-card border border-border rounded-lg p-12 text-center space-y-8">
        {/* Loading Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Upload className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Deploying your site...
          </h1>
          <p className="text-muted-foreground">
            Please wait while we deploy your project. This may take a few
            moments.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="text-left space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                Uploading files...
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground">
                Building project...
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-muted rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                Configuring deployment...
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-muted rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                Going live...
              </span>
            </div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default DeployLoading;
