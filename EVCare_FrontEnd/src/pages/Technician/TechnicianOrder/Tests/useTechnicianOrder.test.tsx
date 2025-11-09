import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { updateOrderParts } from "../../../../services/updateOrderPartApi";
import { getAllParts } from "../../../../services/partApi";
import { useGetTechnicianAppointments } from "../../../../services/appointmentTechnicianApi";
import { updateAppointmentPartCondition } from "../../../../services/appointmentPartCondition";
import { getTechnicianAddedParts } from "../../../../services/getTechnicianOrder";

vi.mock("../../../../services/updateOrderPartApi", () => ({
  updateOrderParts: vi.fn(),
}));
vi.mock("../../../../services/partApi", () => ({ getAllParts: vi.fn() }));
vi.mock("../../../../services/appointmentTechnicianApi", () => ({
  useGetTechnicianAppointments: vi.fn(),
}));
vi.mock("../../../../services/appointmentPartCondition", () => ({
  updateAppointmentPartCondition: vi.fn(),
}));
vi.mock("../../../../services/getTechnicianOrder", () => ({
  getTechnicianAddedParts: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});

const mockNotificationSuccess = vi.fn();
const mockNotificationError = vi.fn();
vi.mock("../../../../context/useNotification", () => ({
  useNotification: () => ({
    success: mockNotificationSuccess,
    error: mockNotificationError,
  }),
}));

import { useTechnicianOrder } from "../../../../hooks/useTechnicianOrder";
import { DamageLevelEnum } from "../../../../models/enums/DamageLevelEnum";
import type { TechnicianAppointmentsDto } from "../../../../models/AppointmentsModel/Technician_Appointments_Model";

const mockUpdateOrderParts = vi.mocked(updateOrderParts);
const mockGetAllParts = vi.mocked(getAllParts);
const mockUpdatePartCondition = vi.mocked(updateAppointmentPartCondition);
const mockGetAddedParts = vi.mocked(getTechnicianAddedParts);
const mockGetAppointments = vi.mocked(useGetTechnicianAppointments);
const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});

const BASE_ORDER_ID = 999;

const MOCK_PART_A = {
  id: 1,
  name: "Filter A",
  price: 10,
  quantity: 5,
  categoryId: 1,
  isDeleted: false,
} as any;
const MOCK_PART_B = {
  id: 2,
  name: "Brake B",
  price: 20,
  quantity: 10,
  categoryId: 2,
  isDeleted: false,
} as any;
const MOCK_PART_C = {
  id: 3,
  name: "Oil C",
  price: 30,
  quantity: 15,
  categoryId: 1,
  isDeleted: false,
} as any;
const MOCK_PART_D = {
  id: 4,
  name: "Deleted Part",
  price: 10,
  quantity: 5,
  categoryId: 1,
  isDeleted: true,
} as any;

const MOCK_ALL_PARTS_RESPONSE = {
  items: [MOCK_PART_A, MOCK_PART_B, MOCK_PART_C, MOCK_PART_D],
  pageIndex: 1,
  pageSize: 1000,
  totalPages: 1,
} as any;

const MOCK_APPOINTMENT_RES = {
  items: [{ orderId: 999, id: 1234 } as TechnicianAppointmentsDto],
} as any;

const MOCK_TECHNICIAN_PARTS = {
  statusCode: 200,
  isSuccess: true,
  message: "Success",
  data: [{ partID: 1, partName: "Filter A", price: 10, quantity: 2 }],
};

