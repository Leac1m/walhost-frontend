import { Card, CardContent } from "@/components/ui/card";
import cubeBg from "@/assets/cube_bg.png";

export default function KeyFeatures() {
  const features = [
    {
      title: "No CLI Required",
      description:
        "Deploy your website without installing Sui CLI, Walrus CLI, or Rust. Everything runs in the background with zero local setup.",
    },
    {
      title: "Versioned Hosting",
      description:
        "Each deployment is permanently recorded and versioned, allowing you to track, reference, or revert to any previous state.",
    },
    {
      title: "Sui-Chain Verified",
      description:
        "Site metadata like object ID, version hash, and ownership is securely registered on the Sui blockchain, ensuring transparency and immutability.",
    },
    {
      title: "Custom Subdomains",
      description:
        "Launch your project under a personalized subdomain like yoursite.walhost.app instantly no domain configuration or DNS setup required.",
    },
    {
      title: "GitHub Integration",
      description:
        "Connect your GitHub repo to enable auto-deployments on every push. Great for teams and CI/CD workflows.",
      badge: "Coming soon",
    },
    {
      title: "Portal Hosting",
      description:
        "Your deployed site is served through the Walrus Portal: a fast, decentralized gateway (e.g. wal.app) that ensures high availability.",
    },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              className="p-[1px] rounded-xl bg-gradient-to-br from-[#FF5240]  to-[#006097]"
              key={index}
            >
              <Card className="bg-gradient-to-br from-[#300F2F] to-[#0D0A32] border-gray-700 text-white relative h-full">
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
                <div className="absolute bottom-0 right-0 w-32 h-32">
                  <img src={cubeBg} alt="" />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
