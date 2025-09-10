import { Card } from "@/components/ui/card";
import projectPreview from "@/assets/project_preview.png";

interface ProjectPreviewProps {
  project: {
    name: string;
    title: string;
    description: string;
    domain: string;
    status: "Live" | "Building" | "Error";
    creationDate: string;
    creator: string;
  };
}

const ProjectPreview = ({ project }: ProjectPreviewProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-walhost-text-primary mb-6">
        {project.name}
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
                  {project.domain}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">Status</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-walhost-text-primary text-sm">
                    {project.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">
                  Creation date
                </span>
                <p className="text-walhost-text-primary text-sm">
                  {project.creationDate}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">Creator</span>
                <p className="text-walhost-text-primary font-mono text-sm">
                  {project.creator}
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
