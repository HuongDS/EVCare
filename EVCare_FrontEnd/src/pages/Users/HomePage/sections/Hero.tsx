// src/Component/HeroSection.tsx
import React from "react";

import { type Variants } from "framer-motion";
import carImage from "../../../../assets/byd-atto3.png";
import TextType from "../../../../components/TextAnimation/TextType";
import TrueFocus from "../../../../components/TextAnimation/TextFocus";
import {
  HeroWrapper,
  HeroContentGrid,
  TextColumn,
  ImageWrapper,
  StyledImage,
  HeroTitle,
  HeroSubtitle,
  HeroButton,
} from "./Style/Hero.styled";

const contentGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const textItemVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};
const imageItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 },
  },
};
const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 10, stiffness: 100, delay: 0.5 },
  },
};

const Hero: React.FC = () => {
  return (
    <HeroWrapper>
      <HeroContentGrid
        variants={contentGridVariants}
        initial="hidden"
        animate="visible"
      >
        <TextColumn variants={textItemVariants}>
          <HeroTitle>
            <TextType
              text={["Keep Your EV in Top Shape"]}
              typingSpeed={75}
              showCursor={false}
              loop={false}
            />
          </HeroTitle>
          <HeroSubtitle>
            <TrueFocus
              sentence="Reliable Transparent Tech-driven"
              blurAmount={4}
              borderColor="#00ad4e"
              glowColor="rgba(0, 173, 78, 0.6)"
            />
          </HeroSubtitle>
        </TextColumn>
        <ImageWrapper variants={imageItemVariants}>
          <StyledImage
            src={carImage}
            alt="EV Car"
            animate={{ y: ["-8px", "8px"] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 3,
              ease: "easeInOut",
            }}
          />
        </ImageWrapper>
        <HeroButton variants={buttonVariants} href="/service">
          Book a Service
        </HeroButton>
      </HeroContentGrid>
    </HeroWrapper>
  );
};

export default Hero;
