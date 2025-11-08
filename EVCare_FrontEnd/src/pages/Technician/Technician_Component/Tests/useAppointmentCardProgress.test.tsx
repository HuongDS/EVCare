import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAppointmentCardProgress } from "../../../../hooks/useAppointmentCardProgress";
import { DamageLevelEnum } from "../../../../models/enums/DamageLevelEnum";
import { TechnicianWorkingSessionEnum } from "../../../../models/enums/TechnicianWorkingSessionEnum";
import type { TechnicianAppointmentsDto } from "../../../../models/AppointmentsModel/Technician_Appointments_Model";

// --- Mock Dependencies ---
vi.mock("../../../../context/useNotification", () => ({
  useNotification: vi.fn(() => ({
    error: vi.fn(),
    success: vi.fn(),
  })),
}));

vi.mock("../../../../services/getTechnicianOrder", () => ({
  getTechnicianAddedParts: vi.fn(),
}));

vi.mock("../../../../services/appointmentPartCondition", () => ({
  getAppointmentPartCondition: vi.fn(),
}));

vi.mock("../../../../services/TechnicianWorkingSessionApi", () => ({
  updateTechnicianWorkingSession: vi.fn(),
}));

// --- Imports sau mock ---
import { getTechnicianAddedParts } from "../../../../services/getTechnicianOrder";
import { getAppointmentPartCondition } from "../../../../services/appointmentPartCondition";
import { updateTechnicianWorkingSession } from "../../../../services/TechnicianWorkingSessionApi";

describe("useAppointmentCardProgress", () => {
  const mockOnStatusChange = vi.fn();
  const mockOnPartsUpdated = vi.fn();

  const baseData: TechnicianAppointmentsDto = {
    id: 1,
    orderId: 101,
    status: TechnicianWorkingSessionEnum.ADDING_PART,
    appointmentDate: "2025-01-01T10:00:00Z",
    vehicleModel: "Mock Vehicle",
    customerName: "Mock Customer",
    phoneNumber: "0000000000",
    licensePlate: "MOCK-123",
    appointmentImages: [],
    services: [],
    parts: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // ARRANGE: Mock API trả về dữ liệu giả lập
    (getTechnicianAddedParts as any).mockReturnValue({
      data: { data: [{ id: 11, name: "Brake Pad" }] },
      isLoading: false,
    });
    (getAppointmentPartCondition as any).mockResolvedValue({
      data: {
        partDamageLevels: [
          { partId: 11, damageLevel: "Moderate" },
          { partId: 22, damageLevel: "Critical" },
        ],
      },
    });
    (updateTechnicianWorkingSession as any).mockResolvedValue(true);
  });

  it("TC01: should initialize with correct default state", () => {
    // ARRANGE + ACT
    const { result } = renderHook(() =>
      useAppointmentCardProgress({ data: baseData })
    );

    // ASSERT
    expect(result.current.currentStatus).toBe(
      TechnicianWorkingSessionEnum.ADDING_PART
    );
    expect(result.current.parts).toEqual([{ id: 11, name: "Brake Pad" }]);
  });

  it("TC02: should map damage levels correctly", async () => {
    // ARRANGE + ACT
    const { result } = renderHook(() =>
      useAppointmentCardProgress({ data: baseData })
    );

    // ASSERT
    await waitFor(() => {
      expect(result.current.damageLevels).toEqual({
        11: DamageLevelEnum.Moderate,
        22: DamageLevelEnum.Critical,
      });
    });
  });

  it("TC03: should call update API and trigger callbacks on success", async () => {
    // ARRANGE
    const { result } = renderHook(() =>
      useAppointmentCardProgress({
        data: baseData,
        onStatusChange: mockOnStatusChange,
        onPartsUpdated: mockOnPartsUpdated,
      })
    );

    // ACT
    await act(async () => {
      await result.current.handleAction(TechnicianWorkingSessionEnum.CONFIRM);
    });

    // ASSERT
    expect(updateTechnicianWorkingSession).toHaveBeenCalledWith({
      orderId: 101,
      status: TechnicianWorkingSessionEnum.CONFIRM,
    });
    expect(mockOnStatusChange).toHaveBeenCalledWith(
      101,
      TechnicianWorkingSessionEnum.CONFIRM
    );
    expect(mockOnPartsUpdated).toHaveBeenCalledWith(101);
    expect(result.current.currentStatus).toBe(
      TechnicianWorkingSessionEnum.CONFIRM
    );
  });

  it("TC04: should rollback status and notify on failure", async () => {
    // ARRANGE
    (updateTechnicianWorkingSession as any).mockRejectedValueOnce(
      new Error("API failed")
    );
    const mockNotification = { error: vi.fn() };
    const useNotification = await import("../../../../context/useNotification");
    (useNotification.useNotification as any).mockReturnValue(mockNotification);

    const { result } = renderHook(() =>
      useAppointmentCardProgress({
        data: baseData,
        onStatusChange: mockOnStatusChange,
        onPartsUpdated: mockOnPartsUpdated,
      })
    );

    // ACT
    await act(async () => {
      await result.current.handleAction(TechnicianWorkingSessionEnum.CONFIRM);
    });

    // ASSERT
    expect(mockOnStatusChange).toHaveBeenCalledWith(
      101,
      TechnicianWorkingSessionEnum.ADDING_PART
    );
    expect(mockNotification.error).toHaveBeenCalled();
    expect(result.current.currentStatus).toBe(
      TechnicianWorkingSessionEnum.ADDING_PART
    );
  });

  it("TC05: should not break if getAppointmentPartCondition throws", async () => {
    // ARRANGE
    (getAppointmentPartCondition as any).mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    // ACT
    const { result } = renderHook(() =>
      useAppointmentCardProgress({ data: baseData })
    );

    // ASSERT
    await waitFor(() => {
      expect(result.current.damageLevels).toEqual({});
    });
  });
});
