import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import styled from "styled-components";
import logo from "../../../assets/EVCare.png";
import SwitchButton from "../../../components/SwitchButton/SwitchButton";
import TextFieldWithIcon from "../../../components/TextFieldWithIcon/TextFieldWithIcon";
import { HiOutlineMail } from "react-icons/hi";
import { FiKey } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import TextFieldAnimation from "../../../components/TextField/TextFieldAnimation";

const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: 60%;
    height: 90vh;
  }

  .modal-content {
    height: 100%;
    display: flex;
    font-family: "Outfit", sans-serif;
    border-radius: 12px;
    overflow: hidden;
  }
`;

const SideImage = styled.div<{ $isSignUp: boolean }>`
  width: 50%;
  height: 100%;
  position: absolute;
  left: ${(p) => (p.$isSignUp ? "0" : "50%")};
  border-radius: ${(p) => (p.$isSignUp ? "12px 0 0 12px" : "0 12px 12px 0")};
  background: ${(p) =>
    p.$isSignUp
      ? "linear-gradient(to right, #ebffe7, #f9fff8)"
      : "linear-gradient(to left, #ebffe7, #f9fff8)"};
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  img {
    width: 80%;
    object-fit: cover;
  }
`;

const FormContainer = styled(Modal.Body)<{ $isSignUp: boolean }>`
  position: absolute;
  right: ${(p) => (p.$isSignUp ? "0" : "50%")};
  width: 50%;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
  transition: right 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const HeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;

  h1 {
    color: #00ad4e;
    font-weight: 700;
    margin-bottom: 1rem;
  }
`;

const FormWrapper = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubmitBtn = styled.button`
  height: 45px;
  border: none;
  border-radius: 20px;
  background: #00ad4e;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #019344;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;

  hr {
    border: none;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
    margin: 0;
  }

  span {
    background: white;
    padding: 0 0.75rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: #6b6b6b;
    position: absolute;
    top: -0.6rem;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const NameGroup = styled.div`
  display: inline-flex;
  gap: 2%;
  > div {
    flex: 1;
  }
  input {
    width: 100%;
  }
`;

interface AuthProps {
  show: boolean;
  handleClose: () => void;
}

export default function Authentication({ show, handleClose }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <StyledModal show={show} onHide={handleClose} centered>
      <SideImage $isSignUp={isSignUp}>
        <img src={logo} alt="EVCare Logo" />
      </SideImage>

      <FormContainer $isSignUp={isSignUp}>
        <HeaderBox>
          <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
          <SwitchButton isSignUp={isSignUp} onChange={setIsSignUp} />
        </HeaderBox>

        <FormWrapper>
          {isSignUp && (
            <NameGroup>
              <TextFieldAnimation
                type="First Name"
                text={firstName}
                setText={setFirstName}
              />
              <TextFieldAnimation
                type="Last Name"
                text={lastName}
                setText={setLastName}
              />
            </NameGroup>
          )}
          <FieldGroup>
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
            {isSignUp && (
              <TextFieldWithIcon
                icon={<FiKey />}
                type="Confirm Password"
                text={confirm}
                setText={setConfirm}
              />
            )}
          </FieldGroup>

          {!isSignUp && (
            <Link
              to="#"
              style={{
                alignSelf: "flex-end",
                fontSize: "0.85rem",
                textDecoration: "none",
                color: "green",
              }}
            >
              Forgot Password?
            </Link>
          )}

          <SubmitBtn type="submit">
            {isSignUp ? "Sign Up" : "Sign In"}
          </SubmitBtn>

          <Divider>
            <hr />
            <span>OR</span>
          </Divider>

          <SubmitBtn
            type="button"
            style={{
              backgroundColor: "#ccc",
              color: "black",
            }}
          >
            <FcGoogle style={{ marginRight: "20px", fontSize: "25px" }} />
            {isSignUp ? "Sign Up with Google" : "Sign In with Google"}
          </SubmitBtn>
        </FormWrapper>
      </FormContainer>
    </StyledModal>
  );
}
