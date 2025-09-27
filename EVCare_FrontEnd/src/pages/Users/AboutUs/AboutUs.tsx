import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import OurStory from "./sections/OurStory";
import BehindService from "./sections/BehindService";
import WhyChooseUs from "./sections/WhyChooseUs";

export default function AboutUs() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out",
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <OurStory data-aos="fade-up" />
      <BehindService data-aos="fade-up" />
      <WhyChooseUs data-aos="fade-up" />
    </>
  );
}
