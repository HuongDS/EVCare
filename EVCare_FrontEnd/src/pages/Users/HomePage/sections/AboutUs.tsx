import React, { useEffect } from "react";

import { useAnimation, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "../../../../components/TextAnimation/CountAnimation";
import {
  AboutUsWrapper,
  AboutUsContentBox,
  AboutTitle,
  StatsBox,
  DetailsNumberWrapper,
  DetailsItem,
  CircleAccent,
  NumberContainer,
  DetailsNumber,
  DetailsDescription,
  AboutUsButton,
} from "./Style/AboutUs.styled";

const aboutBoxVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut", staggerChildren: 0.2 },
  },
};
const statsBoxVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut",
      staggerChildren: 0.2,
      delay: 0.2,
    },
  },
};
const detailsItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 10, stiffness: 100 },
  },
};
const circleVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 0.8,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 10,
      mass: 0.5,
      delay: 0.5,
    },
  },
};
const AboutUs: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <AboutUsWrapper>
      <AboutUsContentBox
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={aboutBoxVariants}
      >
        <AboutTitle>About Us</AboutTitle>
        <StatsBox variants={statsBoxVariants}>
          <DetailsNumberWrapper>
            <DetailsItem variants={detailsItemVariants}>
              <NumberContainer>
                <DetailsNumber>
                  <CountUp to={5000} />+
                </DetailsNumber>
                <CircleAccent variants={circleVariants} />
              </NumberContainer>
              <DetailsDescription>
                EVs successfully maintained
              </DetailsDescription>
            </DetailsItem>
            <DetailsItem variants={detailsItemVariants}>
              <NumberContainer>
                <DetailsNumber>
                  <CountUp to={50} />+
                </DetailsNumber>
                <CircleAccent variants={circleVariants} />
              </NumberContainer>
              <DetailsDescription>
                Certified and skilled technicians
              </DetailsDescription>
            </DetailsItem>
            <DetailsItem variants={detailsItemVariants}>
              <NumberContainer>
                <DetailsNumber>
                  <CountUp to={10} />+
                </DetailsNumber>
                <CircleAccent variants={circleVariants} />
              </NumberContainer>
              <DetailsDescription>
                Years of trusted experience
              </DetailsDescription>
            </DetailsItem>
          </DetailsNumberWrapper>
        </StatsBox>
        <AboutUsButton href="/about">More Info</AboutUsButton>
      </AboutUsContentBox>
    </AboutUsWrapper>
  );
};

export default AboutUs;
