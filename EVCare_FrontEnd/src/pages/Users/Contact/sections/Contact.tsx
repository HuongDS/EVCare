import styled from "styled-components";
import EVcar from "../../../../assets/EVcar.webp";

const ContactWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 110px 50px;
`;

const ColumnsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  flex-wrap: wrap;
  padding-left: 10%;
  padding-right: 10%;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  min-width: 250px;
`;

const RightColumns = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 20px;
  min-width: 500px;
`;

const TopRightColumns = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 100px;
  flex-wrap: wrap;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h1`
  align-self: center;
  font-size: 70px;
  font-weight: 800;
  color: #00ad4e;
`;

const Subtitle = styled.h2`
  font-size: 25px;
  margin-bottom: 10px;
`;

const ContactInfo = styled.p`
  font-size: 20px;
  margin-bottom: 20px;
`;

const ContactContent = styled.p`
  font-size: 25px;
  margin-bottom: 20px;

  text-align: justify;
`;

const Image = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  align-self: center;
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
