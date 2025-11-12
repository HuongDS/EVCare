import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import SignUpForm from "../sections/SignUpForm";
import * as Validation from "../validation/validation";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";

vi.mock("../../../components/SpinnerComponent.tsx", () => ({
  default: () => <div data-testid="mock-spinner" />,
}));

vi.mock("../../../components/TextField/TextFieldAnimation", () => ({
  default: ({ type, text, setText, error }: any) => (
    <div>
      <input aria-label={type} value={text} onChange={(e) => setText(e.target.value)} data-error={error} />
    </div>
  ),
}));

vi.mock("../../../components/TextFieldWithIcon/TextFieldWithIcon", () => ({
  default: ({ label, text, setText, error, errorMessage }: any) => (
    <div>
      <input aria-label={label} value={text} onChange={(e) => setText(e.target.value)} />
      {error && <span>{errorMessage}</span>}
    </div>
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
const mockedIsValidSignUpPassword = vi.spyOn(Validation, "isValidSignUpPassword");
const mockedIsValidConfirmPassword = vi.spyOn(Validation, "isValidConfirmPassword");
const mockedIsValidPhoneNumber = vi.spyOn(Validation, "isValidPhoneNumber");

const mockSetFirstName = vi.fn();
const mockSetLastName = vi.fn();
const mockSetEmail = vi.fn();
const mockSetPassword = vi.fn();
const mockSetConfirm = vi.fn();
const mockSetPhone = vi.fn();
const mockHandleSignUp = vi.fn();

const baseProps = {
  firstName: "",
  setFirstName: mockSetFirstName,
  lastName: "",
  setLastName: mockSetLastName,
  email: "",
  setEmail: mockSetEmail,
  password: "",
  setPassword: mockSetPassword,
  confirm: "",
  setConfirm: mockSetConfirm,
  phone: "",
  setPhone: mockSetPhone,
  disable: false,
  handleSignUp: mockHandleSignUp,
};

const getSignUpButton = () => screen.getByRole("button", { name: /Sign Up/i });

describe("SignUpForm Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("TC01: should show Spinner when 'disable' prop (external loading) is true", () => {
    // ARRANGE
    render(<SignUpForm {...baseProps} disable={true} />);
    // ASSERT
    expect(screen.getByTestId("mock-spinner")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Sign Up/i })).not.toBeInTheDocument();
  });

  it("TC02: should disable Sign Up button when form is internally invalid", () => {
    // ARRANGE
    mockedIsValidEmail.mockReturnValue(true);
    mockedIsValidSignUpPassword.mockReturnValue(true);
    mockedIsValidConfirmPassword.mockReturnValue(true);
    mockedIsValidPhoneNumber.mockReturnValue(false);
    render(<SignUpForm {...baseProps} disable={false} />);
    // ASSERT
    expect(getSignUpButton()).toBeDisabled();
  });

  it("TC03: should enable Sign Up button when form is valid", () => {
    // ARRANGE
    mockedIsValidEmail.mockReturnValue(true);
    mockedIsValidSignUpPassword.mockReturnValue(true);
    mockedIsValidConfirmPassword.mockReturnValue(true);
    mockedIsValidPhoneNumber.mockReturnValue(true);
    render(<SignUpForm {...baseProps} disable={false} />);
    // ASSERT
    expect(getSignUpButton()).toBeEnabled();
  });

  it("TC04: should call handleSignUp when (enabled) Sign Up button is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockedIsValidEmail.mockReturnValue(true);
    mockedIsValidSignUpPassword.mockReturnValue(true);
    mockedIsValidConfirmPassword.mockReturnValue(true);
    mockedIsValidPhoneNumber.mockReturnValue(true);
    render(<SignUpForm {...baseProps} />);
    // ACT
    await user.click(getSignUpButton());
    // ASSERT
    expect(mockHandleSignUp).toHaveBeenCalledOnce();
  });

  it("TC05: should call all 'set' callbacks when user types in fields", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<SignUpForm {...baseProps} />);
    // ACT & ASSERT
    await user.type(screen.getByLabelText(/First Name/i), "Test");
    expect(mockSetFirstName).toHaveBeenLastCalledWith("t");
    await user.type(screen.getByLabelText(/Email/i), "a@b");
    expect(mockSetEmail).toHaveBeenLastCalledWith("b");
  });

  it("TC06: should show field-level error when field is invalid and not empty", () => {
    // ARRANGE
    mockedIsValidEmail.mockReturnValue(false);
    render(<SignUpForm {...baseProps} email="invalid" />);
    // ASSERT
    expect(screen.getByText(ERROR_MESSAGE.INVALID_EMAIL)).toBeInTheDocument();
    const firstNameInput = screen.getByLabelText(/^First Name/i);
    expect(firstNameInput.getAttribute("data-error")).toBe("false");
  });

  it("TC07: should NOT show field-level errors when fields are empty (pristine)", () => {
    // ARRANGE
    render(<SignUpForm {...baseProps} />);
    // ASSERT
    expect(screen.queryByText(ERROR_MESSAGE.INVALID_EMAIL)).not.toBeInTheDocument();
    expect(screen.queryByText(ERROR_MESSAGE.INVALID_PASSWORD)).not.toBeInTheDocument();
    const firstNameInput = screen.getByLabelText(/First Name/i);
    expect(firstNameInput.getAttribute("data-error")).toBe("false");
  });
});
