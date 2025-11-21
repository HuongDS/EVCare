import styled from "styled-components";
import ScrollFloat from "../../../../components/TextAnimation/ScrollFloat";

const WhyChooseUsWrapper = styled.section`
  font-family: "Outfit", sans-serif;
  text-align: center;
  padding: 8vw 4vw;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #eef9f1 0%, #e9f7ef 100%);
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: #16a34a;
  margin-bottom: 1.5rem;
`;

const Content = styled.p`
  font-size: clamp(1rem, 1.5vw, 1.5rem);
  line-height: 1.7;
  max-width: 850px;
  margin: 0 auto 5rem;
  color: #475569;
  font-weight: 400;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2.5rem;
  width: 100%;
  max-width: 1200px;
  place-items: stretch;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const Card = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  box-shadow: 0 8px 24px rgba(0, 100, 0, 0.08);
  transition: all 0.4s ease;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(22, 163, 74, 0.15);
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 16px 36px rgba(22, 163, 74, 0.25);
    border: 1px solid rgba(22, 163, 74, 0.25);
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 24px;
    background: linear-gradient(
      135deg,
      rgba(22, 163, 74, 0.1),
      rgba(0, 57, 166, 0.06)
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const CardTitle = styled.h3`
  position: relative;
  z-index: 1;
  color: #0039a6;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  transition: color 0.3s ease;

  ${Card}:hover & {
    color: #16a34a;
  }
`;

const CardContent = styled.p`
  position: relative;
  z-index: 1;
  color: #1e293b;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
`;

export default function WhyChooseUs() {
  return (
    <WhyChooseUsWrapper data-aos="fade-up">
      <Title>
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.05}
        >
          Why Choose Us
        </ScrollFloat>
      </Title>
      <Content>
        With the rapid growth of the EV industry, proper and timely maintenance
        is essential to ensure safety and extend the lifespan of vehicles.
        Here’s why customers trust us:
      </Content>

      <List>
        <Card data-aos="fade-up" data-aos-delay="100">
          <CardTitle>Expert Team</CardTitle>
          <CardContent>
            Over 50 highly trained EV technicians, always up-to-date with the
            latest technology.
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="200">
          <CardTitle>Advanced Technology</CardTitle>
          <CardContent>
            Our smart system ensures full transparency, efficiency, and
            precision in every process.
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="300">
          <CardTitle>Proven Experience</CardTitle>
          <CardContent>
            More than a decade maintaining over 5,000 EVs from leading brands
            like VinFast, Tesla, and BYD.
          </CardContent>
        </Card>

        <Card data-aos="fade-up" data-aos-delay="400">
          <CardTitle>Customer-Centered</CardTitle>
          <CardContent>
            We put your safety and satisfaction at the heart of everything we
            do.
          </CardContent>
        </Card>
      </List>
    </WhyChooseUsWrapper>
  );
}
