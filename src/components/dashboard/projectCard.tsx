import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import projectIcon from "@/assets/project_icon.svg";
import { useNavigate } from "react-router";

interface ProjectCardProps {
  id: number;
  name: string;
  url: string;
  status: "deployed" | "failed" | "pending";
}

const ProjectCard = ({ id, name, url, status }: ProjectCardProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "deployed":
        return {
          icon: CheckCircle,
          text: "Deployed",
          iconClass: "text-green-400",
          bgClass: "bg-green-400/10",
        };
      case "failed":
        return {
          icon: XCircle,
          text: "Failed",
          iconClass: "text-red-400",
          bgClass: "bg-red-400/10",
        };
      case "pending":
        return {
          icon: Clock,
          text: "Pending",
          iconClass: "text-muted-foreground",
          bgClass: "bg-muted-foreground/10",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const navigate = useNavigate();

  return (
    <Card className="border-border bg-card hover:bg-card/80 transition-colors">
      <CardContent className="px-6">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={projectIcon} alt={`project icon`} className="w-15" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{url}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-2 px-2 py-1 rounded-full ${statusConfig.bgClass}`}
          >
            <StatusIcon className={`w-4 h-4 ${statusConfig.iconClass}`} />
            <span className={`text-sm font-medium ${statusConfig.iconClass}`}>
              {statusConfig.text}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 px-2 cursor-pointer"
            onClick={() => navigate(`/deploy/${id}`)}
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
