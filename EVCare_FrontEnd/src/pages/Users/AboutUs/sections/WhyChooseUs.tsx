import styled from "styled-components";

const WhyChooseUsWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  text-align: center;
  padding-bottom: 50px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 50px;
  font-weight: 800;
`;

const Content = styled.div`
  font-size: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 70%;
  margin: 0 auto 2%;
  gap: 20px;
`;

const List = styled.div`
  max-width: 100%;
  font-size: 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
  /* margin: 1% auto; */
`;
const Card = styled.div`
  font-size: 20px;
  border: 0.5px solid #003aa618;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 300px;
  min-height: 250px;

  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled.div`
  color: #000000ff;
  font-weight: 700;
  margin-top: 10%;
  font-size: 25px;
  display: flex;
  justify-content: center;
  height: 30%;
  width: 100%;
  ${Card}:hover & {
    color: #0039a6;
  }
`;

const CardContent = styled.div`
  flex: 1;
  font-size: 20px;
  margin-top: 10%;
`;

export default function WhyChooseUs() {
  return (
    <WhyChooseUsWrapper>
      <Title>Why Choose Us</Title>
      <Content>
        With the rapid growth of the EV industry, proper and timely maintenance
        is essential to ensure safety and extend the lifespan of vehicles.
        Here’s why customers trust us:
      </Content>
      <List>
        <Card>
          <CardTitle>Expert Team</CardTitle>{" "}
          <CardContent>Over 50 highly trained EV technicians.</CardContent>
        </Card>
        <Card>
          <CardTitle>Advanced Technology</CardTitle>{" "}
          <CardContent>
            A smart management system that ensures transparency in every
            process.
          </CardContent>
        </Card>
        <Card>
          <CardTitle>Proven Experience</CardTitle>{" "}
          <CardContent>
            10 years of service, maintaining over 5,000 EVs from leading brands
            like VinFast, Tesla, and BYD.
          </CardContent>
        </Card>
        <Card>
          <CardTitle>Customer-Centered</CardTitle>{" "}
          <CardContent>
            We prioritize your safety and satisfaction above all else.
          </CardContent>
        </Card>
      </List>
    </WhyChooseUsWrapper>
  );
}
