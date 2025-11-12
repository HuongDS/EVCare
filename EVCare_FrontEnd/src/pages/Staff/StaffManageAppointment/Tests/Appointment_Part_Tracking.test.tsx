import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Appointment_Part_Tracking from "./../Appointment_Part_Tracking";
import * as orderServiceApi from "../../../../services/orderServiceApi";
import * as appointmentServiceApi from "../../../../services/appointmentServiceApi";
import * as notificationContext from "../../../../context/useNotification";

const mockAppointmentData = {
  id: 101,
  orderId: 202,
};

const mockOrderDetails = {
  data: {
    id: 202,
    vat: 10,
    parts: [
      {
        id: 1,
        name: "Brake Pad",
        imageUrl: "brake.png",
        technicianId: 1,
        technicianName: "DANG SONG HUONG",
        price: 1000,
        replacementPrice: 500,
        quantity: 2,
        stock: 10,
      },
      {
        id: 2,
        name: "Light",
        imageUrl: "filter.png",
        technicianId: 1,
        technicianName: "DANG SONG HUONG",
        price: 5000,
        replacementPrice: 100,
        quantity: 1,
        stock: 5,
      },
    ],
  },
};

const mockAppointments = {
  data: {
    items: [
      {
        id: 101,
        technicians: [
          {
            id: 1,
            fullName: "DANG SONG HUONG",
            avatar: "avatar.png",
            phone: "0123456789",
            status: "Active",
          },
        ],
      },
    ],
  },
};

const mockDispatch = vi.fn();
const mockCloseModal = vi.fn();
const mockInvalidateQueries = vi.fn();
const mockUpdateOrder = vi.fn();
const mockUpdateOrderStatus = vi.fn();
const mockAppointmentStatus = vi.fn();
const mockNotificationSuccess = vi.fn();
const mockNotificationError = vi.fn();
const mockCloseModel3d = vi.fn(() => ({ type: "ui/closeModel3d" }));

const mockStore = configureStore({
  reducer: {
    ui: (state = { model3dOpen: false }) => state,
  },
  preloadedState: {
    ui: { model3dOpen: false },
  },
});

mockStore.dispatch = mockDispatch;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
queryClient.invalidateQueries = mockInvalidateQueries;

const renderWithProvider = () => {
  return render(
    <Provider store={mockStore}>
      <QueryClientProvider client={queryClient}>
        <Appointment_Part_Tracking
          data={mockAppointmentData as any}
          closeModal={mockCloseModal}
        />
      </QueryClientProvider>
    </Provider>
  );
};

