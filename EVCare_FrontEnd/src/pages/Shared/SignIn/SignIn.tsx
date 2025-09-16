import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styled from "styled-components";
import logo from "../../../assets/EVCare.png";
import SwitchButton from "../../../components/SwitchButton/SwitchButton";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import { HiOutlineMail } from "react-icons/hi";
import { FiKey } from "react-icons/fi";
import { Link } from "react-router";

const ModalStyled = styled(Modal)`
  .modal-dialog {
    max-width: 60%;
    height: 90vh;
  }

  .modal-content {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: "Outfit", sans-serif;
    border-radius: 10px;
  }
`;

const ModalContent = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* margin: 0 auto; */
  max-width: 90%;
  h1 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: #00ad4e;
    font-weight: 700;
  }

  .form-label {
    margin: 0;
  }
`;

const ModalImage = styled.div`
  border-radius: 10px 0 0 10px;
  background: linear-gradient(to right, #ebffe7, #f9fff8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  img {
    width: 450px;
    height: 500px;
    object-fit: cover;
  }
`;

const GroupField = styled.div`
  & > * {
    margin: 5px 0;
  }
`;

interface SignInModalProps {
  show: boolean;
  handleClose: () => void;
}

export default function SignInModal({ show, handleClose }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <ModalStyled show={show} onHide={handleClose} centered>
      <ModalImage>
        <img src={logo} alt="" />
      </ModalImage>
      <ModalContent>
        <h1>Welcome Back</h1>
        <SwitchButton isSignUp={isSignUp} onChange={setIsSignUp} />
        {!isSignUp ? (
          <Form>
            <GroupField>
              <TextFieldWithIcon
                icon={<HiOutlineMail />}
                type="Email"
                text={email}
                setText={setEmail}
              />
              <TextFieldWithIcon
                icon={<FiKey />}
                type="Password"
                text={password}
                setText={setPassword}
              />
            </GroupField>

            <Link to="#">Forgot Password?</Link>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        ) : (
          <Form>
            {/* <SignUpModal show={show} handleClose={handleClose} /> */}
          </Form>
        )}
      </ModalContent>
    </ModalStyled>
  );
}
