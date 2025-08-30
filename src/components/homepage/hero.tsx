import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-b from-black via-primary/30 to-primary/5">
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl space-y-8 py-24 px-6 text-center">
        <div className="space-y-4">
          <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
            Welcome to Walhost!
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl">
            Deploy your decentralized websites easily with one-click deployment
            to Walrus storage and Sui blockchain
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="shadow-glow">
            Get started
          </Button>
          {/* <Button variant="outline" size="lg">
            View documentation
          </Button> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