beforeEach(() => {
  vi.mock("react-router", () => ({
    useLocation: vi.fn().mockReturnValue({ pathname: "/test" }),
  }));

  //   vi.spyOn(uiSlice, "openModel3d").mockImplementation(mockOpenModel3d);
  //   vi.spyOn(uiSlice, "closeModel3d").mockImplementation(mockCloseModel3d);

  vi.spyOn(notificationContext, "useNotification").mockReturnValue({
    success: mockNotificationSuccess,
    error: mockNotificationError,
  } as any);

  vi.spyOn(orderServiceApi, "useGetOrderDetail").mockReturnValue({
    data: mockOrderDetails,
    isSuccess: true,
  } as any);

  vi.spyOn(appointmentServiceApi, "useGetAllAppointments").mockReturnValue({
    data: mockAppointments,
  } as any);

  vi.spyOn(orderServiceApi, "useStaffUpdateOrder").mockReturnValue({
    mutateAsync: mockUpdateOrder,
    isPending: false,
  } as any);

  vi.spyOn(orderServiceApi, "useUpdateOrderStatus").mockReturnValue({
    mutateAsync: mockUpdateOrderStatus,
    isPending: false,
  } as any);

  vi.spyOn(appointmentServiceApi, "useChangeAppointmentStatus").mockReturnValue(
    {
      mutateAsync: mockAppointmentStatus,
    } as any
  );
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Appointment_Part_Tracking Component", () => {
  describe("Part Tracking Render", () => {
    it("should render order details and parts correctly", async () => {
      // ARRANGE
      renderWithProvider();

      // ASSERT
      expect(screen.getByText("Order Tracking")).toBeInTheDocument();
      expect(
        screen.getByText(
          `Order #${mockOrderDetails.data.id} - Appointment ID: #${mockAppointmentData.id}`
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Brake Pad")).toBeInTheDocument();
      expect(screen.getByText("Light")).toBeInTheDocument();
      expect(screen.getByText("DANG SONG HUONG")).toBeInTheDocument();
    });

    it("should calculate and display the correct total amount", () => {
      // ARRANGE
      renderWithProvider();

      // ASSERT
      expect(
        screen.getByText("Total Amount").nextElementSibling
      ).toHaveTextContent("8,910₫");
    });

    it("should dispatch closeModel3d on initial render", () => {
      // ARRANGE
      renderWithProvider();

      // ASSERT
      expect(mockDispatch).toHaveBeenCalledWith(mockCloseModel3d());
    });
  });

  describe("Part Quantity Management", () => {
    it("should enter edit mode when edit icon is clicked", async () => {
      // ARRANGE
      renderWithProvider();
      const user = userEvent.setup();

      // ACT
      const editButtons = screen.getAllByTestId("edit-part-button");
      await user.click(editButtons[0]);

      // ASSERT
      expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    });

    it("should update quantity in state on input change and enter", async () => {
      // ARRANGE
      renderWithProvider();
      const user = userEvent.setup();
      const editButtons = screen.getAllByTestId("edit-part-button");
      await user.click(editButtons[0]);
      const input = screen.getByRole("spinbutton");

      // ACT
      await user.clear(input);
      await user.type(input, "3");
      await user.keyboard("{Enter}");

      // ASSERT
      const quantityDisplays = screen.getAllByText("Qty")[0].nextElementSibling;
      expect(quantityDisplays).toHaveTextContent("3");
    });

    it("should show stock warning if quantity exceeds stock", async () => {
      // ARRANGE
      renderWithProvider();
      const user = userEvent.setup();
      const editButtons = screen.getAllByTestId("edit-part-button");
      await user.click(editButtons[0]);
      const input = screen.getByRole("spinbutton");

      // ACT
      await user.clear(input);
      await user.type(input, "5");
      await user.keyboard("{Enter}");

      // ASSERT
      expect(
        screen.queryByText("Exceeds stock by 1 items")
      ).not.toBeInTheDocument();
    });

    it("should NOT update quantity if stock is exceeded", async () => {
      // ARRANGE
      renderWithProvider();
      const user = userEvent.setup();
      const editButtons = screen.getAllByTestId("edit-part-button");
      await user.click(editButtons[0]);
      const input = screen.getByRole("spinbutton");

      // ACT
      await user.clear(input);
      await user.type(input, "11");
      await user.keyboard("{Enter}");

      // ASSERT
      const quantityDisplays = screen.getAllByText("Qty")[0].nextElementSibling;
      expect(quantityDisplays).toHaveTextContent("1");
    });
  });

  describe("Part Deletion", () => {
    it("should open delete confirm modal when delete icon is clicked", async () => {
      // ARRANGE
      renderWithProvider();
      const user = userEvent.setup();

      // ACT
      const deleteButtons = screen.getAllByTestId("delete-part-button");
      await user.click(deleteButtons[0]);

      // ASSERT
      expect(
        screen.getByText("Do you want to delete this part?")
      ).toBeInTheDocument();
    });

    it("should remove part from state when deletion is confirmed", async () => {
      // ARRANGE
      renderWithProvider();
      const user = userEvent.setup();
      const deleteButtons = screen.getAllByTestId("delete-part-button");
      await user.click(deleteButtons[0]);
      const confirmButton = screen.getByRole("button", { name: /Confirm/i });

      // ACT
      await user.click(confirmButton);

      // ASSERT
      expect(screen.queryByText("Brake Pad")).not.toBeInTheDocument();
    });
  });

  describe("Order Confirmation", () => {
    it("should call update mutations and show success modal on confirm", async () => {
      // ARRANGE
      mockUpdateOrder.mockResolvedValueOnce({});
      mockUpdateOrderStatus.mockResolvedValueOnce({});
      renderWithProvider();
      const user = userEvent.setup();

      // ACT
      const confirmButton = screen.getByRole("button", {
        name: /Confirm Order/i,
      });
      await user.click(confirmButton);

      // ASSERT
      await waitFor(() => {
        expect(mockUpdateOrder).toHaveBeenCalled();
        expect(mockUpdateOrderStatus).toHaveBeenCalledWith({
          orderID: mockAppointmentData.orderId,
          status: "Processing",
        });
        expect(
          screen.getByText("Order confirmed successfully")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Order Cancellation", () => {
    it("should call cancel mutations and show notification on cancel", async () => {
      // ARRANGE
      mockAppointmentStatus.mockResolvedValueOnce({});
      mockUpdateOrder.mockResolvedValueOnce({});
      mockUpdateOrderStatus.mockResolvedValueOnce({});
      renderWithProvider();
      const user = userEvent.setup();

      // ACT
      const cancelButton = screen.getByRole("button", { name: /Cancel/i });
      await user.click(cancelButton);
      const confirmCancelButton = screen.getByRole("button", {
        name: /Confirm/i,
      });
      await user.click(confirmCancelButton);

      // ASSERT
      await waitFor(() => {
        expect(mockAppointmentStatus).toHaveBeenCalledWith({
          appointmentId: mockAppointmentData.id,
          status: "Canceled",
        });
        expect(mockUpdateOrder).toHaveBeenCalledWith({
          id: mockAppointmentData.orderId,
          orderParts: [],
        });
        expect(mockUpdateOrderStatus).toHaveBeenCalledWith({
          orderID: mockAppointmentData.orderId,
          status: "Canceled",
        });
        expect(mockNotificationSuccess).toHaveBeenCalled();
      });
    });
  });
});
