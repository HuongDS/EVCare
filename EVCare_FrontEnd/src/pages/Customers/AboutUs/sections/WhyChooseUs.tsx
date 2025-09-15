import styled from "styled-components";

const WhyChooseUsWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  text-align: center;
  padding-bottom: 50px;
`;

const Title = styled.h1`
  font-size: 50px;
  font-weight: 800;
`;

const Content = styled.p`
  font-size: 25px;
  margin-bottom: 20px;
  margin-left: 200px;
  margin-right: 200px;
  text-align: justify;
`;
const Highlight = styled.span`
  color: #0039a6;
  font-weight: 700;
`;

const List = styled.ul`
  font-size: 25px;
  text-align: left;
  max-width: 1100px;
`;

export default function WhyChooseUs() {
  return (
    <WhyChooseUsWrapper>
      <Title>Why Choose Us</Title>
      <Content>
        With the rapid growth of the EV industry, proper and timely maintenance
        is essential to ensure safety and extend the lifespan of vehicles.
        Here’s why customers trust us:
        <br />
        <br />
        <List>
          <li>
            <Highlight>Expert Team:</Highlight> Over 50 highly trained EV
            technicians.
          </li>
          <li>
            <Highlight>Advanced Technology:</Highlight> A smart management
            system that ensures transparency in every process.
          </li>
          <li>
            <Highlight>Proven Experience:</Highlight> 10 years of service,
            maintaining over 5,000 EVs from leading brands like VinFast, Tesla,
            and BYD.
          </li>
          <li>
            <Highlight>Customer-Centered:</Highlight> We prioritize your safety
            and satisfaction above all else.
          </li>
        </List>
      </Content>
    </WhyChooseUsWrapper>
  );
}
