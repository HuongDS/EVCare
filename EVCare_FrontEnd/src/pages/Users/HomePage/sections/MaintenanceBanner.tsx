import styled from "styled-components";
import bannerImage from "../../../../assets/banner.png";

const MaintenanceBannerWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  color: white;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-top: 30px;
  margin-bottom: 30px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(${bannerImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(5px);
    transform: scale(1.2);
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 2;
  }

  > * {
    position: relative;
    z-index: 3;
  }

  @media (max-width: 768px) {
    min-height: 40vh;
    padding: 20px;
  }
`;

const BannerTitle = styled.h1`
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 800;
  margin: 0 20px;
  margin-bottom: 30px;
  color: #ffffff;
`;

const CTAButton = styled.button`
  width: 300px;
  height: 50px;
  margin-top: 30px;
  font-family: "Outfit", sans-serif;
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 600;
  color: white;
  border-radius: 20px;
  border: 0;
  background-color: #00ad4e;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #0039a6;
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 45px;
  }
`;

export default function MaintenanceBanner() {
  return (
    <MaintenanceBannerWrapper data-aos="fade-up">
      <div>
        <BannerTitle>
          Smart Maintenance Management for EV Service Centers
        </BannerTitle>
        <CTAButton>Book a Service</CTAButton>
      </div>
    </MaintenanceBannerWrapper>
  );
}
