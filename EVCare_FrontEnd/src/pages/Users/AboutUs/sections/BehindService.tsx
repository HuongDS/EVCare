import styled from "styled-components";

const BehindServiceWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 5vw 0;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  gap: 3vw;

  @media (max-width: 390px) {
    padding: 3vw 0;
    gap: 2vw;
  }
`;

const DetailsNumberWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: auto;

  @media (max-width: 768px) {
    align-items: start;
    text-align: center;
    flex-direction: row;
    gap: 2rem;
  }

  @media (max-width: 390px) {
    gap: 1.5rem;
  }

  @media (max-width: 375px) {
    gap: 1rem;
  }
`;

const DetailsNumber = styled.p`
  font-size: clamp(2.3rem, 8vw, 7rem);
  font-weight: 1000;
`;

const DetailsDescription = styled.p`
  font-size: clamp(1rem, 2vw, 2.5rem);
  font-weight: 700;
  margin-top: 0;
  color: #0039a6;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 50%;

  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

const Title = styled.h1`
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
`;

const Content = styled.p`
  font-size: clamp(1rem, 2vw, 2.5rem);
  margin-bottom: 20px;
  text-align: justify;
`;

const Highlight = styled.span`
  color: #0039a6;
  font-weight: 700;
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 2rem;
    margin-left: 1rem;
    align-items: center;
  }

  @media (max-width: 375px) {
    margin-bottom: 1.6rem;
    align-items: center;
  }
`;

export default function BehindService() {
  return (
    <BehindServiceWrapper data-aos="fade-up">
      <ContentWrapper data-aos="fade-up" data-aos-delay="200">
        <Title>Behind Service</Title>
        <Content>
          Behind every smart maintenance service is a{" "}
          <Highlight>passionate and highly skilled team</Highlight>. With years
          of experience in developing solutions for the EV industry, we combine{" "}
          <Highlight>technical expertise</Highlight> with{" "}
          <Highlight>cutting-edge technology</Highlight> to deliver the{" "}
          <Highlight>safest and most transparent experience</Highlight> for our
          customers.
        </Content>
      </ContentWrapper>

      <DetailsNumberWrapper data-aos="fade-up" data-aos-delay="400">
        <DetailWrapper>
          <DetailsNumber>5000+</DetailsNumber>
          <DetailsDescription>EVs successfully maintained</DetailsDescription>
        </DetailWrapper>
        <DetailWrapper>
          <DetailsNumber>50+</DetailsNumber>
          <DetailsDescription>
            Certified and skilled technicians
          </DetailsDescription>
        </DetailWrapper>
        <DetailWrapper>
          <DetailsNumber>10</DetailsNumber>
          <DetailsDescription>Years of trusted experience</DetailsDescription>
        </DetailWrapper>
      </DetailsNumberWrapper>
    </BehindServiceWrapper>
  );
}
