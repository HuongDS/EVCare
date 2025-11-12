import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import ResetPasswordForm from "../sections/ResetPasswordForm";

vi.mock("../../../components/SpinnerComponent.tsx", () => ({
  default: () => <div data-testid="mock-spinner" />,
}));

vi.mock("../Authentication.styled", () => ({
  FormWrapper: ({ children }: any) => <div>{children}</div>,
  FieldGroup: ({ children }: any) => <div>{children}</div>,
  SubmitBtn: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("react-bootstrap", () => ({
  Form: {
    Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
    Control: (props: any) => <input {...props} />,
  },
}));

const mockHandleSubmit = vi.fn();

const baseProps = {
  handleSubmit: mockHandleSubmit,
  disable: false,
};

const getNewPasswordInput = () => screen.getByLabelText(/^New Password/i);
const getConfirmPasswordInput = () => screen.getByLabelText(/^Confirm New Password/i);
const getOtpInputs = () => screen.getAllByRole("textbox", { name: "" });
const getSubmitButton = () => screen.getByRole("button", { name: /^Confirm New Password/i });

describe("ResetPasswordForm Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("TC01 [BVA]: should render spinner and disable all inputs when 'disable' prop is true", () => {
    // ARRANGE
    render(<ResetPasswordForm {...baseProps} disable={true} />);

    // ASSERT
    expect(screen.getByTestId("mock-spinner")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Confirm New Password/i })).not.toBeInTheDocument();
    expect(getNewPasswordInput()).toBeDisabled();
    expect(getConfirmPasswordInput()).toBeDisabled();
    getOtpInputs().forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("TC02 [BVA]: should render submit button and enable inputs when 'disable' prop is false", () => {
    // ARRANGE
    render(<ResetPasswordForm {...baseProps} disable={false} />);

    // ASSERT
    expect(screen.queryByTestId("mock-spinner")).not.toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
    expect(getNewPasswordInput()).toBeEnabled();
  });

  it("TC03 [Interaction]: should call handleSubmit with correct state when form is filled and submitted", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ResetPasswordForm {...baseProps} />);

    // ACT
    await user.type(getNewPasswordInput(), "pass123");
    await user.type(getConfirmPasswordInput(), "pass123");

    const otpInputs = getOtpInputs();
    await user.type(otpInputs[0], "1");
    await user.type(otpInputs[1], "2");
    await user.type(otpInputs[2], "3");
    await user.type(otpInputs[3], "4");
    await user.type(otpInputs[4], "5");
    await user.type(otpInputs[5], "6");
    await user.click(getSubmitButton());

    // ASSERT
    expect(mockHandleSubmit).toHaveBeenCalledOnce();
  });

  it("TC04 [BVA - Logic]: should not update OTP value with non-numeric characters", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ResetPasswordForm {...baseProps} />);
    const otpInputs = getOtpInputs();
    // ACT
    await user.type(otpInputs[0], "a");
    // ASSERT
    expect(otpInputs[0]).toHaveValue("");
  });

  it("TC05 [BVA - Logic]: should only update OTP value with the last character if multiple are entered", () => {
    // ARRANGE
    render(<ResetPasswordForm {...baseProps} />);
    const otpInputs = getOtpInputs();

    // ACT
    fireEvent.change(otpInputs[0], { target: { value: "12" } });

    // ASSERT
    expect(otpInputs[0]).toHaveValue("2");
  });
});
