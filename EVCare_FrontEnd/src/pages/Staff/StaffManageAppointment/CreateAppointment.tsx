import styled from "styled-components";

interface Props {
  onBack: () => void;
}

export default function CreateAppointmentPage({ onBack }: Props) {
  return (
    <Wrapper>
      <Header>
        <button onClick={onBack}>← Back</button>
        <h2>Create Appointment</h2>
      </Header>
      <Content>
        {/* Form tạo appointment của bạn */}
        <p>Form create appointment sẽ đặt ở đây.</p>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #fff;
  height: 100%;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
`;

const Content = styled.div`
  margin-top: 20px;
`;
