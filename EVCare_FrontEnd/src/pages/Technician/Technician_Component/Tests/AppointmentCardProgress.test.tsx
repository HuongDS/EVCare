import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DamageLevelEnum } from "../../../../models/enums/DamageLevelEnum";
import { TechnicianWorkingSessionEnum } from "../../../../models/enums";
import { useAppointmentCardProgress } from "../../../../hooks/useAppointmentCardProgress";
import { getTechnicianAddedParts } from "../../../../services/getTechnicianOrder";
import { getAppointmentPartCondition } from "../../../../services/appointmentPartCondition";
import { updateTechnicianWorkingSession } from "../../../../services/TechnicianWorkingSessionApi";
import type { TechnicianAppointmentsDto } from "../../../../models/AppointmentsModel/Technician_Appointments_Model";

vi.mock("../../../../services/getTechnicianOrder", () => ({
  getTechnicianAddedParts: vi.fn(),
}));

vi.mock("../../../../services/appointmentPartCondition", () => ({
  getAppointmentPartCondition: vi.fn(),
}));

vi.mock("../../../../services/TechnicianWorkingSessionApi", () => ({
  updateTechnicianWorkingSession: vi.fn(),
}));

vi.mock("../../../../context/useNotification", () => ({
  useNotification: () => ({
    error: mockNotificationError,
  }),
}));

const mockNotificationError = vi.fn();
const mockGetAddedParts = vi.mocked(getTechnicianAddedParts);
const mockGetPartCondition = vi.mocked(getAppointmentPartCondition);
const mockUpdateSession = vi.mocked(updateTechnicianWorkingSession);
const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});

const BASE_DATA = {
  id: 123,
  orderId: 999,
  status: TechnicianWorkingSessionEnum.PENDING,
  customerName: "Mock Customer",
  vehicleModel: "Mock Vehicle",
  licensePlate: "MOCK-123",
  phoneNumber: "0000000000",
  appointmentDate: "2025-01-01T10:00:00Z",
  appointmentImages: [],
  services: [],
  parts: [],
} as unknown as TechnicianAppointmentsDto;

const MOCK_ADDED_PARTS = {
  statusCode: 200,
  isSuccess: true,
  message: "Success",
  data: [
    {
      partID: 100,
      partName: "Brake Pad",
      orderId: 999,
      quantity: 2,
      price: 500000,
    },
    {
      partID: 101,
      partName: "Oil Filter",
      orderId: 999,
      quantity: 1,
      price: 150000,
    },
  ],
};

const MOCK_CONDITION_SUCCESS = {
  statusCode: 200,
  isSuccess: true,
  message: "Success",
  data: {
    appointmentId: 123,
    partDamageLevels: [
      {
        partId: 100,
        damageLevel: "Severe",
        partName: "Mock",
        partUrl: "mock.jpg",
      },
      {
        partId: 101,
        damageLevel: "Minor",
        partName: "Mock",
        partUrl: "mock.jpg",
      },
      {
        partId: 102,
        damageLevel: "Moderate",
        partName: "Mock",
        partUrl: "mock.jpg",
      },
      {
        partId: 103,
        damageLevel: "Critical",
        partName: "Mock",
        partUrl: "mock.jpg",
      },
      {
        partId: 104,
        damageLevel: "Unknown",
        partName: "Mock",
        partUrl: "mock.jpg",
      },
    ],
  },
};

