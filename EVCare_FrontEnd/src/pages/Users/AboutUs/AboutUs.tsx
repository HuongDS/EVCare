import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import OurStory from "./sections/OurStory";
import BehindService from "./sections/BehindService";
import WhyChooseUs from "./sections/WhyChooseUs";
import TextType from "../../../components/TextAnimation/TextType";
import styled from "styled-components";

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
      <Title>
        <TextType
          text="About Us"
          typingSpeed={75}
          showCursor={false}
          loop={false}
        />
      </Title>
      <OurStory />
      <BehindService />
      <WhyChooseUs />
    </>
  );
}

const Title = styled.h1`
  font-family: "Outfit", sans-serif;
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 800;
  text-align: center;
  margin-top: 5%;
`;
