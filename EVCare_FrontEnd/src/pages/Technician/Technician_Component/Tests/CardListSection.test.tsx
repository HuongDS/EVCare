import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CardListSection } from "../CardListSection";
import { TechnicianWorkingSessionEnum } from "../../../../models/enums/TechnicianWorkingSessionEnum";
import { MemoryRouter } from "react-router";
import { NotificationProvider } from "../../../../context/NotificationProvider";

// --- Mocks ---

vi.mock("../../TechnicianMyJob/Technician_MyJob.styled", () => ({
  AppointmentList: vi.fn(({ className, children, ...rest }) => (
    <div data-testid="mock-app-list" className={className} {...rest}>
      {children}
    </div>
  )),
  ErrorMessage: vi.fn(({ children }) => (
    <div data-testid="mock-error">{children}</div>
  )),
  Watermark: vi.fn(({ children }) => (
    <div data-testid="mock-watermark">{children}</div>
  )),
}));

vi.mock("../AppointmentCard", () => ({
  default: vi.fn((props) => (
    <div data-testid="mock-card" data-id={props.data.id} />
  )),
}));

vi.mock("../AppointmentCardProgress", () => ({
  default: vi.fn((props) => (
    <div data-testid="mock-card-progress" data-id={props.data.id} />
  )),
}));

vi.mock("../LoadingOverlay", () => ({
  default: vi.fn(() => <div data-testid="mock-loading" />),
}));

// --- Mock Data ---

const mockOnStatusChange = vi.fn();
const mockOnPartsUpdated = vi.fn();

const mockBaseProps = {
  isError: false,
  fade: false,
  appointments: [],
  onStatusChange: mockOnStatusChange,
  onPartsUpdated: mockOnPartsUpdated,
  isLoading: false,
};

const mockApptCompleted = {
  id: 1,
  status: TechnicianWorkingSessionEnum.COMPLETED,
};
const mockApptCanceled = {
  id: 2,
  status: TechnicianWorkingSessionEnum.CANCELED,
};
const mockApptInProgress = {
  id: 3,
  status: TechnicianWorkingSessionEnum.INPROGRESS,
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <NotificationProvider>{children}</NotificationProvider>
    </MemoryRouter>
  );
};

// --- Tests ---

describe("CardListSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC01: should render error message when isError is true", () => {
    // ACT
    render(<CardListSection {...mockBaseProps} isError={true} />, {
      wrapper: TestWrapper,
    });

    // ASSERT
    expect(screen.getByTestId("mock-error")).toBeInTheDocument();
    expect(
      screen.getByText("Error loading technician appointments")
    ).toBeInTheDocument();
  });

  it("TC02: should render loading overlay when isLoading is true", () => {
    // ACT
    render(<CardListSection {...mockBaseProps} isLoading={true} />, {
      wrapper: TestWrapper,
    });

    // ASSERT
    expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
  });

  it("TC03: should render watermark when appointments are empty", () => {
    // ACT
    render(<CardListSection {...mockBaseProps} />, { wrapper: TestWrapper });

    // ASSERT
    expect(screen.getByTestId("mock-watermark")).toBeInTheDocument();
  });

  it("TC04: should render list with 'fade-out' class when fade is true", () => {
    // ARRANGE
    const appointments = [mockApptInProgress] as any;

    // ACT
    render(
      <CardListSection
        {...mockBaseProps}
        appointments={appointments}
        fade={true}
      />,
      { wrapper: TestWrapper }
    );

    // ASSERT
    expect(screen.getByTestId("mock-app-list")).toHaveClass("fade-out");
  });

  it("TC05: should render AppointmentCard for COMPLETED status", () => {
    // ARRANGE
    const appointments = [mockApptCompleted] as any;

    // ACT
    render(<CardListSection {...mockBaseProps} appointments={appointments} />, {
      wrapper: TestWrapper,
    });

    // ASSERT
    expect(screen.getByTestId("mock-card")).toBeInTheDocument();
  });

  it("TC06: should render AppointmentCard for CANCELED status", () => {
    // ARRANGE
    const appointments = [mockApptCanceled] as any;

    // ACT
    render(<CardListSection {...mockBaseProps} appointments={appointments} />, {
      wrapper: TestWrapper,
    });

    // ASSERT
    expect(screen.getByTestId("mock-card")).toBeInTheDocument();
  });

  it("TC07: should render AppointmentCardProgress for other statuses", () => {
    // ARRANGE
    const appointments = [mockApptInProgress] as any;

    // ACT
    render(<CardListSection {...mockBaseProps} appointments={appointments} />, {
      wrapper: TestWrapper,
    });

    // ASSERT
    expect(screen.getByTestId("mock-card-progress")).toBeInTheDocument();
  });
});
