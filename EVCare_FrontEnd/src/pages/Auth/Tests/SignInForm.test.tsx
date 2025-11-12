import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import SignInForm from "../sections/SignInForm"; // Đường dẫn component của bạn
import * as Validation from "../validation/validation"; // Đường dẫn file validation
import { ERROR_MESSAGE } from "../../../constants/messages/Message";

vi.mock("../../../components/SpinnerComponent.tsx", () => ({
  default: () => <div data-testid="mock-spinner" />,
}));

vi.mock("../../../components/TextFieldWithIcon/TextFieldWithIcon", () => ({
  default: ({ label, text, setText, error, errorMessage }: any) => (
    <div data-testid={`mock-textfield-${label}`}>
      <input aria-label={label} value={text} onChange={(e) => setText(e.target.value)} />
      {error && <span>{errorMessage}</span>}
    </div>
  ),
}));

vi.mock("react-router", () => ({
  Link: ({ to, onClick, children, ...props }: any) => (
    <a href={to} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("antd", () => ({
  Tooltip: ({ title, children }: any) => (
    <div data-testid="mock-tooltip" data-title={title}>
      {children}
    </div>
  ),
}));

const mockedIsValidEmail = vi.spyOn(Validation, "isValidEmail");
const mockedIsValidPassword = vi.spyOn(Validation, "isValidPassword");

const mockSetEmail = vi.fn();
const mockSetPassword = vi.fn();
const mockHandleLogin = vi.fn();
const mockHandleIsForgot = vi.fn();

const baseProps = {
  email: "",
  setEmail: mockSetEmail,
  password: "",
  setPassword: mockSetPassword,
  disable: false,
  handleLogin: mockHandleLogin,
  handleIsForgot: mockHandleIsForgot,
};

// Helper
const getSignInButton = () => screen.getByRole("button", { name: /Sign In/i });
const getEmailInput = () => screen.getByLabelText(/Email/i);
const getPasswordInput = () => screen.getByLabelText(/Password/i);

describe("SignInForm ", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("TC01: should show Spinner when 'disable' prop (external loading) is true", () => {
    // ARRANGE
    render(<SignInForm {...baseProps} disable={true} />);
    // ASSERT
    expect(screen.getByTestId("mock-spinner")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Sign In/i })).not.toBeInTheDocument();
  });

  it("TC02: should disable Sign In button when form is invalid (internal logic)", () => {
    // ARRANGE
    mockedIsValidEmail.mockReturnValue(false);
    mockedIsValidPassword.mockReturnValue(true);
    render(<SignInForm {...baseProps} />);
    // ASSERT
    expect(getSignInButton()).toBeDisabled();
  });

  it("TC03: should enable Sign In button when form is valid (internal logic)", () => {
    // ARRANGE
    mockedIsValidEmail.mockReturnValue(true);
    mockedIsValidPassword.mockReturnValue(true);
    render(<SignInForm {...baseProps} />);
    // ASSERT
    expect(getSignInButton()).toBeEnabled();
  });

  it("TC04 [Interaction]: should call handleLogin when (enabled) Sign In button is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockedIsValidEmail.mockReturnValue(true);
    mockedIsValidPassword.mockReturnValue(true);
    render(<SignInForm {...baseProps} />);
    // ACT
    await user.click(getSignInButton());
    // ASSERT
    expect(mockHandleLogin).toHaveBeenCalledOnce();
  });

  it("TC05 [Interaction]: should call handleIsForgot when 'Forgot Password' link is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<SignInForm {...baseProps} />);
    const forgotLink = screen.getByText(/Forgot Password?/i);
    // ACT
    await user.click(forgotLink);
    // ASSERT
    expect(mockHandleIsForgot).toHaveBeenCalledOnce();
  });

  it("TC06 [Interaction]: should call setEmail when user types in email field", async () => {
    // ARRANGE
    render(<SignInForm {...baseProps} />);
    // ACT
    fireEvent.change(getEmailInput(), { target: { value: "test" } });
    // ASSERT
    expect(mockSetEmail).toHaveBeenLastCalledWith("test");
  });

  it("TC07 [Interaction]: should call setPassword when user types in password field", async () => {
    // ARRANGE
    render(<SignInForm {...baseProps} />);

    // ACT
    fireEvent.change(getPasswordInput(), { target: { value: "pass" } });

    // ASSERT
    expect(mockSetPassword).toHaveBeenLastCalledWith("pass");
  });

  it("TC08: should show email error message when email is invalid and not empty", () => {
    // ARRANGE
    mockedIsValidEmail.mockReturnValue(false);
    render(<SignInForm {...baseProps} email="invalid" />);

    // ASSERT
    expect(screen.getByText(ERROR_MESSAGE.INVALID_EMAIL)).toBeInTheDocument();
  });

  it("TC09: should show password error message when password is invalid and not empty", () => {
    // ARRANGE
    mockedIsValidPassword.mockReturnValue(false);
    render(<SignInForm {...baseProps} password="123" />);
    // ASSERT
    expect(screen.getByText(ERROR_MESSAGE.INVALID_PASSWORD_LOGIN)).toBeInTheDocument();
  });

  it("TC10: should NOT show error messages when fields are empty (pristine)", () => {
    // ARRANGE
    mockedIsValidEmail.mockReturnValue(false);
    mockedIsValidPassword.mockReturnValue(false);
    render(<SignInForm {...baseProps} />);
    // ASSERT
    expect(screen.queryByText(ERROR_MESSAGE.INVALID_EMAIL)).not.toBeInTheDocument();
    expect(screen.queryByText(ERROR_MESSAGE.INVALID_PASSWORD_LOGIN)).not.toBeInTheDocument();
  });
});