const mockRefetch = vi.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});
const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useTechnicianOrder Hook", () => {
  const onPartsUpdatedMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue({ state: { orderId: BASE_ORDER_ID } });
    mockGetAppointments.mockReturnValue({
      data: MOCK_APPOINTMENT_RES,
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: true,
      isPending: false,
    } as any);
    mockGetAddedParts.mockImplementation(
      () =>
        ({
          data: MOCK_TECHNICIAN_PARTS,
          isLoading: false,
          isFetching: false,
          refetch: mockRefetch,
        } as any)
    );
    mockGetAllParts.mockImplementation(() =>
      Promise.resolve(MOCK_ALL_PARTS_RESPONSE)
    );
    mockUpdateOrderParts.mockResolvedValue({ statusCode: 200 } as any);
    mockUpdatePartCondition.mockResolvedValue({ statusCode: 200 } as any);
    queryClient.clear();
  });

  afterEach(() => {
    mockConsoleError.mockClear();
  });

  it("TC01: should initialize state, fetch data, and sync cart", async () => {
    // ARRANGE + ACT: render hook
    const { result } = renderHook(() => useTechnicianOrder({}), { wrapper });

    // ASSERT: verify fetch and state
    await waitFor(() => expect(mockGetAllParts).toHaveBeenCalledTimes(1));
    await waitFor(
      () => {
        expect(result.current.displayParts.length).toBe(4);
      },
      { timeout: 3000 }
    );

    expect(result.current.cart.length).toBe(1);
    expect(result.current.isLoading).toBe(false);
  });

  it("TC02: handleAddToCart and handleRemoveFromCart", () => {
    // ARRANGE: render hook and empty cart
    const { result } = renderHook(() => useTechnicianOrder({}), { wrapper });
    act(() => result.current.setCart([]));

    // ACT: add parts and remove
    act(() => result.current.handleAddToCart(MOCK_PART_B, 3));
    act(() => result.current.handleAddToCart(MOCK_PART_B, 2));
    act(() => result.current.handleRemoveFromCart(MOCK_PART_B.id));

    // ASSERT: cart updates correctly
    expect(result.current.cart.length).toBe(0);
  });

  it("TC03: should filter parts and handle pagination", async () => {
    // ARRANGE: render hook
    const { result } = renderHook(() => useTechnicianOrder({}), { wrapper });
    await waitFor(() => result.current.displayParts.length === 4);
    // ACT: filter and change page
    act(() => result.current.setSearchQuery("oil"));

    // ASSERT: filtered list and page number
    await waitFor(() => {
      expect(result.current.displayParts.length).toBe(1);
      expect(result.current.displayParts[0].name).toBe("Oil C");
    });
    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
  });

  it("TC04: handleSendCart success path", async () => {
    // ARRANGE: render hook with onPartsUpdated callback
    const { result } = renderHook(
      () =>
        useTechnicianOrder({
          propOrderId: BASE_ORDER_ID,
          onPartsUpdated: onPartsUpdatedMock,
        }),
      { wrapper }
    );
    await waitFor(() => result.current.displayParts.length === 4);
    act(() => result.current.setCart([{ part: MOCK_PART_B, quantity: 5 }]));

    // ACT: send cart
    await act(async () => {
      await result.current.handleSendCart({ 2: DamageLevelEnum.Severe });
    });

    // ASSERT: notification success and refetch called
    expect(mockNotificationSuccess).toHaveBeenCalledTimes(1);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("TC05: should guard against invalid orderId and handle failure", async () => {
    // ARRANGE: invalid orderId
    mockUseLocation.mockReturnValue({ state: { orderId: null } });
    const { result: resultGuard } = renderHook(
      () => useTechnicianOrder({ propOrderId: 1000 }),
      { wrapper }
    );

    // ACT: attempt to send cart
    await act(async () => {
      await resultGuard.current.handleSendCart({});
    });

    // ASSERT: updateOrderParts not called
    expect(mockUpdateOrderParts).not.toHaveBeenCalled();

    // ARRANGE: valid orderId, simulate failure
    mockUpdateOrderParts.mockRejectedValue(new Error("Update failed"));
    const { result } = renderHook(
      () => useTechnicianOrder({ propOrderId: BASE_ORDER_ID }),
      { wrapper }
    );
    await waitFor(() => result.current.displayParts.length > 0);
    act(() => {
      result.current.setCart([{ part: MOCK_PART_B, quantity: 5 }]);
      result.current.setIsSending(true);
    });

    // ACT: attempt sendCart again
    await act(async () => {
      await result.current.handleSendCart({});
    });

    // ASSERT: console error & notification error triggered, isSending reset
    expect(mockUpdateOrderParts).not.toHaveBeenCalled();
    act(() => (result.current as any).setIsSending(false));
    await act(async () => {
      await result.current.handleSendCart({});
    });
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockNotificationError).toHaveBeenCalledTimes(1);
    expect(result.current.isSending).toBe(false);
  });

  it("TC06: handleProductCardClick guards deleted/out-of-stock parts", async () => {
    // ARRANGE: render hook
    const { result } = renderHook(
      () => useTechnicianOrder({ propOrderId: BASE_ORDER_ID }),
      { wrapper }
    );
    await waitFor(() => result.current.displayParts.length > 0);

    // ACT: click valid part
    act(() => {
      result.current.handleProductCardClick(MOCK_PART_A);
    });

    // ASSERT: selected part set and modal open
    expect(result.current.selectedPart).toEqual(MOCK_PART_A);
    expect(result.current.open).toBe(true);

    // ACT: click deleted part
    act(() => {
      result.current.setOpen(false);
      result.current.handleProductCardClick(MOCK_PART_D);
    });

    // ASSERT: selected part unchanged, modal stays closed
    expect(result.current.selectedPart).toEqual(MOCK_PART_A);
    expect(result.current.open).toBe(false);
  });
});
