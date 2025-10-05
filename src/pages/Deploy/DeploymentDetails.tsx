import InfoCards from '@/components/deploy/InfoCard';
import ProjectPreview from '@/components/deploy/ProjectPreview';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { useDeploymentClient } from '@/hooks/useDeploymensts';
import type { IDeploymentDetails } from '@/types';
import { useEffect } from 'react';
import { useParams } from 'react-router';
// import { useParams } from "react-router";

// In real app this would be fetched based on ID
const getDummyProjectData = (data: IDeploymentDetails | null) => {
  console.log(data);
  if (!data) {
    return null;
  }

  const project = {
    name: data?.siteName,
    domain: data?.siteUrl,
    status: data.status,
    creationDate: data.createdAt,
    creator: data.owner,
  }


  const projectData = {
    liveUrl: data?.siteUrl || 'No URL yet',
    permanentCid:
      'bafybeihdwdcefgh4dqkjv7h2daqvjmv7h2daqvjmvcz2y5mn3uxklifed4h43sm2se',
    uploadedFileName: data.metadata.originalFilename || 'project.zip',
    fileSize: `${data.metadata.fileSize / 1024} MB`,
    extractionResult: '56 files, 8 folders',
    frameworkDetected: 'Static HTML/CSS (no framework)',
    uploadedFileNamePerformance: '13.1 MB',
    integrityHash: data.fileHash,
    uptimeStatus: 'online' as const,
  };
  return { project, projectData };
};

const DeploymentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getDeployment, deploymentData, loading } = useDeploymentClient();

  useEffect(() => {
    (async () => {
      if (id) {
        await getDeployment(id);
      }
    }) ()
  }, [getDeployment, id])


  // Simulate fetching data based on ID
  const data = getDummyProjectData(deploymentData);

  if (loading) {
    return (
      <div className="">Loading...</div>
    )
  }

  if (!data) {
    return (
      <div className="">Data Not Found</div>
    )
  }

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
