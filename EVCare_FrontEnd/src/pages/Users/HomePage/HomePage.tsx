import Hero from "./sections/Hero";
import WhyEVCare from "./sections/WhyEVCare";
import MaintenanceBanner from "./sections/MaintenanceBanner";
import AboutUs from "./sections/AboutUs";
import Brands from "./sections/Brands";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";
export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
      offset: 100,
    });
    AOS.refresh();
  }, []);
  return (
    <>
      <Hero data-aos="fade-up" />
      <WhyEVCare data-aos="fade-up" />
      <MaintenanceBanner data-aos="fade-up" />
      <AboutUs data-aos="fade-up" />
      <Brands data-aos="fade-up" />
    </>
  );
}
