import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProjectCard from "@/components/dashboard/projectCard";
import { useNavigate } from "react-router";
import { useDeploymentClient } from "@/hooks/useDeploymensts";
import { useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

const Dashboard = () => {
  const { getAllDeployments, deploymentsData } = useDeploymentClient();
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();
  const walletAddress = currentAccount?.address;

  // const projects = [
  //   {
  //     id: 1,
  //     siteName: "Walhost one",
  //     siteUrl: "Projectone.wal.app",
  //     status: "deployed" as const,
  //   },
  //   {
  //     id: 2,
  //     siteName: "Project two",
  //     siteUrl: "Projectone.wal.app",
  //     status: "failed" as const,
  //   },
  //   {
  //     id: 3,
  //     siteName: "Project three",
  //     siteUrl: "Projectone.wal.app",
  //     status: "pending" as const,
  //   },
  //   {
  //     id: 4,
  //     siteName: "Project one",
  //     siteUrl: "Projectone.wal.app",
  //     status: "deployed" as const,
  //   },
  //   {
  //     id: 5,
  //     siteName: "Project two",
  //     siteUrl: "Projectone.wal.app",
  //     status: "failed" as const,
  //   },
  //   {
  //     id: 6,
  //     siteName: "Project three",
  //     siteUrl: "Projectone.wal.app",
  //     status: "pending" as const,
  //   },
  //   {
  //     id: 7,
  //     siteName: "Project one",
  //     siteUrl: "Projectone.wal.app",
  //     status: "deployed" as const,
  //   },
  //   {
  //     id: 8,
  //     siteName: "Project two",
  //     siteUrl: "Projectone.wal.app",
  //     status: "failed" as const,
  //   },
  //   {
  //     id: 9,
  //     siteName: "Project three",
  //     siteUrl: "Projectone.wal.app",
  //     status: "pending" as const,
  //   },
  // ];
  useEffect(() => {
    (async () => {
      if (walletAddress) await getAllDeployments(walletAddress);
    }) ()
  }, [getAllDeployments, walletAddress]);


  if (!walletAddress) {
    return (
      <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground mb-4">
        Connect wallet to see projects
        </p>
      </main>
      <Footer />
      </div>
    );
  }

  const projects = deploymentsData;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Deploy Button */}
        <div className="text-center mb-12">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            onClick={() => navigate("/deploy")}
          >
            <Plus className="w-5 h-5 mr-2" />
            Deploy new project
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for projects"
              className="pl-10 pr-12 bg-input border-border"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <SlidersHorizontal className="w-4 h-4" color="#B4433A" />
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              id={project.deploymentId}
              key={project.deploymentId}
              name={project.siteName}
              url={project.siteUrl}
              status={project.status}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
