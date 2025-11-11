import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../../models/AppointmentsModel/Technician_Appointments_Model";
import type { AppointmentDetailModel } from "../../../../models/AppointmentsModel/Staff_Appointments_Model";
import {
  useAssignTechnician,
  useChangeAppointmentStatus,
  useGetTechniciansToday,
} from "../../../../services/appointmentServiceApi";
import Appointment_Assign from "../Appointment_Assign";
import userEvent from "@testing-library/user-event";

const mockMutateAssign = vi.fn();
const mockMutateStatus = vi.fn();

const mockSkills: TechnicianSkills[] = [
  {
    id: 1,
    name: "skill 1",
  },
  {
    id: 2,
    name: "skill 2",
  },
];

const mockTechnician: TechnicianModel<TechnicianSkills> = {
  id: 1,
  email: "abc@gmail.com",
  fullName: "Technician 1",
  phone: "0917919191",
  expYears: 2,
  skills: mockSkills,
  workingSessionStatus: "InProgress",
  status: "Available",
};

const mockAppointment: AppointmentDetailModel<any> = {
  id: 1,
  appointmentDate: "2025-01-01T00:00:00Z",
  status: "CheckedIn",
  note: "note",
  vehicleId: 1,
  vehicleName: "Sedan",
  customerName: "Test Customer",
  vehiclePlateNumber: "00A-000.00",
  phoneNumber: "0900000000",
  customerEmail: "abc@gmail.com",
  employeeName: "HUONGDANG",
  orderId: 70,
  imagesUrls: [],
  services: [],
  technicians: [],
  isNeedMantainance: true,
  orderStatus: "",
};

vi.mock("../../../../services/appointmentServiceApi.ts", () => ({
  useChangeAppointmentStatus: vi.fn(() => ({
    mutateAsync: mockMutateStatus,
    isPending: false,
  })),
  useAssignTechnician: vi.fn(() => ({
    mutateAsync: mockMutateAssign,
    isPending: false,
  })),
  useGetTechniciansToday: vi.fn(),
}));

vi.mock("../../StaffComponents/ColorSpinner.tsx", () => ({
  default: () => <div data-testid="spinner" />,
}));

vi.mock("../../../../components/StatusModal/SuccessModal.tsx", () => ({
  default: ({ header, message, action }: any) => (
    <div data-testid="success-modal">
      <h4>{header}</h4>
      <p>{message}</p>
      <button data-testid="close-success-modal" onClick={action}>
        Continue
      </button>
    </div>
  ),
}));

vi.mock("../../../../components/StatusModal/FailModal", () => ({
  default: ({ header, message, action }: any) => (
    <div data-testid="fail-modal">
      <h2>{header}</h2>
      <p>{message}</p>
      <button data-testid="close-fail-modal" onClick={action}>
        Close
      </button>
    </div>
  ),
}));

vi.mock("lucide-react", async (importOriginal) => {
  const original = await importOriginal<typeof import("lucide-react")>();
  return {
    ...original,
    Search: () => <div data-testid="search-icon" />,
    Phone: () => <div data-testid="phone-icon" />,
    CheckCircle: () => <div data-testid="check-icon" />,
    CircleX: () => <div data-testid="x-icon" />,
  };
});

vi.mock("../../../../components/SearchBar/Search.tsx", () => ({
  default: ({ setSearchQuery }: any) => (
    <input
      data-testid="search-bar"
      placeholder="Search technician by name or skills..."
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  ),
}));

const queryClient = new QueryClient();

