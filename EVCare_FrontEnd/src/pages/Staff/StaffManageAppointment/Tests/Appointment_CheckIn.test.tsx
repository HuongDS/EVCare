import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import type { AppointmentDetailModel } from "../../../../models/AppointmentsModel/Staff_Appointments_Model";
import { useChangeAppointmentStatus } from "../../../../services/appointmentServiceApi";
import { useCreateNewOrder } from "../../../../services/orderServiceApi";
import Appointment_CheckIn from "../Appointment_CheckIn";
import { APPOINTMENT_MESSAGE } from "../../../../constants/messages/Message";

const mockMutateStatus = vi.fn();
const mockMutateOrder = vi.fn();
const mockCloseProp = vi.fn();

vi.mock("../../../../services/orderServiceApi.ts", () => ({
  useCreateNewOrder: vi.fn(() => ({
    mutateAsync: mockMutateOrder,
  })),
}));

vi.mock("../../../../services/appointmentServiceApi.ts", () => ({
  useChangeAppointmentStatus: vi.fn(() => ({
    mutateAsync: mockMutateStatus,
    isPending: false,
  })),
}));

vi.mock("../../../../components/SpinnerComponent.tsx", () => ({
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
vi.mock("../../../../components/StatusModal/ConfirmModal", () => ({
  default: ({ onClose, onConfirm, message }: any) => (
    <div data-testid="confirm-modal">
      <p>{message}</p>
      <button data-testid="close-confirm-modal" onClick={onClose}>
        Close
      </button>
      <button data-testid="confirm-cancel-button" onClick={onConfirm}>
        Confirm
      </button>
    </div>
  ),
}));

vi.mock("react-medium-image-zoom", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("lucide-react", async (importOriginal) => {
  const original = await importOriginal<typeof import("lucide-react")>();
  return {
    ...original,
    User: () => <div data-testid="icon-user" />,
    Car: () => <div data-testid="icon-car" />,
    Phone: () => <div data-testid="icon-phone" />,
    FileText: () => <div data-testid="icon-filetext" />,
    CheckCircle: () => <div data-testid="icon-checkcircle" />,
    XCircle: () => <div data-testid="icon-xcircle" />,
    Image: () => <div data-testid="icon-image" />,
    Wrench: () => <div data-testid="icon-wrench" />,
  };
});

const queryCache = new QueryCache();
const queryClient = new QueryClient();

const renderWithProvider = (ui: React.ReactNode, client = queryClient) => {
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe("Appointment_CheckIn", () => {
  const mockData: AppointmentDetailModel<any> = {
    id: 123,
    appointmentDate: "2025-01-01T00:00:00Z",
    status: "Confirmed",
    note: "string",
    vehicleId: 1,
    vehicleName: "SUV",
    vehiclePlateNumber: "51G-123.45",
    customerName: "HUONGDANG",
    phoneNumber: "0901234567",
    customerEmail: "abc@gmail.com",
    employeeName: "string",
    services: [
      { id: 1, name: "Service 1" },
      { id: 2, name: "Service 2" },
    ],
    imagesUrls: ["img1.jpg", "img2.jpg"],
    orderId: 1,
    technicians: [],
  };

  const mockChangeStatus = useChangeAppointmentStatus as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    queryCache.clear();
    mockMutateStatus.mockReset();
    mockMutateOrder.mockReset();
    mockCloseProp.mockReset();

    (useChangeAppointmentStatus as Mock).mockReturnValue({
      mutateAsync: mockMutateStatus,
      isPending: false,
    });
    (useCreateNewOrder as Mock).mockReturnValue({
      mutateAsync: mockMutateOrder,
    });
  });

  it("TC01: renders appointment detail", () => {
    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    expect(screen.getByText("Check-In Appointment")).toBeInTheDocument();
    expect(screen.getByText("Appointment #123")).toBeInTheDocument();
    expect(screen.getByText("HUONGDANG")).toBeInTheDocument();
    expect(screen.getByText("0901234567")).toBeInTheDocument();
    expect(screen.getByText("SUV")).toBeInTheDocument();
    expect(screen.getByText("51G-123.45")).toBeInTheDocument();
    expect(screen.getByText("Service 1")).toBeInTheDocument();
    expect(screen.getByText("Service 2")).toBeInTheDocument();
    expect(screen.getByAltText("Vehicle 1")).toBeInTheDocument();
    expect(screen.getByText("string")).toBeInTheDocument();
    expect(screen.getByText("Confirm Check-In")).toBeInTheDocument();
    expect(screen.getByText("Cancel Appointment")).toBeInTheDocument();
  });

  it("TC02: hides image if data is imageUrls are absent", () => {
    // ARRANGE
    const minimalData = {
      ...mockData,
      imagesUrls: [],
      note: "",
    };

    renderWithProvider(
      <Appointment_CheckIn data={minimalData} close={mockCloseProp} />
    );

    // ASSERT
    expect(screen.queryByText("Vehicle Images")).not.toBeInTheDocument();
  });

  it("TC03: shows spinner when 'isPending' status", () => {
    // ARRANGE
    mockChangeStatus.mockReturnValue({
      mutateAsync: mockMutateStatus,
      isPending: true,
    });

    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ASSERT
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByText("Confirm Check-In")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancel Appointment")).not.toBeInTheDocument();
  });

  it("TC04: handles successful check-in flow", async () => {
    // ARRANGE
    mockMutateStatus.mockResolvedValue({});
    mockMutateOrder.mockResolvedValue({ data: { orderID: 999 } });

    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Confirm Check-In"));

    // ASSERT
    expect(mockMutateStatus).toHaveBeenCalledWith({
      appointmentId: 123,
      status: "CheckedIn",
    });

    const successModal = await screen.findByTestId("success-modal");
    expect(successModal).toBeInTheDocument();

    expect(mockMutateOrder).toHaveBeenCalledWith({
      appointmentID: 123,
      created_At: expect.any(String),
    });

    expect(
      screen.getByText(APPOINTMENT_MESSAGE.APPOINTMENT_CHECKIN_SUCCESS)
    ).toBeInTheDocument();
  });

  it("TC05: handles successful cancellation flow", async () => {
    // ARRANGE
    mockMutateStatus.mockResolvedValue({ statusCode: 200 });
    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Cancel Appointment"));

    const confirmModal = await screen.findByTestId("confirm-modal");
    expect(confirmModal).toBeInTheDocument();
    expect(
      screen.getByText("Do you want to cancel this appointment?")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm"));

    // ASSERT
    expect(mockMutateStatus).toHaveBeenCalledWith({
      appointmentId: 123,
      status: "Canceled",
    });

    const successModal = await screen.findByTestId("success-modal");
    expect(successModal).toBeInTheDocument();
    expect(
      screen.getByText(APPOINTMENT_MESSAGE.APPOINTMENT_CANCEL_SUCCESS)
    ).toBeInTheDocument();

    expect(mockCloseProp).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Continue"));
    expect(mockCloseProp).toHaveBeenCalled();
  });

  it("TC06: shows error modal if changing status fails during check-in", async () => {
    // ARRANGE
    const error = new Error(APPOINTMENT_MESSAGE.APPOINTMENT_CHECKIN_FAIL);
    mockMutateStatus.mockRejectedValue(error);
    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Confirm Check-In"));

    // ASSERT
    const failModal = await screen.findByTestId("fail-modal");
    expect(failModal).toBeInTheDocument();
    expect(
      screen.getByText(APPOINTMENT_MESSAGE.APPOINTMENT_CHECKIN_FAIL)
    ).toBeInTheDocument();
    expect(mockMutateOrder).not.toHaveBeenCalled();
  });

  it("TC07: shows error modal if creating order fails during check-in", async () => {
    // ARRANGE
    mockMutateStatus.mockResolvedValue({});
    const orderError = new Error("API Order Error");
    mockMutateOrder.mockRejectedValue(orderError);

    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Confirm Check-In"));

    // ASSERT
    const failModal = await screen.findByTestId("fail-modal");
    expect(failModal).toBeInTheDocument();
    expect(screen.getByText("Create Order Failed")).toBeInTheDocument();
    expect(screen.getByText(String(orderError))).toBeInTheDocument();
  });

  it("TC08: shows error modal if cancellation fails", async () => {
    // ARRANGE
    const error = new Error("API Cancel Error");
    mockMutateStatus.mockRejectedValue(error);
    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Cancel Appointment"));
    fireEvent.click(await screen.findByText("Confirm"));

    // ASSERT
    const failModal = await screen.findByTestId("fail-modal");
    expect(failModal).toBeInTheDocument();
    expect(screen.getByText("Cancellation Failed")).toBeInTheDocument();
    expect(screen.getByText("API Cancel Error")).toBeInTheDocument();
  });

  it("TC09: handles closing the error modal", async () => {
    // ARRANGE
    const error = new Error("API Status Error");
    mockMutateStatus.mockRejectedValue(error);

    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Confirm Check-In"));

    // ASSERT
    const failModal = await screen.findByTestId("fail-modal");
    expect(failModal).toBeInTheDocument();
    expect(screen.getByText("API Status Error")).toBeInTheDocument();

    // ACT
    fireEvent.click(screen.getByTestId("close-fail-modal"));

    // ASSERT
    expect(screen.queryByTestId("fail-modal")).not.toBeInTheDocument();
  });

  it("TC10: handles successful cancellation flow", async () => {
    // ARRANGE
    mockMutateStatus.mockResolvedValue({ statusCode: 200 });
    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Cancel Appointment"));
    const confirmButton = await screen.findByTestId("confirm-cancel-button");
    fireEvent.click(confirmButton);

    // ASSERT
    const successModal = await screen.findByTestId("success-modal");
    expect(successModal).toBeInTheDocument();
    expect(
      screen.getByText(APPOINTMENT_MESSAGE.APPOINTMENT_CANCEL_SUCCESS)
    ).toBeInTheDocument();

    expect(mockCloseProp).not.toHaveBeenCalled();

    // ACT
    fireEvent.click(screen.getByTestId("close-success-modal"));

    // ASSERT
    expect(mockCloseProp).toHaveBeenCalled();
  });

  it("TC11: handles dismissing the confirm modal", async () => {
    // ARRANGE
    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Cancel Appointment"));
    const confirmModal = await screen.findByTestId("confirm-modal");
    expect(confirmModal).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-confirm-modal"));

    // ASSERT
    expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();

    expect(mockMutateStatus).not.toHaveBeenCalled();
  });

  it("TC12: handles error if cancellation response is not 200", async () => {
    // ARRANGE
    mockMutateStatus.mockResolvedValue({
      statusCode: 400,
      message: "This appointment cannot be canceled.",
    });

    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Cancel Appointment"));
    const confirmButton = await screen.findByTestId("confirm-cancel-button");
    fireEvent.click(confirmButton);

    // ASSERT
    const failModal = await screen.findByTestId("fail-modal");
    expect(failModal).toBeInTheDocument();

    expect(
      screen.getByText("This appointment cannot be canceled.")
    ).toBeInTheDocument();

    expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument();
  });

  it("TC13: handles successful check-in flow", async () => {
    // ARRANGE
    mockMutateStatus.mockResolvedValue({});
    mockMutateOrder.mockResolvedValue({ data: { orderID: 999 } });

    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Confirm Check-In"));

    // ASSERT
    const successModal = await screen.findByTestId("success-modal");
    expect(successModal).toBeInTheDocument();
    expect(
      screen.getByText(APPOINTMENT_MESSAGE.APPOINTMENT_CHECKIN_SUCCESS)
    ).toBeInTheDocument();
    expect(mockCloseProp).not.toHaveBeenCalled();

    // ACT
    fireEvent.click(screen.getByTestId("close-success-modal"));

    // ASSERT
    expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument();
    expect(mockCloseProp).not.toHaveBeenCalled();
  });

  it("TC14: shows default CHECKIN_FAIL message when error has no message", async () => {
    // ARRANGE
    const errorWithoutMessage = new Error("");

    mockMutateStatus.mockRejectedValue(errorWithoutMessage);

    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Confirm Check-In"));

    // ASSERT
    const failModal = await screen.findByTestId("fail-modal");
    expect(failModal).toBeInTheDocument();

    expect(
      screen.getByText(APPOINTMENT_MESSAGE.APPOINTMENT_CHECKIN_FAIL)
    ).toBeInTheDocument();
  });

  it("TC15: shows default CANCEL_FAIL message when 'soft error' response has no message", async () => {
    // ARRANGE
    mockMutateStatus.mockResolvedValue({
      statusCode: 400,
      message: null,
    });

    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Cancel Appointment"));
    const confirmButton = await screen.findByTestId("confirm-cancel-button");
    fireEvent.click(confirmButton);

    // ASSERT
    const failModal = await screen.findByTestId("fail-modal");
    expect(failModal).toBeInTheDocument();

    expect(
      screen.getByText(APPOINTMENT_MESSAGE.APPOINTMENT_CANCEL_FAIL)
    ).toBeInTheDocument();
  });

  it("TC16: shows error modal if create order response is missing orderID", async () => {
    // ARRANGE
    mockMutateStatus.mockResolvedValue({});

    mockMutateOrder.mockResolvedValue({ data: { orderID: null } });

    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Confirm Check-In"));

    // ASSERT
    const failModal = await screen.findByTestId("fail-modal");
    expect(failModal).toBeInTheDocument();

    expect(screen.getByText("Create Order Failed")).toBeInTheDocument();
    expect(screen.getByText("Order ID is missing.")).toBeInTheDocument();

    expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument();
  });

  it("TC17: shows default CANCEL_FAIL message when cancellation error has no message", async () => {
    // ARRANGE
    const errorWithoutMessage = new Error("");

    mockMutateStatus.mockRejectedValue(errorWithoutMessage);

    renderWithProvider(
      <Appointment_CheckIn data={mockData} close={mockCloseProp} />
    );

    // ACT
    fireEvent.click(screen.getByText("Cancel Appointment"));
    const confirmButton = await screen.findByTestId("confirm-cancel-button");
    fireEvent.click(confirmButton);

    // ASSERT
    const failModal = await screen.findByTestId("fail-modal");
    expect(failModal).toBeInTheDocument();

    expect(
      screen.getByText(APPOINTMENT_MESSAGE.APPOINTMENT_CANCEL_FAIL)
    ).toBeInTheDocument();
  });
});
