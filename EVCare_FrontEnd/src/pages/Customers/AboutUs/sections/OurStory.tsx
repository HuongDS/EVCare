import styled from "styled-components";

const OurVisionWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 0px 0;
  text-align: center;
  padding-top: 50px;
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
  color: #00ad4e;
  font-weight: 700;
`;

export default function OurStory() {
  return (
    <OurVisionWrapper>
      <Title>Our Story</Title>
      <Content>
        <Highlight>EV Care</Highlight> was founded with the mission of bringing{" "}
        <Highlight>smart and modern maintenance solutions</Highlight> to the
        rapidly growing <Highlight>electric vehicle (EV) industry</Highlight>.
        From the very beginning, we recognized the urgent need for a{" "}
        <Highlight>transparent system</Highlight> that saves both{" "}
        <Highlight>time and cost</Highlight> for customers. Through a journey of{" "}
        <Highlight>continuous innovation</Highlight>, we have built an{" "}
        <Highlight>advanced technology</Highlight> platform that connects{" "}
        <Highlight>experienced technicians</Highlight> with customers, ensuring
        every EV is maintained <Highlight>safely and efficiently</Highlight>.
      </Content>
    </OurVisionWrapper>
  );
}
