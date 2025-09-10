import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeployInit = ({ handleDeploy }: { handleDeploy: () => void }) => {
  return (
    <div className="max-w-2xl w-full text-center space-y-8">
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Deploy a new project
        </h1>
        <p className="text-lg text-primary">
          Simply drag and drop your project's zip folder
        </p>
      </div>

      {/* Drag and Drop Area */}
      <div className="bg-card border-2 border-dashed border-border rounded-lg p-12 hover:border-primary/50 transition-colors">
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">Drag and drop here</p>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>

            <p className="text-muted-foreground">
              Drop <span className="font-semibold">.ZIP</span> file here or
              browse
            </p>
          </div>
        </div>
      </div>

      {/* Deploy Button */}
      <Button
        onClick={handleDeploy}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
      >
        Deploy now
      </Button>
    </div>
  );
};
export default DeployInit;
