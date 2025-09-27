import styled from "styled-components";
import pic from "../../../../assets/User-check.png";

const Container = styled.div`
  font-family: "Outfit", sans-serif;
  background-color: #e7f0e6;
  margin: 0 5%;
  text-align: center;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem 0;

  @media (max-width: 768px) {
    margin: 0 2%;
    padding: 1rem 0;
  }
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3em);
  font-weight: 800;
  padding: 2%;
  color: #00ad4e;
`;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  width: calc(33.33% - 10em);
  background: #0039a6;
  padding: 20px;
  margin: 20px auto;
  font-size: 1.1rem;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: white;
  text-align: center;
  max-height: 300px;
  min-width: 250px;

  @media (max-width: 768px) {
    width: 80%;
  }

  p {
    text-align: justify;
  }
`;

const Icon = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
`;

const TitleCard = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 15px;
`;

export default function WhyEVCare() {
  return (
    <Container>
      <Title>Why EVCare?</Title>
      <CardsWrapper>
        <Card>
          <Icon src={pic} />
          <TitleCard>Expert EV Technicians</TitleCard>
          <p>
            Certified specialists with deep knowledge of electric vehicles to
            ensure reliable repairs and maintenance.
          </p>
        </Card>

        <Card>
          <Icon src={pic} />
          <TitleCard>Genuine Parts & Inventory Control</TitleCard>
          <p>
            We use high-quality EV spare parts with optimized stock management
            to keep your car running smoothly.
          </p>
        </Card>

        <Card>
          <Icon src={pic} />
          <TitleCard>Clear Pricing & Digital Payments</TitleCard>
          <p>
            Get upfront quotes, track your expenses, and pay easily through
            secure online methods.
          </p>
        </Card>
      </CardsWrapper>
    </Container>
  );
}
