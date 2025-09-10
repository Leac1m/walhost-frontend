import InfoCards from "@/components/deploy/InfoCard";
import ProjectPreview from "@/components/deploy/ProjectPreview";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
// import { useParams } from "react-router";

// In real app this would be fetched based on ID
const getDummyProjectData = () => ({
  project: {
    name: "Project one",
    title: "Your AI-Powered Design Assistant",
    description: "Streamline your web app using state-of-the-art AI technology",
    domain: "projectone.wal.app",
    status: "Live" as const,
    creationDate: "August 7 2025",
    creator: "0x3e...45DH",
  },
  projectData: {
    liveUrl: "https://projectone.wal.app",
    permanentCid:
      "bafybeihdwdcefgh4dqkjv7h2daqvjmv7h2daqvjmvcz2y5mn3uxklifed4h43sm2se",
    uploadedFileName: "project.zip",
    fileSize: "12.4 MB",
    extractionResult: "56 files, 8 folders",
    frameworkDetected: "Static HTML/CSS (no framework)",
    uploadedFileNamePerformance: "13.1 MB",
    integrityHash: "fsehjdkdj...f47j35",
    uptimeStatus: "online" as const,
  },
});

const DeploymentDetails = () => {
  //   const { id } = useParams<{ id: string }>();

  // Simulate fetching data based on ID
  const data = getDummyProjectData();

  return (
    <div className="min-h-screen bg-walhost-bg">
      <Header />

      <main className="container items-center justify-between p-8 mx-auto">
        <ProjectPreview project={data.project} />
        <InfoCards projectData={data.projectData} />
      </main>

      <Footer />
    </div>
  );
};

export default DeploymentDetails;
