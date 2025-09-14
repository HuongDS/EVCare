import Hero from "./sections/Hero";
import Header from "./../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import WhyEVCare from "./sections/WhyEVCare";
import MaintenanceBanner from "./sections/MaintenanceBanner";
import AboutUs from "./sections/AboutUs";
import Brands from "./sections/Brands";

export default function index() {
  return (
    <>
      <Header></Header>
      <Hero></Hero>
      <WhyEVCare></WhyEVCare>
      <MaintenanceBanner></MaintenanceBanner>
      <AboutUs></AboutUs>
      <Brands></Brands>
      <Footer></Footer>
    </>
  );
}
