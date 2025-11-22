import { useEffect } from "react";

import { useAnimation, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Brands from "./Brands";
import {
  BannerWrapper,
  BottomBrandsWrapper,
  GridPattern,
  ContentContainer,
  BannerTitle,
  HighlightText,
} from "./Style/MaintenanceBanner.styled";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function MaintenanceBanner() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <BannerWrapper>
      <GridPattern />
      <ContentContainer ref={ref} initial="hidden" animate={controls} variants={containerVariants}>
        <BannerTitle variants={itemVariants}>
          Smart for EV Service Centers <HighlightText>Maintenance Management</HighlightText> for Your EV Fleet
        </BannerTitle>
      </ContentContainer>

      <BottomBrandsWrapper>
        <Brands />
      </BottomBrandsWrapper>
    </BannerWrapper>
  );
}
