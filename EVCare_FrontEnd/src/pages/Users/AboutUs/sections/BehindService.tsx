import styled from "styled-components";
import ScrollFloat from "../../../../components/TextAnimation/ScrollFloat";
import CountUp from "../../../../components/TextAnimation/CountAnimation";

const BehindServiceWrapper = styled.section`
  font-family: "Outfit", sans-serif;
  padding: 6vw 0;
  background: linear-gradient(180deg, #f6fff9 0%, #eef9f1 100%);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  gap: 5vw;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 45%;
  text-align: center;

  @media (max-width: 992px) {
    max-width: 85%;
  }
`;

const Title = styled.h1`
  color: #16a34a;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
`;

const Content = styled.p`
  font-size: clamp(1rem, 2vw, 1.8rem);
  line-height: 1.7;
  color: #1e293b;
  text-align: justify;
  background: rgba(255, 255, 255, 0.7);
  padding: 1.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 100, 0, 0.05);
  backdrop-filter: blur(8px);
`;

const Highlight = styled.span`
  color: #0039a6;
  font-weight: 700;
`;

const DetailsNumberWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 992px) {
    align-items: center;
    text-align: center;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 992px) {
    align-items: center;
    text-align: center;
  }
`;

const DetailsNumber = styled.p`
  font-size: clamp(2.5rem, 6vw, 6rem);
  font-weight: 1000;
  background: linear-gradient(135deg, #00a651, #16a34a, #0039a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 4px 10px rgba(22, 163, 74, 0.25);
  margin: 0;
  line-height: 1;
`;

const DetailsDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 700;
  color: #0039a6;
  margin-top: 0.5rem;
`;

export default function BehindService() {
  return (
    <BehindServiceWrapper data-aos="fade-up">
      <ContentWrapper>
        <Title>
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.05}
          >
            Behind Service
          </ScrollFloat>
        </Title>
        <Content data-aos="zoom-in-right" data-aos-delay="100">
          Behind every smart maintenance service is a{" "}
          <Highlight>passionate and highly skilled team</Highlight>. With years
          of experience in developing solutions for the EV industry, we combine{" "}
          <Highlight>technical expertise</Highlight> with{" "}
          <Highlight>cutting-edge technology</Highlight> to deliver the{" "}
          <Highlight>safest and most transparent experience</Highlight> for our
          customers.
        </Content>
      </ContentWrapper>

      <DetailsNumberWrapper>
        <DetailItem data-aos="zoom-in-left" data-aos-delay="200">
          <DetailsNumber>
            <CountUp to={5000} duration={2} />+
          </DetailsNumber>
          <DetailsDescription>EVs successfully maintained</DetailsDescription>
        </DetailItem>

        <DetailItem data-aos="zoom-in-left" data-aos-delay="250">
          <DetailsNumber>
            <CountUp to={50} duration={2} />+
          </DetailsNumber>
          <DetailsDescription>
            Certified and skilled technicians
          </DetailsDescription>
        </DetailItem>

        <DetailItem data-aos="zoom-in-left" data-aos-delay="300">
          <DetailsNumber>
            <CountUp to={10} duration={2} />+
          </DetailsNumber>
          <DetailsDescription>Years of trusted experience</DetailsDescription>
        </DetailItem>
      </DetailsNumberWrapper>
    </BehindServiceWrapper>
  );
}
