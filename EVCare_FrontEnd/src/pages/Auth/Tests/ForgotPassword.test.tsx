import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ForgotPassword from "../sections/ForgotPassword";
import userEvent from "@testing-library/user-event";

const mockSetEmail = vi.fn();
const mockHandleChangeIsForgot = vi.fn();
const mockSetIsForgot = vi.fn();

vi.mock("../../../components/SpinnerComponent.tsx", () => ({
  default: () => {
    return <div data-testid="loading-spinner" />;
  },
}));

beforeEach(() => {
  mockSetEmail.mockClear();
  mockHandleChangeIsForgot.mockClear();
});

describe("Forgot Password", () => {
  it("TC01: Test render when isLoading is false", () => {
    // ARRANGE
    render(
      <ForgotPassword
        email="test@gmail.com"
        setEmail={mockSetEmail}
        isLoading={false}
        handChangeIsForgot={mockHandleChangeIsForgot}
        setIsForgot={mockSetIsForgot}
      />
    );
    // ACT
    // ASSERT
    expect(screen.queryByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("TC02: Test render when isLoading is true", () => {
    // ARRANGE
    render(
      <ForgotPassword
        email="test@gmail.com"
        setEmail={mockSetEmail}
        isLoading={true}
        handChangeIsForgot={mockHandleChangeIsForgot}
        setIsForgot={mockSetIsForgot}
      />
    );
    // ACT
    // ASSERT
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("TC03: Whether setEmail was called when user typing", async () => {
    // ARRANGE
    render(
      <ForgotPassword
        email=""
        setEmail={mockSetEmail}
        isLoading={false}
        handChangeIsForgot={mockHandleChangeIsForgot}
        setIsForgot={mockSetIsForgot}
      />
    );
    const input = screen.getByRole("textbox");
    const user = userEvent.setup();
    // ACT
    await user.type(input, "test@gmail.com");
    // ASSERT
    expect(mockSetEmail).toHaveBeenCalledTimes(14);
  });

  it("TC04: Whether handChangeIsForgot was called when user click send button", async () => {
    // ARRANGE
    render(
      <ForgotPassword
        email="test@gmail.com"
        setEmail={mockSetEmail}
        isLoading={false}
        handChangeIsForgot={mockHandleChangeIsForgot}
        setIsForgot={mockSetIsForgot}
      />
    );
    const user = userEvent.setup();
    const submitBtn = screen.getByRole("button", { name: /send/i });
    // ACT
    await user.click(submitBtn);
    // ASSERT
    expect(mockHandleChangeIsForgot).toHaveBeenCalledOnce();
  });
});