const renderWithProvider = (ui: React.ReactNode, client = queryClient) => {
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe("Appointment Checkin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutateAssign.mockReset();
    mockMutateStatus.mockReset();
    (useChangeAppointmentStatus as Mock).mockReturnValue({
      mutateAsync: mockMutateStatus,
      isPending: false,
    });

    (useAssignTechnician as Mock).mockReturnValue({
      mutateAsync: mockMutateAssign,
      isPending: false,
    });

    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [mockTechnician] } },
      isLoading: false,
    });
  });

  it("TCO1: renders initial layout and empty states", () => {
    //ARRANGE
    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [] } },
      isPending: false,
    });

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);

    //ASSERT
    expect(screen.getByText("Assign Technicians")).toBeInTheDocument();
    expect(screen.getByText(/Assigned Technicians/)).toBeInTheDocument();
    expect(screen.getByText(/Services \(0\)/)).toBeInTheDocument();
    expect(screen.getByText("No technicians assigned yet")).toBeInTheDocument();
    expect(screen.getByText("No technicians found")).toBeInTheDocument();
  });

  it("TC02: calls 'useGetTechniciansToday' with the correct 'Skills' array", () => {
    // ARRANGE
    const mockApptWithSkills = {
      ...mockAppointment,
      services: [
        { id: 1, name: "Service 1" },
        { id: 2, name: "Service 2" },
      ],
    };

    // ACT
    renderWithProvider(<Appointment_Assign data={mockApptWithSkills} />);

    // ASSERT
    expect(useGetTechniciansToday).toHaveBeenCalledWith(
      expect.objectContaining({
        Skills: [1, 2],
      })
    );
  });

  it("TC03: add a technician to assigned list when clicking 'Add'", () => {
    //ARRANGE
    renderWithProvider(<Appointment_Assign data={mockAppointment} />);
    const card = screen.getByTestId("technician-card-1");
    const addButton = within(card).getByText("Add");
    fireEvent.click(addButton);

    //ASSERT
    expect(
      within(screen.getByTestId("assigned-technicians-list")).getByText(
        /Assigned Technicians \(1\)/i
      )
    ).toBeInTheDocument();
  });

  it("TC04: filter technicians by skill name", () => {
    //ARRANE
    const tech1_Selected = {
      ...mockTechnician,
      id: 1,
      fullName: "SONG HUONG",
      skills: [{ id: 1, name: "skill1" }],
      status: "Available",
    };

    const tech2_Another = {
      ...mockTechnician,
      id: 2,
      fullName: "HUONG DANG",
      skills: [{ id: 1, name: "skill1" }],
      status: "Available",
    };

    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [tech1_Selected, tech2_Another] } },
      isLoading: false,
    });

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);
    const searchInput = screen.getByPlaceholderText(
      "Search technician by name or skills..."
    );

    //ACT
    fireEvent.change(searchInput, { target: { value: "skill1" } });

    const visibleCards = within(
      screen.getByTestId("search-results-container")
    ).queryAllByTestId(/technician-card-/);

    //ASSERT
    expect(visibleCards.length).toBe(2);
    expect(screen.getByText("SONG HUONG")).toBeInTheDocument();
    expect(screen.getByText("HUONG DANG")).toBeInTheDocument();
  });

  it("TC05: filter technicians by technician name", () => {
    //ARRANGE
    const tech1_Selected = {
      ...mockTechnician,
      id: 1,
      fullName: "SONG HUONG",
      skills: [{ id: 1, name: "skill1" }],
      status: "Available",
    };

    const tech2_Another = {
      ...mockTechnician,
      id: 2,
      fullName: "HUONG DANG",
      skills: [{ id: 1, name: "skill1" }],
      status: "Available",
    };
    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [tech1_Selected, tech2_Another] } },
      isLoading: false,
    });

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);
    const searchInput = screen.getByPlaceholderText(
      "Search technician by name or skills..."
    );

    //ACT
    fireEvent.change(searchInput, { target: { value: "DANG" } });

    const visibleCards = within(
      screen.getByTestId("search-results-container")
    ).queryAllByTestId(/technician-card-/);

    //ASSERT
    expect(visibleCards.length).toBe(1);
    expect(screen.queryByText("SONG HUONG")).not.toBeInTheDocument();
    expect(screen.getByText("HUONG DANG")).toBeInTheDocument();
  });

  it("TC06: removes technician from assigned list", () => {
    const tech = {
      ...mockTechnician,
      id: 1,
      fullName: "HUONG",
      skills: [],
      status: "Available",
    };

    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [tech] } },
      isLoading: false,
    });

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);

    fireEvent.click(screen.getByText("Add"));
    const removeButton = screen.getByTestId("remove-button");
    fireEvent.click(removeButton);

    expect(screen.getByText("No technicians assigned yet")).toBeInTheDocument();
  });

  it("TC07: clears all assigned technicians", () => {
    const tech = {
      ...mockTechnician,
      id: 1,
      fullName: "HUONG",
      skills: [],
      status: "Available",
    };
    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [tech] } },
      isLoading: false,
    });

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);
    fireEvent.click(screen.getByText("Add"));

    const clearButton = screen.getByText("Clear All");
    fireEvent.click(clearButton);

    expect(screen.getByText("No technicians assigned yet")).toBeInTheDocument();
  });

  it("TC08: show success modal when technician is assigned successfully", async () => {
    //ARRANGE
    const technician = {
      ...mockTechnician,
      id: 1,
      fullName: "HUONG DANG",
      skill: [],
      status: "Available",
    };
    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [technician] } },
    });

    (useAssignTechnician as Mock).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
    });

    (useChangeAppointmentStatus as Mock).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
    });

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);

    //ACT
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Assign"));

    //ASSERT
    expect(await screen.findByTestId("success-modal")).toBeInTheDocument();
  });

  it("TC09: shows error modal when assigning technicians fails", async () => {
    const tech = {
      ...mockTechnician,
      id: 1,
      fullName: "HUONG",
      skills: [],
      status: "Available",
    };

    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [tech] } },
      isLoading: false,
    });

    (useAssignTechnician as Mock).mockReturnValue({
      mutateAsync: vi
        .fn()
        .mockRejectedValue(new Error("Assign technicians is failed")),
    });

    (useChangeAppointmentStatus as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Assign"));

    expect(await screen.findByTestId("fail-modal")).toBeInTheDocument();
    expect(screen.getByText("Assign technicians is failed"));
  });

  it("TC10: shows 'No technicians found' when search returns nothing", () => {
    const tech = {
      ...mockTechnician,
      id: 1,
      fullName: "HUONG",
      skills: [],
      status: "Available",
    };
    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [tech] } },
      isLoading: false,
    });

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);

    fireEvent.change(screen.getByPlaceholderText(/search technician/i), {
      target: { value: "abcdefghik" },
    });

    expect(screen.getByText("No technicians found")).toBeInTheDocument();
  });

  it("TC11: should close fail modal when clicking on 'Close' button'", async () => {
    const tech = {
      ...mockTechnician,
      id: 1,
      fullName: "HUONG",
      skills: [],
      status: "Available",
    };

    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [tech] } },
      isLoading: false,
    });

    (useAssignTechnician as Mock).mockReturnValue({
      mutateAsync: vi.fn().mockRejectedValue({}),
    });

    (useChangeAppointmentStatus as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Assign"));

    const failModal = await screen.findByTestId("fail-modal");
    expect(failModal).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Close/i }));

    await waitFor(() => {
      expect(
        screen.queryByText("Fail to assign technicians")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByTestId("fail-modal")).not.toBeInTheDocument();
  });

  it("TC12: should invalidate query and close success modal", async () => {
    const technician = {
      ...mockTechnician,
      id: 1,
      fullName: "HUONG DANG",
      skill: [],
      status: "Available",
    };

    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [technician] } },
      isLoading: false,
    });

    (useAssignTechnician as Mock).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
    });

    (useChangeAppointmentStatus as Mock).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
    });

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);

    // ACT
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Assign"));

    const successModal = await screen.findByTestId("success-modal");
    expect(successModal).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-success-modal"));

    // ASSERT
    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["AppointmentDetail"],
      });
    });

    expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument();
  });

  it("TC13: shows spinner when API is loading", async () => {
    //ARRANGE
    const technician = {
      ...mockTechnician,
      id: 1,
      fullName: "HUONG DANG",
      skills: [],
      status: "Available",
    };

    (useGetTechniciansToday as Mock).mockReturnValue({
      data: { data: { items: [technician] } },
      isLoading: false,
    });

    (useAssignTechnician as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });

    (useChangeAppointmentStatus as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProvider(<Appointment_Assign data={mockAppointment} />);

    //ACT
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Assign"));
    (useAssignTechnician as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    });

    //ASSERT
    expect(await screen.findByTestId("spinner")).toBeInTheDocument();
  });
});
