import { render, screen, fireEvent, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Technician_MyJob from "../Technician_MyJob";
import { useTechnician_MyJob } from "../../../../hooks/useTechnician_MyJob";

// --- Mock dependencies ---
vi.mock("../../../../context/useNotification", () => ({
  useNotification: () => ({
    notify: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock("../../../../hooks/useTechnician_MyJob", () => ({
  useTechnician_MyJob: vi.fn(),
}));

vi.mock("../../Technician_Component/CardListSection", () => ({
  CardListSection: vi.fn((props) => (
    <div data-testid="mock-card-list">
      <span>{props.isLoading ? "Loading" : "Loaded"}</span>
      <span>Fade: {props.fade?.toString()}</span>
      <span>Appointments: {props.appointments?.length ?? 0}</span>
    </div>
  )),
}));

vi.mock("../../Technician_Component/SortTable", () => ({
  default: vi.fn((props) => (
    <div data-testid="mock-sort-table">
      <span>Active: {props.active}</span>
      <button onClick={() => props.onChange("CONFIRM")}>Click Confirm</button>
      <button onClick={() => props.onChange("ADDING_PART")}>
        Click AddingPart
      </button>
    </div>
  )),
}));

// --- Mock Data ---
const mockSetActiveStatus = vi.fn();
const mockHandleUpdateStatus = vi.fn();
const mockHandlePartsUpdated = vi.fn();

const mockUseTechnicianMyJob = vi.mocked(useTechnician_MyJob);

const mockHookData = {
  activeStatus: "ADDING_PART",
  sortName: ["ADDING_PART", "CONFIRM", "COMPLETED"],
  appointments: [{ id: 1, status: "ADDING_PART" }],
  isError: false,
  fade: false,
  isLoading: false,
  isFetching: false,
  setActiveStatus: mockSetActiveStatus,
  handleUpdateStatus: mockHandleUpdateStatus,
  handlePartsUpdated: mockHandlePartsUpdated,
};

// --- Tests ---
describe("Technician_MyJob Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTechnicianMyJob.mockReturnValue(mockHookData as any);
  });

  it("TC01: should render components and pass props correctly", async () => {
    // ARRANGE + ACT
    await act(async () => {
      render(<Technician_MyJob />);
    });

    // ASSERT
    expect(screen.getByText("Technician Jobs")).toBeInTheDocument();
    expect(screen.getByText("Loaded")).toBeInTheDocument();
    expect(screen.getByTestId("mock-card-list")).toHaveTextContent(
      "Appointments: 1"
    );
  });

  it("TC02: should pass isLoading=true to CardListSection when isLoading is true", async () => {
    // ARRANGE
    mockUseTechnicianMyJob.mockReturnValue({
      ...mockHookData,
      isLoading: true,
      isFetching: false,
    } as any);

    // ACT
    await act(async () => {
      render(<Technician_MyJob />);
    });

    // ASSERT
    expect(screen.getByTestId("mock-card-list")).toHaveTextContent("Loading");
    expect(screen.queryByText("Loaded")).not.toBeInTheDocument();
  });

  it("TC03: should pass isLoading=true to CardListSection when isFetching is true", async () => {
    // ARRANGE
    mockUseTechnicianMyJob.mockReturnValue({
      ...mockHookData,
      isLoading: false,
      isFetching: true,
    } as any);

    // ACT
    await act(async () => {
      render(<Technician_MyJob />);
    });

    // ASSERT
    expect(screen.getByTestId("mock-card-list")).toHaveTextContent("Loading");
  });

  it("TC04: should call setActiveStatus when SortTable onChange is triggered", async () => {
    // ARRANGE + ACT
    await act(async () => {
      render(<Technician_MyJob />);
    });

    // ACT: simulate user clicking "Click Confirm"
    fireEvent.click(screen.getByText("Click Confirm"));

    // ASSERT
    expect(mockSetActiveStatus).toHaveBeenCalledTimes(1);
    expect(mockSetActiveStatus).toHaveBeenCalledWith("CONFIRM");
  });

  it("TC05: should NOT call setActiveStatus if value is the same", async () => {
    // ARRANGE + ACT
    await act(async () => {
      render(<Technician_MyJob />);
    });

    // ACT: simulate user clicking "Click AddingPart" (same as current activeStatus)
    fireEvent.click(screen.getByText("Click AddingPart"));

    // ASSERT
    expect(mockSetActiveStatus).not.toHaveBeenCalled();
  });
});
