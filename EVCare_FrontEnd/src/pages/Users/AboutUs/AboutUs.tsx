import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styled from "styled-components";

import OurStory from "./sections/OurStory";
import BehindService from "./sections/BehindService";
import WhyChooseUs from "./sections/WhyChooseUs";
import TextType from "../../../components/TextAnimation/TextType";

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
      <HeroSection>
        <HeroInner>
          <Note>Make Your Vehicle Better</Note>
          <Title>
            <TextType
              text={"The Story\nBehind EVCare"}
              typingSpeed={75}
              showCursor={false}
              loop={false}
            />
          </Title>
        </HeroInner>
      </HeroSection>

      <OurStory />
      <BehindService />
      <WhyChooseUs />
    </>
  );
}

const HeroSection = styled.section`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  position: relative;
`;

const HeroInner = styled.div`
  position: relative;
  text-align: center;
`;

const Note = styled.div`
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%) rotate(-5deg);
  background-color: var(--yellow, #ffe866);
  color: var(--black, #000);
  font-family: "IBM Plex Mono", monospace;
  font-size: clamp(8px, 2vw, 20px);
  font-weight: 500;
  padding: 0.3rem 0.75rem;
  display: inline-block;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  opacity: 1;
`;

const Title = styled.h1`
  font-family: "Outfit", sans-serif;
  font-size: clamp(3rem, 15vw, 15rem);
  font-weight: 800;
  text-align: center;
  margin: 0;
  white-space: pre-line;
  line-height: 1.1;
`;
