import About from "@/components/homepage/about";
import KeyFeatures from "@/components/homepage/features";
import Hero from "@/components/homepage/hero";
import HowItWorks from "@/components/homepage/howItWorks";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <KeyFeatures />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
