import { Card, CardContent } from "@/components/ui/card";
import DeployIcon from "@/assets/deploy.svg";
import LiveIcon from "@/assets/live.svg";
import UploadIcon from "@/assets/upload.svg";

export default function HowItWorks() {
  const steps = [
    {
      title: "Upload your site",
      description:
        "Drag and drop your static site (React, Vue, etc.) or connect a GitHub repo. No CLI. No Rust. No headache.",
      color: "bg-gradient-to-br from-[#C36C63] to-[#C36C63]/30",

      icon: UploadIcon,
    },
    {
      title: "Deploy to Walrus + Sui",
      description:
        "We package and upload your site to Walrus decentralized storage. Then register it on Sui for on-chain ownership & versioning.",
      color: "bg-[#43738E]",
      icon: DeployIcon,
    },
    {
      title: "Live instantly",
      description:
        "Your site is instantly hosted at your Walhost subdomain (e.g. myproject.walhost.app) and is forever accessible.",
      color: "bg-[#4894C0]",
      icon: LiveIcon,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className={`${step.color} border-0 text-white`}>
              <CardContent className="p-6 justify-between flex flex-col h-full">
                <div className="text-4xl mb-4">
                  <img
                    src={step.icon}
                    alt={`${step.title} icon`}
                    className="w-15"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-white/90 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
