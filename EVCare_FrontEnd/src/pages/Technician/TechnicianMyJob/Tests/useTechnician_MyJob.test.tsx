import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { MemoryRouter, useNavigate, useLocation } from "react-router-dom"; 

import { useTechnician_MyJob } from "../../../../hooks/useTechnician_MyJob";
import { useGetTechnicianAppointments } from "../../../../services/appointmentTechnicianApi";
import { updateTechnicianWorkingSession } from "../../../../services/TechnicianWorkingSessionApi";
import { TechnicianWorkingSessionEnum } from "../../../../models/enums";

// --- MOCK API SERVICES ---
vi.mock("../../../../services/appointmentTechnicianApi", () => ({
  useGetTechnicianAppointments: vi.fn(),
}));
vi.mock("../../../../services/TechnicianWorkingSessionApi", () => ({
  updateTechnicianWorkingSession: vi.fn(),
}));

// --- MOCK REACT ROUTER DOM ---
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

const mockRefetch = vi.fn();

const mockAppointmentsAddingPart = {
  items: [
    { id: 888, orderId: 101, status: TechnicianWorkingSessionEnum.ADDING_PART },
  ],
};
const mockAppointmentsPendingWithData = {
  items: [
    { id: 999, orderId: 123, status: TechnicianWorkingSessionEnum.PENDING },
  ],
};
const mockAppointmentsPendingEmpty = {
  items: [],
};

