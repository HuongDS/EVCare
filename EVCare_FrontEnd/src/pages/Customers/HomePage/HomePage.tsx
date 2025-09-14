import Hero from "./sections/Hero";
import WhyEVCare from "./sections/WhyEVCare";
import MaintenanceBanner from "./sections/MaintenanceBanner";
import AboutUs from "./sections/AboutUs";
import Brands from "./sections/Brands";

export default function HomePage() {
  return (
    <>
      <Hero></Hero>
      <WhyEVCare></WhyEVCare>
      <MaintenanceBanner></MaintenanceBanner>
      <AboutUs></AboutUs>
      <Brands></Brands>
    </>
  );
}
