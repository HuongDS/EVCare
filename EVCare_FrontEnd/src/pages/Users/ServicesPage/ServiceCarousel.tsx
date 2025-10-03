import banner from "../../../assets/banner.png";
import { Carousel, Card } from "antd";
import styled from "styled-components";
import { useGetAllCategory } from "../../../services/serviceServicesApi";
import type { ServiceCategoryViewModel } from "../../../models/ServicesModel/ServiceCategoryViewModel";

const Container = styled.div`
  .container {
    width: 100%;
  }
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
  margin-bottom: 2%;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${banner});
  background-size: cover;
  background-position: center;
  filter: blur(15px);
  transform: scale(1.1);
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.h1`
  text-align: center;
  color: white;
  font-size: clamp(28px, 5vw, 48px);
  margin-bottom: 40px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const StyledCarousel = styled(Carousel)`
  .slick-slide {
    opacity: 0.4;
    transform: scale(0.9);
    transition: all 0.4s ease;
  }

  .slick-center {
    opacity: 1 !important;
    transform: scale(1);
    z-index: 2;
    h3 {
      color: #00ad4e;
      text-shadow: 1px 1px #989898, 1px 1px #6c6666;
    }
  }

  .slick-dots li button {
    background: #fff !important;
    opacity: 0.5;
  }

  .slick-dots li.slick-active button {
    background: #00ad4e !important;
    opacity: 1;
  }
`;

const CardWrapper = styled.div`
  padding: 0 10px;
`;

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  border: none !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease !important;
  margin: 0 auto;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3) !important;
  }

  .ant-card-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }
`;

const ServiceName = styled.h3`
  font-family: "Outfit", sans-serif;
  font-size: clamp(20px, 3vw, 24px);
  font-weight: 600;
  color: #333;
  text-align: center;
  margin: 0;
`;

const ServiceCarousel = () => {
  const { data } = useGetAllCategory();
  return (
    <Container>
      <BackgroundImage />
      <Overlay />

      <Content>
        <Title>Our Service Categories</Title>

        <StyledCarousel
          autoplay
          autoplaySpeed={1500}
          dots={true}
          infinite={true}
          slidesToShow={3}
          slidesToScroll={1}
          centerMode={true}
          focusOnSelect={true}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
        >
          {data?.data?.map((service: ServiceCategoryViewModel) => (
            <CardWrapper>
              <StyledCard hoverable>
                <ServiceName>{service.name}</ServiceName>
              </StyledCard>
            </CardWrapper>
          ))}
        </StyledCarousel>
      </Content>
    </Container>
  );
};

export default ServiceCarousel;
