// import Button from "react-bootstrap/Button";
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
`;

const BannerTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin: 0 20px;
  margin-bottom: 30px;
`;

const CTAButton = styled.button`
  width: 300px;
  height: 50px;
  margin-top: 30px;
  font-family: "Outfit", sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: white;
  border-radius: 20px;
  border: 0;
  background-color: #00ad4e;
  // box-shadow: 5px 5px #ccc;

  &:hover {
    background-color: #0039a6;
    transform: translateY(0px) translateX(0px);
    box-shadow: none;
  }
`;

export default function MaintenanceBanner() {
  return (
    <MaintenanceBannerWrapper>
      <div>
        <BannerTitle>
          Smart Maintenance Management for EV Service Centers
        </BannerTitle>
        <CTAButton>Book a Service</CTAButton>
      </div>
    </MaintenanceBannerWrapper>
  );
}
