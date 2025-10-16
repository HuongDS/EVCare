import styled from "styled-components";
import TextType from "../../../../components/TextType/TextType";

const BannerWrapper = styled.section`
  font-family: "Outfit", sans-serif;
  width: 100%;
  height: 30vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #16a34a, #1e293b);
  color: white;
  text-align: center;
  padding: 2rem;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.div`
  font-size: 1.5rem;
  opacity: 0.9;
  font-weight: 400;
`;

export default function Banner() {
  return (
    <BannerWrapper>
      <Title>
        <TextType
          text={"Our Customers Feedback"}
          typingSpeed={70}
          deletingSpeed={40}
          textColors={["#ffffff"]}
          showCursor={false}
          loop={false}
        />
      </Title>

      <Subtitle>
        <TextType
          text={[
            "Professional EV maintenance",
            "Trusted by thousands of customers",
            "Fast • Reliable • Eco-friendly",
          ]}
          typingSpeed={70}
          deletingSpeed={40}
          pauseDuration={2000}
          variableSpeed={{ min: 50, max: 120 }}
          showCursor
          cursorCharacter="|"
          textColors={["#ffffff", "#bbf7d0", "#d1fae5"]}
        />
      </Subtitle>
    </BannerWrapper>
  );
}
