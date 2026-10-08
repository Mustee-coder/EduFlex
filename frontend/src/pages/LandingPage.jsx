import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import PopularCourses from "@/components/landing/PopularCourses";
import WhyEduFlex from "@/components/landing/WhyEduFlex";
import HowItWorks from "@/components/landing/HowItWorks";
import LearningExperience from "@/components/landing/LearningExperience";
import InstructorCTA from "@/components/landing/InstructorCTA";
import Testimonials from "@/components/landing/Testimonials";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const LandingPage = () => (
  <div className="landing-root min-h-screen overflow-x-clip bg-white text-slate-900">
    <Navbar />
    <main>
      <Hero />
      <Stats />
      <PopularCourses />
      <WhyEduFlex />
      <HowItWorks />
      <LearningExperience />
      <InstructorCTA />
      <Testimonials />
      <FinalCTA />
    </main>
    <Footer />
  </div>
);

export default LandingPage;
