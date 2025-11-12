import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import OTPForm from "../sections/OTPForm"; // Đường dẫn component của bạn

vi.mock("../../../components/SpinnerComponent.tsx", () => ({
  default: () => <div data-testid="loading-spinner" />,
}));

vi.mock("../../../components/Button/ShowButton.tsx", () => ({
  default: ({ text, onclick }: { text: string; onclick: () => void }) => <button onClick={onclick}>{text}</button>,
}));

const mockSetIsOpen = vi.fn();
const mockSetOtp = vi.fn();
const mockHandleVerifyOTP = vi.fn();

const baseProps = {
  setIsOpen: mockSetIsOpen,
  otp: new Array(6).fill(""),
  setOtp: mockSetOtp,
  handleVerifyOTP: mockHandleVerifyOTP,
  disable: false,
};

const getInputs = () => {
  return screen.getAllByRole("textbox");
};

describe("OTPForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("TC01: (disable=true) Display spinner and hide verify", () => {
    // ARRANGE
    render(<OTPForm {...baseProps} disable={true} />);
    // ASSERT
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Verify Code/i })).not.toBeInTheDocument();
  });

  it("TC02: (disable=false, incomplete) display Verify and disabled when OTP.length < 6", () => {
    // ARRANGE
    render(<OTPForm {...baseProps} disable={false} otp={["1", "2", "3", "", "", ""]} />);

    // ASSERT
    const verifyBtn = screen.getByRole("button", { name: /Verify Code/i });
    expect(verifyBtn).toBeInTheDocument();
    expect(verifyBtn).toBeDisabled();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  it("TC03: (disable=false, complete) verify button should enabled when OTP.length = 6", () => {
    // ARRANGE
    render(<OTPForm {...baseProps} disable={false} otp={["1", "2", "3", "4", "5", "6"]} />);
    // ASSERT
    const verifyBtn = screen.getByRole("button", { name: /Verify Code/i });
    expect(verifyBtn).toBeEnabled();
  });

  it("TC04: should handleVerifyOTP is called when click verify button", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<OTPForm {...baseProps} otp={["1", "2", "3", "4", "5", "6"]} />);
    const verifyBtn = screen.getByRole("button", { name: /Verify Code/i });
    // ACT
    await user.click(verifyBtn);
    // ASSERT
    expect(mockHandleVerifyOTP).toHaveBeenCalledOnce();
  });

  it("TC05: should setIsOpen(false) is called and setOtp([]) when click back button", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<OTPForm {...baseProps} />);
    const backBtn = screen.getByRole("button", { name: /Back/i });
    // ACT
    await user.click(backBtn);
    // ASSERT
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    expect(mockSetOtp).toHaveBeenCalledWith([]);
    expect(mockSetIsOpen).toHaveBeenCalledOnce();
    expect(mockSetOtp).toHaveBeenCalledOnce();
  });

  it("TC06: when input is not number, setOtp should not be called", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<OTPForm {...baseProps} />);
    const inputs = getInputs();
    // ACT
    await user.type(inputs[0], "a");
    // ASSERT
    expect(mockSetOtp).not.toHaveBeenCalled();
  });

  it("TC07: should setOtp is called and auto focus-forward when input valid", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<OTPForm {...baseProps} />);
    const inputs = getInputs();
    // ACT
    await user.type(inputs[0], "1");

    // ASSERT
    expect(mockSetOtp).toHaveBeenCalledWith(expect.any(Function));
    expect(inputs[1]).toHaveFocus();
  });

  it("TC08: Auto focus-backward when delete 1 input", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<OTPForm {...baseProps} otp={["1", "2", "", "", "", ""]} />);
    const inputs = getInputs();
    inputs[1].focus();
    // ACT
    await user.keyboard("{Backspace}");

    // ASSERT
    expect(mockSetOtp).toHaveBeenCalledWith(expect.any(Function));
    expect(inputs[0]).toHaveFocus();
  });

  it("TC09: handle Paste", () => {
    // ARRANGE
    render(<OTPForm {...baseProps} />);
    const inputs = getInputs();
    // ACT
    fireEvent.paste(inputs[0], {
      clipboardData: {
        getData: () => "1a2b3c4",
      },
    });
    // ASSERT
    expect(mockSetOtp).toHaveBeenCalledOnce();
  });
});
