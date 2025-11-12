import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Appointment_Payment from "./../Appointment_Payment";
import * as orderServiceApi from "../../../../services/orderServiceApi";
import * as paymentServiceApi from "../../../../services/PaymentServiceApi";
import * as notificationContext from "../../../../context/useNotification";
import * as errorHandler from "../../../../utils/errorHandler";
import userEvent from "@testing-library/user-event";

const mockAppointmentData = {
  id: 101,
  orderId: 202,
  customerName: "Nguyễn Phúc Sanh",
  phoneNumber: "0987654321",
  vehiclePlateNumber: "51G-12345",
  vehicleName: "Tesla Model 3",
  appointmentDate: new Date().toISOString(),
  status: "Completed",
};

const mockOrderDetailData = {
  data: {
    id: 202,
    vat: 10,
    price: 1650000,
    parts: [
      {
        id: 1,
        name: "Brake Pad",
        price: 1000,
        replacementPrice: 600,
        quantity: 1,
      },
      {
        id: 2,
        name: "Light",
        price: 5000,
        replacementPrice: 300,
        quantity: 1,
      },
    ],
  },
};

const mockInvalidateQueries = vi.fn();
const mockPaymentMutation = vi.fn();
const mockNotificationError = vi.fn();
const mockHandleError = vi.fn();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
queryClient.invalidateQueries = mockInvalidateQueries;

const renderWithProvider = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <Appointment_Payment
        onPaymentSuccess={() => 1}
        data={mockAppointmentData as any}
      />
    </QueryClientProvider>
  );
};

beforeEach(() => {
  // Mock Utility
  vi.spyOn(errorHandler, "handleError").mockImplementation(mockHandleError);

  vi.spyOn(notificationContext, "useNotification").mockReturnValue({
    error: mockNotificationError,
  } as any);

  vi.spyOn(orderServiceApi, "useGetOrderDetail").mockReturnValue({
    data: mockOrderDetailData,
  } as any);

  vi.spyOn(paymentServiceApi, "useHandlePayment").mockReturnValue({
    mutateAsync: mockPaymentMutation,
    isPending: false,
  } as any);
});

afterEach(() => {
  vi.clearAllMocks();
  queryClient.clear();
});

describe("Appointment_Payment Component", () => {
  describe("Initial Rendering and Calculation", () => {
    it("should render customer information correctly", () => {
      // ARRANGE
      renderWithProvider();

      // ASSERT
      expect(screen.getByText("Nguyễn Phúc Sanh")).toBeInTheDocument();
      expect(screen.getByText("51G-12345")).toBeInTheDocument();
    });

    it("should calculate and display the correct total amount", () => {
      // ARRANGE
      renderWithProvider();

      // ASSERT
      expect(
        screen.getByText("Total Amount").nextElementSibling
      ).toHaveTextContent("7.590 VNĐ");
    });

    it("should have the 'Confirm Payment' button disabled initially", () => {
      // ARRANGE
      renderWithProvider();

      // ASSERT
      expect(
        screen.getByRole("button", { name: /Confirm Payment/i })
      ).toBeDisabled();
    });
  });

  describe("Payment Method Selection", () => {
    it("should enable 'Confirm Payment' button when a method is selected", async () => {
      // ARRANGE
      renderWithProvider();
      const user = userEvent.setup();

      // ACT
      await user.click(screen.getByRole("button", { name: /VNPay/i }));

      // ASSERT
      expect(
        screen.getByRole("button", { name: /Confirm Payment/i })
      ).toBeEnabled();
    });
  });

  describe("PayOs Payment Flow", () => {
    it("should call payment mutation and display QR code on PayOs confirm", async () => {
      // ARRANGE
      const qrCodeUrl = "https://example.com/qr-iframe";
      mockPaymentMutation.mockResolvedValueOnce({ data: qrCodeUrl });
      renderWithProvider();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /PayOS/i }));

      // ACT
      await user.click(
        screen.getByRole("button", { name: /Confirm Payment/i })
      );

      // ASSERT
      await waitFor(() => {
        const iframe = screen.getByTitle("PayOS QR Code");
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute("src", qrCodeUrl);
      });
    });
  });

  describe("VnPay Payment Flow", () => {
    it("should call payment mutation and show pending card on VnPay confirm", async () => {
      // ARRANGE
      mockPaymentMutation.mockResolvedValueOnce({ data: null });
      renderWithProvider();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /VNPay/i }));

      // ACT
      await user.click(
        screen.getByRole("button", { name: /Confirm Payment/i })
      );

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText("Awaiting Payment")).toBeInTheDocument();
      });
    });
  });

  describe("Handle Error", () => {
    it("should call notification.error when payment mutation fails", async () => {
      // ARRANGE
      const errorMessage = "Payment Gateway Error";
      mockPaymentMutation.mockRejectedValueOnce(new Error(errorMessage));
      renderWithProvider();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /Cash/i }));

      // ACT
      await user.click(
        screen.getByRole("button", { name: /Confirm Payment/i })
      );

      // ASSERT
      await waitFor(() => {
        expect(mockNotificationError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: errorMessage,
          })
        );
      });
    });
  });

  describe("Loading State", () => {
    it("should show loading text in button when payment is pending", () => {
      // ARRANGE
      vi.spyOn(paymentServiceApi, "useHandlePayment").mockReturnValue({
        mutateAsync: mockPaymentMutation,
        isPending: true,
      } as any);
      renderWithProvider();
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: /Cash/i }));
      });

      // ASSERT
      expect(screen.getByText("Waiting for processing")).toBeInTheDocument();
      expect(screen.queryByText("Confirm Payment")).not.toBeInTheDocument();
    });
  });
});
