import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthForm from "../sections/AuthForm";
import userEvent from "@testing-library/user-event";

vi.mock("../Authentication.styled");

vi.mock("../Authentication.styled", () => ({
  FormWrapper: ({ children }: any) => <div data-testid="form-wrapper">{children}</div>,
  Divider: ({ children }: any) => <div data-testid="divider">{children}</div>,
}));

vi.mock("../sections/SignUpForm", () => ({
  default: ({ handleSignUp, disable }: any) => (
    <div data-testid="sign-up-form">
      <button onClick={handleSignUp} disabled={disable}>
        Sign Up
      </button>
    </div>
  ),
}));

vi.mock("../sections/SignInForm", () => ({
  default: ({ handleIsForgot, handleLogin, disable }: any) => {
    return (
      <div data-testid="sign-in-form">
        <button onClick={handleIsForgot} disabled={disable}>
          Forgot Password
        </button>
        <button onClick={handleLogin} disabled={disable}>
          Login
        </button>
      </div>
    );
  },
}));

vi.mock("../google/GoogleButton", () => ({
  default: () => {
    return <div data-testid="google-button" />;
  },
}));

vi.mock("../sections/SignUpForm", () => ({
  default: ({ handleSignUp }: any) => (
    <div data-testid="sign-up-form">
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  ),
}));

vi.mock("../sections/SignInForm", () => ({
  default: ({ handleIsForgot, handleLogin }: any) => {
    return (
      <div data-testid="sign-in-form">
        <button onClick={handleIsForgot}>Forgot Password</button>
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  },
}));

const mockProps = {
  isSignUp: true,
  email: "test@gmail.com",
  setEmail: vi.fn(),
  password: "12345678@s",
  setPassword: vi.fn(),
  confirm: "12345678@s",
  setConfirm: vi.fn(),
  firstName: "Unit",
  setFirstName: vi.fn(),
  lastName: "Test01",
  setLastName: vi.fn(),
  phone: "0911111111",
  setPhone: vi.fn(),
  handleSignUp: vi.fn(),
  handleLogin: vi.fn(),
  isForgot: false,
  setIsForgot: vi.fn(),
  disable: false,
};

describe("AuthFormProps", () => {
  it("TC01: should render sign-up form when isSignUp is true", () => {
    // ARRANGE
    render(<AuthForm {...mockProps} isSignUp={true} />);
    // ACT
    // ASSERT
    expect(screen.queryByTestId("sign-up-form")).toBeInTheDocument();
    expect(screen.queryByTestId("sign-in-form")).not.toBeInTheDocument();
  });

  it("TC02: should render sign-uin form when isSignUp is false", () => {
    // ARRANGE
    render(<AuthForm {...mockProps} isSignUp={false} />);
    // ACT
    // ASSERT
    expect(screen.queryByTestId("sign-up-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("sign-in-form")).toBeInTheDocument();
  });

  it("TC03: whether google button and divider is always rendered", () => {
    // ARRANGE
    render(<AuthForm {...mockProps} />);
    // ACT
    // ASSERT
    expect(screen.getByTestId("google-button")).toBeInTheDocument();
    expect(screen.getByText("OR")).toBeInTheDocument();
  });

  it("TC04: should call setIsForgot when 'Forgot Password' is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<AuthForm {...mockProps} isSignUp={false} />);
    // ACT
    await user.click(screen.getByRole("button", { name: /forgot password/i }));
    // ASSERT
    expect(mockProps.setIsForgot).toHaveBeenCalledTimes(1);
    expect(mockProps.setIsForgot).toHaveBeenCalledWith(true);
  });

  it("TC05: should call handleSignUp when sign-up button is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<AuthForm {...mockProps} isSignUp={true} />);
    // ACT
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    // ASSERT
    expect(mockProps.handleSignUp).toHaveBeenCalledOnce();
  });

  it("TC06: should call handleLogin when login button is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<AuthForm {...mockProps} isSignUp={false} />);
    // ACT
    await user.click(screen.getByRole("button", { name: /login/i }));
    // ASSERT
    expect(mockProps.handleLogin).toHaveBeenCalledOnce();
  });
});
