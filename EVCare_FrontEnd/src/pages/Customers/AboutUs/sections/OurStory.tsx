import styled from "styled-components";
import ourStoryImg from "../../../../assets/OurStoryImg.jpg";
const OurVisionWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  display: flex;
  justify-content: space-evenly;
  padding: 1% 0 1% 0;
`;

const Box = styled.div`
  height: auto;
  width: auto;
  padding: 2% 5% 2% 5%;
`;

const Title = styled.h1`
  font-size: 50px;
  font-weight: 800;
`;

const Content = styled.p`
  font-size: 25px;
  text-align: justify;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Highlight = styled.span`
  color: #0039a6;
  font-weight: 700;
`;

const Image = styled.img`
  width: 100%;
  max-width: 30%;
  border-radius: 20px;
  align-self: center;
  justify-content: center;
`;

const Story = styled.p`
  align-self: bottom;
`;
export default function OurStory() {
  return (
    <Box>
      <OurVisionWrapper>
        <Image src={ourStoryImg} />
        <Content>
          <Title>Our Story</Title>
          <Story>
            <Highlight>EV Care</Highlight> was founded to deliver smart and
            modern maintenance solutions for the fast-growing EV industry. We
            provide a <Highlight>transparent system</Highlight> that{" "}
            <Highlight>saves time and cost</Highlight>, connecting{" "}
            <Highlight>skilled technicians</Highlight> with customers to ensure{" "}
            <Highlight>safe and efficient</Highlight> vehicle care.
          </Story>
        </Content>
      </OurVisionWrapper>
    </Box>
  );
}
