import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import HowWeWork from "@/components/HowWeWork";
import CaseStudies from "@/components/CaseStudies";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ServicePage from "@/components/ServicePage";
import PartnersPage from "@/components/PartnersPage";
import NotFound from "@/components/NotFound";
import LogoLoader from "@/components/LogoLoader";

const LandingPage = () => (
  <>
    <Navbar />
    <HeroSection />
    <div className="line-gradient" />
    <div id="services">
      <ExpertiseSection />
    </div>
    <div className="line-gradient" />
    <HowWeWork />
    <div className="line-gradient" />
    <div id="work">
      <CaseStudies />
    </div>
    <div className="line-gradient" />
    <div id="about">
      <AboutSection />
    </div>
    <div className="line-gradient" />
    <div id="contact">
      <ContactSection />
    </div>
    <Footer />
  </>
);

function App() {
  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
      <LogoLoader />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/service/:slug" element={<ServicePage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
