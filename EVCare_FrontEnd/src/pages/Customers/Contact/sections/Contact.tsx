import styled from "styled-components";
import EVcar from "../../../../assets/EVcar.webp";

const ContactWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 110px 50px;
`;

const ColumnsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  padding-left: 200px;
  padding-right: 200px;
`;

const LeftColumn = styled.div`
  flex: 1;
  min-width: 250px;
`;

const RightColumns = styled.div`
  display: flex;
  flex-direction: column; /* đổi thành column để ảnh xuống dưới */
  flex: 1;
  gap: 20px; /* khoảng cách giữa hàng cột và ảnh */
  min-width: 500px;
`;

const TopRightColumns = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 100px; /* khoảng cách giữa cột 2 và cột 3 */
  flex-wrap: wrap;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h1`
  margin-top: 100px;
  font-size: 70px;
  font-weight: 800;
  margin-bottom: 30px;
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
`;

const Image = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  margin-top: 20px;
  margin-left: auto;
  align-self: center;
`;

export default function Contact() {
  return (
    <ContactWrapper>
      <ColumnsWrapper>
        {/* Left Column */}
        <LeftColumn>
          <Title>Contact Us</Title>
          <ContactContent>
            If you have any questions, feedback, or need assistance, please feel
            free to reach out to us. We are here to help!
          </ContactContent>
        </LeftColumn>

        {/* Right Columns */}
        <RightColumns>
          <TopRightColumns>
            {/* Column 2 */}
            <Column>
              <Subtitle>
                <i className="bi bi-envelope"></i> Email
              </Subtitle>
              <ContactInfo>evcare@gmail.com</ContactInfo>

              <Subtitle>
                <i className="bi bi-telephone-fill"></i> Hotline
              </Subtitle>
              <ContactInfo>+1234567890</ContactInfo>
            </Column>

            {/* Column 3 */}
            <Column>
              <Subtitle>
                <i className="bi bi-facebook"></i> Facebook
              </Subtitle>
              <ContactInfo>EVcare Vietnam</ContactInfo>

              <Subtitle>Address</Subtitle>
              <ContactInfo>Thu Duc, HCM</ContactInfo>
            </Column>
          </TopRightColumns>

          {/* Image nằm dưới 2 cột */}
          <Image src={EVcar} alt="EVcar" />
        </RightColumns>
      </ColumnsWrapper>
    </ContactWrapper>
  );
}
