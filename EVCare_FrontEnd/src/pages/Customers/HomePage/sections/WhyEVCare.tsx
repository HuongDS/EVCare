import styled from "styled-components";
import pic from "../../../../assets/User-check.png";

const Container = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 40px;
  background-color: #e7f0e6;
  text-align: center;
  margin-left: 182px;
  margin-right: 182px;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 50px;
  margin-bottom: 40px;
  color: #00ad4e;
`;

const CardsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  width: 280px;
  height: 287px;
  background: #0039a6;
  padding: 20px;
  margin: 20px auto;
  font-size: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: white;
  text-align: center;
`;

const Icon = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
  color: #ffffff;
`;

const TitleCard = styled.h2`
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
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
