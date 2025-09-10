import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DeploySuccess from "@/components/deploy/DeploySuccess";
import DeployLoading from "@/components/deploy/DeployLoading";
import { useState } from "react";
import DeployInit from "@/components/deploy/DeployInit";
import DeployFailed from "@/components/deploy/DeployFailed";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

const Deploy = () => {
  const [state, setState] = useState<
    "loading" | "success" | "failed" | "default"
  >("failed");

  const handleDeploy = () => {
    if (state === "default") {
      setState("loading");
    }
  };

  const renderCurrentState = () => {
    switch (state) {
      case "loading":
        return <DeployLoading />;
      case "success":
        return <DeploySuccess />;
      case "failed":
        return <DeployFailed />;
      default:
        return <DeployInit handleDeploy={handleDeploy} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16 flex items-center justify-center">
        {renderCurrentState()}
      </main>

      {/* State Toggle Buttons */}
      <div className="flex justify-center mb-2 gap-4">
        <Button variant={"outline"} onClick={() => setState("default")}>
          Default
        </Button>
        <Button variant={"outline"} onClick={() => setState("loading")}>
          Loading
        </Button>
        <Button variant={"outline"} onClick={() => setState("success")}>
          Success
        </Button>
        <Button variant={"outline"} onClick={() => setState("failed")}>
          Failed
        </Button>
      </div>
      <Toaster />
      <Footer />
    </div>
  );
};

export default Deploy;