describe("useTechnician_MyJob", () => {
  const mockUseNavigate = vi.mocked(useNavigate);
  const mockUseLocation = vi.mocked(useLocation);

  const mockNavigateInstance = vi.fn();

  const mockGetAppointment = vi.mocked(useGetTechnicianAppointments);
  const mockUpdateSession = vi.mocked(updateTechnicianWorkingSession);

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseNavigate.mockReturnValue(mockNavigateInstance);

    mockUseLocation.mockReturnValue({
      pathname: "/technician/my-job",
      state: {},
      key: "defaultKey",
      search: "",
      hash: "",
    });

    mockUpdateSession.mockResolvedValue(true as any);

    mockGetAppointment.mockImplementation((params: any) => {
      if (params.Status === "Pending") {
        return {
          data: mockAppointmentsPendingEmpty,
          isLoading: false,
          isFetching: false,
        } as any;
      }
      return {
        data: mockAppointmentsAddingPart,
        isLoading: false,
        isFetching: false,
        refetch: mockRefetch,
      } as any;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("TC01: return appointment from API - Get Appointment", async () => {
    // ARRANGE + ACT
    const { result } = renderHook(() => useTechnician_MyJob(), {
      wrapper: MemoryRouter,
    });

    // ASSERT
    await waitFor(() => {
      expect(result.current.appointments).toEqual(
        mockAppointmentsAddingPart.items
      );
    });
  });

  it("TC02: should update pending job and refetch when pendingData is available", async () => {
    // ARRANGE
    mockGetAppointment
      .mockReturnValueOnce({
        data: mockAppointmentsAddingPart,
        isLoading: false,
        isFetching: false,
        refetch: mockRefetch,
      } as any)
      .mockReturnValueOnce({
        data: mockAppointmentsPendingWithData,
        isLoading: false,
        isFetching: false,
      } as any);

    // ACT
    renderHook(() => useTechnician_MyJob(), { wrapper: MemoryRouter });

    // ASSERT
    await waitFor(() => {
      expect(mockUpdateSession).toHaveBeenCalledWith({
        orderId: 123,
        status: TechnicianWorkingSessionEnum.ADDING_PART,
      });
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it("TC03: should NOT update pending job if isPendingFetching is true", async () => {
    // ARRANGE
    mockGetAppointment
      .mockReturnValueOnce({
        data: mockAppointmentsAddingPart,
        isLoading: false,
        isFetching: false,
        refetch: mockRefetch,
      } as any)
      .mockReturnValueOnce({
        data: mockAppointmentsPendingWithData,
        isLoading: false,
        isFetching: true,
      } as any);

    // ACT
    renderHook(() => useTechnician_MyJob(), { wrapper: MemoryRouter });

    // ASSERT
    await vi.waitFor(() => new Promise((res) => setTimeout(res, 50)));
    expect(mockUpdateSession).not.toHaveBeenCalled();
    expect(mockRefetch).not.toHaveBeenCalled();
  });

  it("TC04: should NOT update pending job if pendingData is empty", async () => {
    // ARRANGE + ACT
    renderHook(() => useTechnician_MyJob(), { wrapper: MemoryRouter });

    // ASSERT
    await vi.waitFor(() => new Promise((res) => setTimeout(res, 50)));
    expect(mockUpdateSession).not.toHaveBeenCalled();
    expect(mockRefetch).not.toHaveBeenCalled();
  });

  it("TC05: should NOT refetch if update API call fails (returns false)", async () => {
    // ARRANGE
    mockUpdateSession.mockResolvedValue(false as any);
    mockGetAppointment
      .mockReturnValueOnce({
        data: mockAppointmentsAddingPart,
        isLoading: false,
        isFetching: false,
        refetch: mockRefetch,
      } as any)
      .mockReturnValueOnce({
        data: mockAppointmentsPendingWithData,
        isLoading: false,
        isFetching: false,
      } as any);

    // ACT
    renderHook(() => useTechnician_MyJob(), { wrapper: MemoryRouter });

    // ASSERT
    await waitFor(() => {
      expect(mockUpdateSession).toHaveBeenCalledWith({
        orderId: 123,
        status: TechnicianWorkingSessionEnum.ADDING_PART,
      });
      expect(mockRefetch).not.toHaveBeenCalled();
    });
  });

  it("TC06: should update activeStatus and navigate when location.state.tab changes", async () => {
    // ARRANGE
    const { rerender, result } = renderHook(() => useTechnician_MyJob(), {
      wrapper: MemoryRouter,
    });

    await waitFor(() => {
      expect(result.current.activeStatus).toBeDefined();
    });

    mockUseLocation.mockReturnValue({
      pathname: "/technician/my-job",
      state: { tab: TechnicianWorkingSessionEnum.ADDING_PART },
      key: "newKey",
      search: "",
      hash: "",
    });

    // ACT
    await act(async () => {
      rerender();
    });

    // ASSERT
    await waitFor(() => {
      expect(mockNavigateInstance).toHaveBeenCalledWith("/technician/my-job", {
        replace: true,
        state: {},
      });
      expect(result.current.activeStatus).toBe(
        TechnicianWorkingSessionEnum.ADDING_PART
      );
    });
  });

  it("TC07: handleUpdateStatus - should optimistically update, then refetch and set status after timer", async () => {
    // ARRANGE
    const newStatus = TechnicianWorkingSessionEnum.CONFIRM;
    const { result } = renderHook(() => useTechnician_MyJob(), {
      wrapper: MemoryRouter,
    });

    await waitFor(() => {
      expect(result.current.appointments[0].status).toBe(
        TechnicianWorkingSessionEnum.ADDING_PART
      );
    });

    vi.useFakeTimers();

    // ACT
    act(() => {
      result.current.handleUpdateStatus(101, newStatus);
    });

    // ASSERT (immediate optimistic update)
    expect(result.current.appointments[0].status).toBe(newStatus);
    expect(mockRefetch).not.toHaveBeenCalled();

    // ACT: advance timers
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // ASSERT: after timer, refetch called & activeStatus updated
    expect(mockRefetch).toHaveBeenCalled();
    expect(result.current.activeStatus).toBe(newStatus);
  });

  it("TC08: handleUpdateStatus - should not set activeStatus if new status is same", async () => {
    // ARRANGE
    const newStatus = TechnicianWorkingSessionEnum.ADDING_PART;
    const { result } = renderHook(() => useTechnician_MyJob(), {
      wrapper: MemoryRouter,
    });

    await waitFor(() => {
      expect(result.current.appointments.length).toBeGreaterThan(0);
    });

    const initialStatus = result.current.activeStatus;
    vi.useFakeTimers();

    // ACT
    act(() => {
      result.current.handleUpdateStatus(101, newStatus);
    });

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // ASSERT
    expect(mockRefetch).toHaveBeenCalled();
    expect(result.current.activeStatus).toBe(initialStatus);
  });

  it("TC09: handlePartsUpdated - should update appointments and call refetch", async () => {
    // ARRANGE
    const { result } = renderHook(() => useTechnician_MyJob(), {
      wrapper: MemoryRouter,
    });

    // ACT
    act(() => {
      result.current.handlePartsUpdated(101);
    });

    // ASSERT
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it("TC10: should not set state if isLoading is true", async () => {
    // ARRANGE
    mockGetAppointment.mockImplementation((params: any) => {
      if (params.Status === "Pending") {
        return {
          data: mockAppointmentsPendingEmpty,
          isLoading: false,
          isFetching: false,
        } as any;
      }
      return {
        data: undefined,
        isLoading: true,
        isFetching: false,
        refetch: mockRefetch,
      } as any;
    });

    const { result } = renderHook(() => useTechnician_MyJob(), {
      wrapper: MemoryRouter,
    });

    // ASSERT
    await waitFor(() => {
      expect(result.current.appointments).toEqual([]);
    });
    expect(result.current.fade).toBe(false);
  });

  it("TC11: should set appointments to empty array if data is undefined", async () => {
    // ARRANGE
    mockGetAppointment.mockImplementation((params: any) => {
      if (params.Status === "Pending") {
        return {
          data: mockAppointmentsPendingEmpty,
          isLoading: false,
          isFetching: false,
        } as any;
      }
      return {
        data: undefined,
        isLoading: false,
        isFetching: false,
        refetch: mockRefetch,
      } as any;
    });

    const { result } = renderHook(() => useTechnician_MyJob(), {
      wrapper: MemoryRouter,
    });

    // ASSERT
    await waitFor(() => {
      expect(result.current.appointments).toEqual([]);
    });
    expect(result.current.fade).toBe(true);
  });
});
