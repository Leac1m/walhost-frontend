import cubeImage from "@/assets/cube.png";

const About = () => {
  return (
    <section className="py-20 container mx-auto px-6">
      <div className="flex [&>div]:flex-1 justify-between items-center gap-12 md:flex-row flex-col">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              What is Walhost?
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                Walhost is a one-click platform for deploying static websites to
                decentralized Walrus storage with metadata registered on the Sui
                blockchain. No need for Sui CLI, Walrus CLI, or Rust.
              </p>
              <p>
                It offers a seamless experience for censorship-resistant,
                on-chain publishing.
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <img
            src={cubeImage}
            alt="3D Walhost visualization cube"
            className="h-80 w-80 object-contain drop-shadow-2xl ml-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
