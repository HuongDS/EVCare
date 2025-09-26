import styled from "styled-components";
import EVcar from "../../../../assets/EVcar.webp";

const ContactWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 10vw 5%;
`;

const ColumnsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  flex-wrap: wrap;
  gap: 3vw;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  min-width: 250px;
  padding-right: 2vw;
`;

const RightColumns = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 2vw;
  min-width: 300px;
`;

const TopRightColumns = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 5vw;
  flex-wrap: wrap;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h1`
  align-self: center;
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  color: #00ad4e;
`;

const Subtitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 10px;
  color: #00ad4e;
`;

const ContactInfo = styled.p`
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  margin-bottom: 20px;
`;

const ContactContent = styled.p`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  margin-bottom: 20px;
  text-align: justify;
`;

const Image = styled.img`
  width: 100%;
  max-width: 75%;
  border-radius: 10px;
  align-self: center;
  margin-top: 2vw;
`;

export default function Contact() {
  return (
    <ContactWrapper>
      <ColumnsWrapper>
        <LeftColumn>
          <Title>Contact Us</Title>
          <ContactContent>
            If you have any questions, feedback, or need assistance, please feel
            free to reach out to us. We are here to help!
          </ContactContent>
        </LeftColumn>

        <RightColumns>
          <TopRightColumns>
            <Column>
              <Subtitle>
                <i className="bi bi-envelope-fill"></i> Email
              </Subtitle>
              <ContactInfo>evcare@gmail.com</ContactInfo>

              <Subtitle>
                <i className="bi bi-telephone-fill"></i> Hotline
              </Subtitle>
              <ContactInfo>(+84) 0123.456.789</ContactInfo>
            </Column>

            <Column>
              <Subtitle>
                <i className="bi bi-facebook"></i> Facebook
              </Subtitle>
              <ContactInfo>EVcare Vietnam</ContactInfo>

              <Subtitle>
                <i className="bi bi-geo-alt-fill"></i> Address
              </Subtitle>
              <ContactInfo>Thu Duc, HCM</ContactInfo>
            </Column>
          </TopRightColumns>

          <Image src={EVcar} alt="EVcar" />
        </RightColumns>
      </ColumnsWrapper>
    </ContactWrapper>
  );
}
