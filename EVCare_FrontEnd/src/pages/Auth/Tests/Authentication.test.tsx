import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Authentication from "../Authentication";
import { useAuthentication } from "../../../hooks/useAuthentication";

vi.mock("../../../hooks/useAuthentication", () => ({
  useAuthentication: vi.fn(),
}));
const mockedUseAuth = vi.mocked(useAuthentication);

vi.mock("../sections/AuthForm.tsx", () => ({
  default: () => <div data-testid="mock-auth-form" />,
}));
vi.mock("../sections/ResetPasswordForm.tsx", () => ({
  default: () => <div data-testid="mock-reset-form" />,
}));
vi.mock("../sections/ForgotPassword.tsx", () => ({
  default: () => <div data-testid="mock-forgot-form" />,
}));
vi.mock("../sections/OTPForm.tsx", () => ({
  default: () => <div data-testid="mock-otp-form" />,
}));
vi.mock("../../../components/Button/SwitchButton.tsx", () => ({
  default: ({ onChange }: { onChange: (v: boolean) => void }) => (
    <input type="checkbox" data-testid="mock-switch" onChange={(e) => onChange(e.target.checked)} />
  ),
}));

vi.mock("../Authentication.styled.tsx", () => ({
  StyledModal: ({ show, onHide, children }: { show: boolean; onHide: () => void; children: React.ReactNode }) =>
    show ? (
      <div>
        <button data-testid="mock-modal-close" onClick={onHide}>
          x
        </button>
        {children}
      </div>
    ) : null,
  SideImage: ({ children }: any) => <div>{children}</div>,
  FormContainer: ({ children }: any) => <div>{children}</div>,
  HeaderBox: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../../states/uiSlice.ts", () => ({
  closeLogin: vi.fn(() => ({ payload: undefined, type: "ui/closeLogin" })),
}));

const mockDispatch = vi.fn();
const mockSetIsSignUp = vi.fn();
const mockNotification = {
  error: vi.fn(),
  success: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  open: vi.fn(),
  destroy: vi.fn(),
};

const baseHookReturn = {
  isSignUp: true,
  isOTP: false,
  email: "",
  password: "",
  confirm: "",
  firstName: "",
  lastName: "",
  phone: "",
  isLoading: false,
  isForgot: false,
  isReset: false,
  pending: null,
  otp: [],
  dispatch: mockDispatch,
  loginFormOpen: true,
  setIsSignUp: mockSetIsSignUp,
  setEmail: vi.fn(),
  setPassword: vi.fn(),
  setConfirm: vi.fn(),
  setFirstName: vi.fn(),
  setLastName: vi.fn(),
  setPhone: vi.fn(),
  setIsForgot: vi.fn(),
  setIsOTP: vi.fn(),
  setOtp: vi.fn(),
  handleLogin: vi.fn(),
  handleSignUp: vi.fn(),
  handleSubmitResetPassword: vi.fn(),
  handChangeIsForgot: vi.fn(),
  headerText: "Mock Header",
  handleVerifyOTP: vi.fn(),
  navigate: vi.fn(),
  notification: mockNotification,
  setIsLoading: vi.fn(),
  setIsReset: vi.fn(),
};

describe("Authentication Component (View)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC01: should render OTPForm when 'isOTP' is true", () => {
    // ARRANGE
    mockedUseAuth.mockReturnValue({
      ...baseHookReturn,
      isOTP: true,
    });
    render(<Authentication />);
    // ASSERT
    expect(screen.getByTestId("mock-otp-form")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-auth-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-forgot-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-switch")).not.toBeInTheDocument();
  });

  it("TC02: should render AuthForm when 'isOTP' and 'isForgot' are false", () => {
    // ARRANGE
    mockedUseAuth.mockReturnValue({
      ...baseHookReturn,
      isOTP: false,
      isForgot: false,
    });
    render(<Authentication />);
    // ASSERT
    expect(screen.getByTestId("mock-auth-form")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-otp-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-forgot-form")).not.toBeInTheDocument();
    expect(screen.getByTestId("mock-switch")).toBeInTheDocument();
  });

  it("TC03: should render ForgotPassword when 'isForgot' is true and 'isReset' is false", () => {
    // ARRANGE
    mockedUseAuth.mockReturnValue({
      ...baseHookReturn,
      isOTP: false,
      isForgot: true,
      isReset: false,
    });
    render(<Authentication />);
    // ASSERT
    expect(screen.getByTestId("mock-forgot-form")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-auth-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-otp-form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-switch")).not.toBeInTheDocument();
  });

  it("TC04: should render ResetPasswordForm when 'isForgot' and 'isReset' are true", () => {
    // ARRANGE
    mockedUseAuth.mockReturnValue({
      ...baseHookReturn,
      isOTP: false,
      isForgot: true,
      isReset: true,
    });
    render(<Authentication />);
    // ASSERT
    expect(screen.getByTestId("mock-reset-form")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-forgot-form")).not.toBeInTheDocument();
  });

  it("TC05 [Interaction]: should call 'setIsSignUp' from hook when SwitchButton is changed", async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockedUseAuth.mockReturnValue(baseHookReturn);
    render(<Authentication />);
    // ACT
    await user.click(screen.getByTestId("mock-switch"));
    // ASSERT
    expect(mockSetIsSignUp).toHaveBeenCalledOnce();
  });
});
