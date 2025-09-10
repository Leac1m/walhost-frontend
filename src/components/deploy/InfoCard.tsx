import { Card } from "@/components/ui/card";
import qrCode from "@/assets/qrcode.png";

interface InfoCardsProps {
  projectData: {
    liveUrl: string;
    permanentCid: string;
    uploadedFileName: string;
    fileSize: string;
    extractionResult: string;
    frameworkDetected: string;
    uploadedFileNamePerformance: string;
    integrityHash: string;
    uptimeStatus: "online" | "offline";
  };
}

const InfoCards = ({ projectData }: InfoCardsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Access Information */}
      <Card className="bg-card border-border p-4">
        <h3 className="text-xl font-semibold">Access information</h3>
        <div className="space-y-2">
          <div>
            <span className="text-muted-foreground text-sm">Live URL</span>
            <p className="text-walhost-purple text-sm font-mono break-all">
              {projectData.liveUrl}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Permanent CID</span>
            <p className="text-xs font-mono break-all">
              {projectData.permanentCid}
            </p>{" "}
          </div>
          {/* QR Code Placeholder */}
          <div>
            <img src={qrCode} alt="Qr code" />
          </div>
        </div>
      </Card>

      {/* File & Build Info */}
      <Card className="bg-card border-border p-4">
        <h3 className="text-xl font-semibold">File & Build info</h3>
        <div className="space-y-2">
          <div>
            <span className="text-muted-foreground text-sm">
              Uploaded file name:
            </span>
            <p className="text-walhost-error text-sm">
              {projectData.uploadedFileName}
            </p>
          </div>

          <div>
            <span className="text-muted-foreground text-sm">File size:</span>
            <p className="text-walhost-error text-sm">{projectData.fileSize}</p>
          </div>

          <div>
            <span className="text-muted-foreground text-sm">
              Extraction result:
            </span>
            <p className="text-walhost-error text-sm">
              {projectData.extractionResult}
            </p>
          </div>

          <div>
            <span className="text-muted-foreground text-sm">
              Framework detected:
            </span>
            <p className="text-walhost-error text-sm">
              {projectData.frameworkDetected}
            </p>
          </div>
        </div>
      </Card>

      {/* Performance & Health */}
      <Card className="bg-card border-border p-4">
        <h3 className="text-xl font-semibold mb-4">Performance & Health</h3>
        <div className="space-y-2">
          <div>
            <span className="text-muted-foreground text-sm">
              Uploaded file name:
            </span>
            <p className="text-walhost-error text-sm">
              {projectData.uploadedFileNamePerformance}
            </p>
          </div>

          <div>
            <span className="text-muted-foreground text-sm">
              Integrity Hash:
            </span>
            <p className="text-walhost-error text-sm font-mono break-all">
              {projectData.integrityHash}
            </p>
          </div>

          <div>
            <span className="text-muted-foreground text-sm">
              Uptime status:
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  projectData.uptimeStatus === "online"
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              ></div>
              <span className="text-sm">{projectData.uptimeStatus}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InfoCards;
