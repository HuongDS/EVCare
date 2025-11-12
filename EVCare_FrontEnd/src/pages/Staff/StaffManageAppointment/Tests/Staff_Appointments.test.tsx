import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { createTestStore } from "../../../../states/testStore";
import Staff_Appointments from "../Staff_Appointments";
import { useGetAllAppointments, useGetAppointmentHaveTech } from "../../../../services/appointmentServiceApi";
import { fireEvent, render, screen } from "@testing-library/react";
import type { StaffAppointmentsDto } from "../../../../models/AppointmentsModel/Staff_Appointments_Model";
import { openModel3d } from "../../../../states/uiSlice";

vi.mock("../../../../services/appointmentServiceApi.ts", () => ({
  useGetAllAppointments: vi.fn(),
  useGetAppointmentHaveTech: vi.fn(),
}));

vi.mock("../../StaffComponents/SortTable.tsx", () => ({
  default: ({ setSortOrder, setEndDate, setBeginDate, setSortBy }: any) => (
    <div data-testid="sort-table">
      <button onClick={() => setSortOrder("desc")}>Sort Desc</button>
      <button onClick={() => setBeginDate("2025-01-01")}>Set Begin Date</button>
      <button onClick={() => setEndDate("2025-12-31")}>Set End Date</button>
      <button onClick={() => setSortBy("DONE")}>Sort By Done</button>
    </div>
  ),
}));
vi.mock("../../StaffComponents/AppointmentCard.tsx", () => ({
  default: ({ data, onOpenProgress, hasTechnicianOnleave, onOpenReassign }: any) => (
    <div data-testid="appointment-card">
      <span>{data.customerName}</span>
      <button data-testid={`progress-${data.id}`} onClick={onOpenProgress}>
        Open Progress
      </button>
      <button data-testid={`reassign-${data.id}`} onClick={onOpenReassign}>
        Open Reassign
      </button>
      {hasTechnicianOnleave && <span data-testid={`onleave-${data.id}`}>Technician On Leave</span>}
    </div>
  ),
}));
vi.mock("../../StaffManageAppointment/Appointment_Progress_Modal.tsx", () => ({
  default: ({ close }: any) => (
    <div data-testid="progress-modal">
      <button onClick={close}>Close</button>
    </div>
  ),
}));
vi.mock("../../StaffManageAppointment/CreateAppointment.tsx", () => ({
  default: ({ onBack }: any) => (
    <div data-testid="create-appointment-view">
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));
vi.mock("../../StaffManageAppointment/Appointment_Reassign.tsx", () => ({
  default: ({ close }: any) => (
    <div data-testid="reassign-modal">
      <button onClick={close}>Close</button>
    </div>
  ),
}));
vi.mock("../../../Model3d/Model3dViewer.tsx", () => ({
  default: () => <div data-testid="model-3d-viewer" />,
}));
vi.mock("../../../../components/SearchBar/Search.tsx", () => ({
  default: ({ handleSearchValue }: any) => (
    <input
      data-testid="search-bar"
      placeholder="Search appointments..."
      onChange={(e) => handleSearchValue(e.target.value)}
    />
  ),
}));
vi.mock("../../../../components/Button/ShowButton.tsx", () => ({
  default: ({ text, onclick }: any) => <button onClick={onclick}>{text}</button>,
}));
vi.mock("../../../../components/Skeletons/Skeleton.tsx", () => ({
  default: () => <div data-testid="skeleton" />,
}));
vi.mock("../../../../components/Paginations/Pagination.tsx", () => ({
  Pagination: ({ onPageChange, pageIndex, totalPage }: any) => (
    <div data-testid="pagination">
      <span>Current Page: {pageIndex}</span>
      <span>Total Pages: {totalPage}</span>
      <button onClick={() => onPageChange(2)}>Page 2</button>
    </div>
  ),
}));

const queryClient = new QueryClient();

function renderWithProviders(ui: React.ReactNode, initialState = {}) {
  const store = createTestStore(initialState);
  vi.spyOn(store, "dispatch");
  const renderResult = render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </Provider>
  );
  return { ...renderResult, store };
}

//Test Case
describe("Staff Appointments UI", () => {
  const mockUseGetAllAppointments = useGetAllAppointments as Mock;
  const mockUseGetAppointmentHaveTech = useGetAppointmentHaveTech as Mock;
  const mockAppointment: StaffAppointmentsDto<any> = {
    id: 1,
    appointmentDate: "2025-01-01T00:00:00Z",
    vehicleModel: "Test Model",
    customerName: "Test Customer",
    phoneNumber: "0900000000",
    licensePlate: "00A-000.00",
    services: [],
    appointmentImages: [],
    status: "Inprogress",
    technicians: [],
    orderId: 999,
    note: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseGetAllAppointments.mockReturnValue({
      data: {
        data: {
          items: [],
          totalItems: 0,
          totalPages: 1,
        },
      },
      isLoading: false,
    });

    mockUseGetAppointmentHaveTech.mockReturnValue({
      data: { data: { items: [] } },
    });
  });

  it("TC01: renders title, search, and create appointment button", () => {
    //ARRANGE
    renderWithProviders(<Staff_Appointments />);

    //ASSERT
    expect(screen.getByText("Appointments")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search appointments...")).toBeInTheDocument();
    expect(screen.getByText("+ CREATE AN APPOINTMENT")).toBeInTheDocument();
    expect(screen.getByTestId("sort-table")).toBeInTheDocument();
  });

  it("TC02: show skeleton when loading", () => {
    //ARRANGE
    mockUseGetAllAppointments.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderWithProviders(<Staff_Appointments />);

    //ASSERT
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("TC03: renders appointment list when API returns data", () => {
    //ARRANGE
    mockUseGetAllAppointments.mockReturnValue({
      data: {
        data: {
          items: [mockAppointment],
          totalItems: 1,
          totalPages: 1,
        },
      },
      isLoading: false,
    });

    renderWithProviders(<Staff_Appointments />);

    //ASSERT
    expect(screen.getByText("Test Customer")).toBeInTheDocument();
    expect(screen.getAllByTestId("appointment-card")).toHaveLength(1);
  });

  it("TC04: renders 'Create Appointment' view when 'CREATE AN APPOINTMENT' is clicked", () => {
    //ARRANGE
    renderWithProviders(<Staff_Appointments />);

    //ACT
    fireEvent.click(screen.getByText("+ CREATE AN APPOINTMENT"));

    //ASSERT
    expect(screen.getByTestId("create-appointment-view")).toBeInTheDocument();
    expect(screen.queryByText("Appointments")).not.toBeInTheDocument();
  });

  it("TC05: renders 3D Model view when Redux state is open", () => {
    //ARRANGE
    const initialState = {
      ui: { model3dOpen: true },
    };
    renderWithProviders(<Staff_Appointments />, initialState);

    //ASSERT
    expect(screen.getByTestId("model-3d-viewer")).toBeInTheDocument();
    expect(screen.queryByText("Appointments")).not.toBeInTheDocument();
  });

  it("TC06: open Progress Modal when 'Open Progress' button is clicked on a Appointment Card", () => {
    //ARRANGE
    mockUseGetAllAppointments.mockReturnValue({
      data: {
        data: {
          items: [mockAppointment],
          totalItems: 1,
          totalPages: 1,
        },
      },
      isLoading: false,
    });

    renderWithProviders(<Staff_Appointments />);

    //ASSERT
    expect(screen.queryByTestId("progress-modal")).not.toBeInTheDocument();

    //ACT
    fireEvent.click(screen.getByTestId("progress-1"));

    //ASSERT
    expect(screen.getByTestId("progress-modal")).toBeInTheDocument();
  });

  it("TC07: open Reassign Modal when 'Open Reassign' button is clicked", () => {
    //ARRANGE
    mockUseGetAllAppointments.mockReturnValue({
      data: {
        data: {
          items: [mockAppointment],
          totalItems: 1,
          totalPages: 1,
        },
      },
      isLoading: false,
    });

    renderWithProviders(<Staff_Appointments />);

    //ASSERT
    expect(screen.queryByTestId("reassign-modal")).not.toBeInTheDocument();

    //ACT
    fireEvent.click(screen.getByTestId("reassign-1"));

    //ASSERT
    expect(screen.getByTestId("reassign-modal")).toBeInTheDocument();
  });

  it("TC08: shows 'Technician On Leave' warning if API returns matching ID", () => {
    //ARRANGE
    const mockAppt = {
      ...mockAppointment,
      id: 5,
      customerName: "Unlucky User",
    };
    mockUseGetAllAppointments.mockReturnValue({
      data: {
        data: {
          items: [mockAppt],
          totalItems: 0,
          totalPages: 1,
        },
      },
      isLoading: false,
    });

    mockUseGetAppointmentHaveTech.mockReturnValue({
      data: { data: { items: [{ id: 5 }] } },
    });

    renderWithProviders(<Staff_Appointments />);

    //ASSERT
    expect(screen.getByTestId("onleave-5")).toBeInTheDocument();
    expect(screen.getByText("Technician On Leave")).toBeInTheDocument();
  });

  it("TC09: calls API with new keyword when typing in SearchBar", () => {
    //ARRANGE
    const mockAppt = {
      ...mockAppointment,
      id: 5,
      customerName: "HUONGDANG",
    };

    mockUseGetAllAppointments.mockReturnValue({
      data: {
        data: {
          items: [mockAppt],
          totalItems: 0,
          totalPages: 1,
        },
      },
      isLoading: false,
    });

    renderWithProviders(<Staff_Appointments />);

    expect(mockUseGetAllAppointments).toHaveBeenCalledWith(expect.not.objectContaining({ keyWord: expect.anything() }));

    const searchInput = screen.getByPlaceholderText("Search appointments...");

    fireEvent.change(searchInput, { target: { value: "HUONGDANG" } });

    //ASSERT
    expect(mockUseGetAllAppointments).toHaveBeenCalledWith(
      expect.objectContaining({
        keyWord: "HUONGDANG",
      })
    );
  });

  it("TC10: calls API with new filters when SortTable is used", () => {
    // ARRANGE
    renderWithProviders(<Staff_Appointments />);

    // ACT
    fireEvent.click(screen.getByText("Sort Desc"));

    // ASSERT
    expect(mockUseGetAllAppointments).toHaveBeenCalledWith(
      expect.objectContaining({
        sortOrder: "desc",
      })
    );

    // ACT
    fireEvent.click(screen.getByText("Set End Date"));

    // ASSERT
    expect(mockUseGetAllAppointments).toHaveBeenCalledWith(
      expect.objectContaining({
        endTime: "2025-12-31",
      })
    );
  });

  it("TC11: dispatches 'openModel3d' action when 'Show Model' is clicked", () => {
    // ARRANGE
    const { store } = renderWithProviders(<Staff_Appointments />);
    const showModelButton = screen.getByText("Show Model");
    const mockAppointmentId = 1;

    // ACT
    fireEvent.click(showModelButton);

    // ASSERT
    expect(store.dispatch).toHaveBeenCalledWith(openModel3d(mockAppointmentId));
  });

  it("TC12: calls API with new pageIndex when pagination changes", () => {
    // ARRANGE
    renderWithProviders(<Staff_Appointments />);

    expect(mockUseGetAllAppointments).toHaveBeenCalledWith(
      expect.objectContaining({
        pageIndex: 1,
      })
    );

    const page2Button = screen.getByText("Page 2");

    // ACT
    fireEvent.click(page2Button);

    // ASSERT
    expect(mockUseGetAllAppointments).toHaveBeenCalledWith(
      expect.objectContaining({
        pageIndex: 2,
      })
    );
  });

  it("TC13: returns to list view when 'onBack' is called from CreateAppointment", () => {
    // ARRANGE
    renderWithProviders(<Staff_Appointments />);

    fireEvent.click(screen.getByText("+ CREATE AN APPOINTMENT"));

    expect(screen.getByTestId("create-appointment-view")).toBeInTheDocument();
    expect(screen.queryByText("Appointments")).not.toBeInTheDocument();

    const backButton = screen.getByText("Back");

    // ACT
    fireEvent.click(backButton);

    // ASSERT
    expect(screen.queryByTestId("create-appointment-view")).not.toBeInTheDocument();
    expect(screen.getByText("Appointments")).toBeInTheDocument(); // View cũ hiện lại
  });

  it("TC14: closes modal and invalidates query when 'close' is called", () => {
    // ARRANGE
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    mockUseGetAllAppointments.mockReturnValue({
      data: {
        data: {
          items: [mockAppointment],
          totalItems: 1,
          totalPages: 1,
        },
      },
      isLoading: false,
    });

    renderWithProviders(<Staff_Appointments />);

    fireEvent.click(screen.getByTestId("progress-1"));

    expect(screen.getByTestId("progress-modal")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");

    // ACT
    fireEvent.click(closeButton);

    // ASSERT
    expect(screen.queryByTestId("progress-modal")).not.toBeInTheDocument();

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["Staff Appointments"],
    });

    invalidateSpy.mockRestore();
  });
  it("TC15: totalPage = 1 when API response is missing totalPages", () => {
    // ARRANGE
    mockUseGetAllAppointments.mockReturnValue({
      data: {
        data: {
          items: [],
          totalItems: 0,
          totalPages: undefined,
        },
      },
      isLoading: false,
    });

    // ACT
    renderWithProviders(<Staff_Appointments />);

    // ASSERTr
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    expect(screen.getByText("Total Pages: 1")).toBeInTheDocument();
  });

  it("TC15: calls the API again when the user changes the date filters in SortTable", () => {
    // ARRANGE
    renderWithProviders(<Staff_Appointments />);

    // ACT
    fireEvent.click(screen.getByText("Set Begin Date"));

    fireEvent.click(screen.getByText("Set End Date"));

    // ASSERT
    expect(mockUseGetAllAppointments).toHaveBeenCalledWith(
      expect.objectContaining({
        beginTime: "2025-01-01",
        endTime: "2025-12-31",
      })
    );
  });
});
