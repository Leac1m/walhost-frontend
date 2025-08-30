import About from "@/components/homepage/About";
import Features from "@/components/homepage/Features";
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
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
