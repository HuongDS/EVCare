import React from "react";
import styled from "styled-components";
import Hero from "./sections/Hero";
import WhyEVCare from "./sections/WhyEVCare";
import MaintenanceBanner from "./sections/MaintenanceBanner";
import AboutUs from "./sections/AboutUs";
import StickySection from "./sections/StickySection";

const HomePage: React.FC = () => {
  return (
    <HomePageContainer>
      <StickySection>
        <Hero />
      </StickySection>

      <StickySection $bgColor="#F8F9FA">
        <WhyEVCare />
      </StickySection>

      <StickySection $bgColor="#FFFFFF">
        <AboutUs />
      </StickySection>

      <StickySection>
        <MaintenanceBanner />
      </StickySection>
    </HomePageContainer>
  );
};

export default HomePage;

const HomePageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400vh;
`;
