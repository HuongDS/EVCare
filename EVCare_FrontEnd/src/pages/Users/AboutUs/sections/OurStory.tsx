import styled from "styled-components";
import ourStoryImg from "../../../../assets/OurStoryImg.jpg";
import ScrollFloat from "../../../../components/TextAnimation/ScrollFloat";

const OurVisionWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 5vw;
  gap: 2vw;
`;

const Title = styled.h1`
  color: #16a34a;
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  text-align: center;
`;

const Content = styled.div`
  font-size: clamp(1rem, 2vw, 2.5rem);
  text-align: justify;
  max-width: 53%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Highlight = styled.span`
  color: #0039a6;
  font-weight: 700;
`;

const Image = styled.img`
  max-width: 25%;
  border-radius: 20px;
  align-self: center;
`;

const Story = styled.p`
  margin-top: 1rem;
`;

export default function OurStory() {
  return (
    <OurVisionWrapper data-aos="fade-up">
      <Image src={ourStoryImg} />
      <Content>
        <Title>
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.05}
          >
            Our Story
          </ScrollFloat>
        </Title>
        <Story data-aos="fade-up" data-aos-delay="200">
          <Highlight>EV Care</Highlight> was founded to deliver smart and modern
          maintenance solutions for the fast-growing EV industry. We provide a{" "}
          <Highlight>transparent system</Highlight> that{" "}
          <Highlight>saves time and cost</Highlight>, connecting{" "}
          <Highlight>skilled technicians</Highlight> with customers to ensure{" "}
          <Highlight>safe and efficient</Highlight> vehicle care.
        </Story>
      </Content>
    </OurVisionWrapper>
  );
}
