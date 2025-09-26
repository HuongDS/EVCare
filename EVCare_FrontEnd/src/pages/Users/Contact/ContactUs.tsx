import { useEffect } from "react";
import Contact from "./sections/Contact";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ContactUs() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return <Contact />;
}
