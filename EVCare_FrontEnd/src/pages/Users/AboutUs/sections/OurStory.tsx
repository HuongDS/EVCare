import styled from "styled-components";
import ourStoryImg from "../../../../assets/OurStoryImg.jpg";
import ScrollFloat from "../../../../components/TextAnimation/ScrollFloat";

const OurVisionWrapper = styled.section`
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  padding: 6vw 4vw;
  gap: 4vw;
  background: linear-gradient(180deg, #ffffff 0%, #f6fff9 100%);
  overflow: hidden;

  @media (max-width: 992px) {
    flex-direction: column-reverse;
    text-align: center;
    padding: 10vw 6vw;
  }
`;

const Image = styled.img`
  max-width: 35%;
  border-radius: 24px;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(0, 100, 0, 0.15);
  transition: transform 0.5s ease, box-shadow 0.5s ease;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 12px 35px rgba(0, 100, 0, 0.25);
  }

  @media (max-width: 992px) {
    max-width: 80%;
  }
`;

const Content = styled.div`
  font-size: clamp(1rem, 2vw, 2rem);
  max-width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;

  @media (max-width: 992px) {
    max-width: 90%;
  }
`;

const Title = styled.h1`
  color: #16a34a;
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  text-align: left;
  margin-bottom: 1rem;

  @media (max-width: 992px) {
    text-align: center;
  }
`;

const Story = styled.p`
  font-size: clamp(1rem, 2vw, 1.8rem);
  color: #1e293b;
  text-align: justify;
  line-height: 1.7;
  background: rgba(255, 255, 255, 0.7);
  padding: 1.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 100, 0, 0.05);
  backdrop-filter: blur(8px);

  @media (max-width: 992px) {
    text-align: center;
  }
`;

const Highlight = styled.span`
  color: #0039a6;
  font-weight: 700;
`;

export default function OurStory() {
  return (
    <OurVisionWrapper data-aos="fade-up">
      <Image src={ourStoryImg} data-aos="zoom-in" data-aos-delay="100" />
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
