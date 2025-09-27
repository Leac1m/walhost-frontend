import { Card } from "@/components/ui/card";
import projectPreview from "@/assets/project_preview.png";
import type { IDeployment } from "@/types";

interface ProjectPreviewProps {
  project: Partial<{
    name: string;
    title: string;
    description: string;
    domain: string;
    status: IDeployment["status"];
    creationDate: string;
    creator: string;
  }>;
}

const ProjectPreview = ({ project }: ProjectPreviewProps) => {
  
  const projectData = {
    name: 'Project one',
    title: 'Your AI-Powered Design Assistant',
    description: 'Streamline your web app using state-of-the-art AI technology',
    domain: 'projectone.wal.app',
    status: 'Live' as const,
    creationDate: 'August 7 2025',
    creator: '0x3e...45DH',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...project as any,
  };
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-walhost-text-primary mb-6">
        {projectData.name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Preview Card */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border p-0">
            <img
              src={projectPreview}
              alt="Project Preview"
              className="w-full h-full object-cover"
            />
          </Card>
        </div>

        {/* Project Details */}
        <div className="space-y-6">
          <Card className="bg-card border-border p-6">
            <div className="space-y-4">
              <div>
                <span className="text-muted-foreground text-sm">Domain</span>
                <p className="text-walhost-text-primary font-mono text-sm">
                  {projectData.domain}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">Status</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-walhost-text-primary text-sm">
                    {projectData.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">
                  Creation date
                </span>
                <p className="text-walhost-text-primary text-sm">
                  {projectData.creationDate}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">Creator</span>
                <p className="text-walhost-text-primary font-mono text-sm">
                  {projectData.creator}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectPreview;