describe("useAppointmentCardProgress Hook", () => {
  const onStatusChangeMock = vi.fn();
  const onPartsUpdatedMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockGetAddedParts.mockReturnValue({
      data: MOCK_ADDED_PARTS,
      isLoading: false,
      isPending: false,
      isError: false,
      isSuccess: true,
    } as any);

    mockGetPartCondition.mockResolvedValue(MOCK_CONDITION_SUCCESS);

    mockUpdateSession.mockResolvedValue({
      statusCode: 200,
      isSuccess: true,
      message: "Updated successfully",
      data: undefined,
    } as any);
  });

  it("TC01: should fetch parts and damage levels correctly on initial load (Success Path)", async () => {
    // ARRANGE
    const { result } = renderHook(() =>
      useAppointmentCardProgress({
        data: BASE_DATA,
        onStatusChange: onStatusChangeMock,
        onPartsUpdated: onPartsUpdatedMock,
      })
    );

    // ASSERT
    expect(result.current.currentStatus).toBe(
      TechnicianWorkingSessionEnum.PENDING
    );
    expect(result.current.parts).toEqual(MOCK_ADDED_PARTS.data);

    await waitFor(() => {
      expect(mockGetPartCondition).toHaveBeenCalledWith(BASE_DATA.id);
      expect(result.current.damageLevels).toEqual({
        100: DamageLevelEnum.Severe,
        101: DamageLevelEnum.Minor,
        102: DamageLevelEnum.Moderate,
        103: DamageLevelEnum.Critical,
        104: DamageLevelEnum.NotAssessed,
      });
    });
  });

  it("TC02: handleAction should update status, call API, and call onPartsUpdated on success", async () => {
    // ARRANGE
    const { result } = renderHook(() =>
      useAppointmentCardProgress({
        data: BASE_DATA,
        onStatusChange: onStatusChangeMock,
        onPartsUpdated: onPartsUpdatedMock,
      })
    );

    // ACT
    await act(async () => {
      await result.current.handleAction(TechnicianWorkingSessionEnum.CONFIRM);
    });

    // ASSERT
    expect(onStatusChangeMock).toHaveBeenCalledWith(
      BASE_DATA.orderId,
      TechnicianWorkingSessionEnum.CONFIRM
    );
    expect(mockUpdateSession).toHaveBeenCalledWith({
      orderId: BASE_DATA.orderId,
      status: TechnicianWorkingSessionEnum.CONFIRM,
    });
    expect(result.current.currentStatus).toBe(
      TechnicianWorkingSessionEnum.CONFIRM
    );
    expect(onPartsUpdatedMock).toHaveBeenCalledWith(BASE_DATA.orderId);
    expect(mockNotificationError).not.toHaveBeenCalled();
  });

  it("TC03: handleAction should rollback status and show error notification on API failure", async () => {
    // ARRANGE
    mockUpdateSession.mockRejectedValue(new Error("API Failed"));
    const { result } = renderHook(() =>
      useAppointmentCardProgress({
        data: BASE_DATA,
        onStatusChange: onStatusChangeMock,
        onPartsUpdated: onPartsUpdatedMock,
      })
    );

    await waitFor(() =>
      expect(result.current.currentStatus).toBe(
        TechnicianWorkingSessionEnum.PENDING
      )
    );

    // ACT
    await act(async () => {
      await result.current.handleAction(TechnicianWorkingSessionEnum.CONFIRM);
    });

    // ASSERT
    expect(mockConsoleError).toHaveBeenCalledWith(new Error("API Failed"));
    expect(result.current.currentStatus).toBe(
      TechnicianWorkingSessionEnum.PENDING
    );
    expect(onStatusChangeMock).toHaveBeenCalledWith(
      BASE_DATA.orderId,
      TechnicianWorkingSessionEnum.PENDING
    );
    expect(mockNotificationError).toHaveBeenCalledTimes(1);
    expect(mockNotificationError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Can't update status. Please try again!",
      })
    );
    expect(onPartsUpdatedMock).not.toHaveBeenCalled();
  });

  it("TC04: should handle error when fetching damage levels API fails", async () => {
    // ARRANGE
    mockGetPartCondition.mockRejectedValue(new Error("Condition Fetch Failed"));
    const { result } = renderHook(() =>
      useAppointmentCardProgress({ data: BASE_DATA })
    );

    // ACT
    await waitFor(() => {
      expect(mockGetPartCondition).toHaveBeenCalled();
    });

    // ASSERT
    expect(mockConsoleError).toHaveBeenCalledWith(
      "Failed to load part condition:",
      new Error("Condition Fetch Failed")
    );
    expect(result.current.damageLevels).toEqual({});
  });

  it("TC05: should NOT call fetchDamageLevels if data.id is falsy", async () => {
    // ARRANGE
    const dataNoId = { ...BASE_DATA, id: null } as any;

    // ACT
    renderHook(() => useAppointmentCardProgress({ data: dataNoId }));

    // ASSERT
    await new Promise((r) => setTimeout(r, 50));
    expect(mockGetPartCondition).not.toHaveBeenCalled();
  });
  it("TC06: should set parts to empty array when addedPartsResponse.data is undefined", async () => {
    // ARRANGE
    mockGetAddedParts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isPending: false,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() =>
      useAppointmentCardProgress({
        data: BASE_DATA,
        onStatusChange: vi.fn(),
        onPartsUpdated: vi.fn(),
      })
    );

    // ACT
    await waitFor(() => {
      expect(result.current.parts).toEqual([]);
    });
  });
});
