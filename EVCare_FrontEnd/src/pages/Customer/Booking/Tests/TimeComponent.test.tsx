import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import TimeSection from "../TimeSection";
import * as serviceCenterService from "../../../../services/serviceCenterService";
import { useNotification } from "../../../../context/useNotification";
import type { ResponseDto } from "../../../../models/AuthModel/authModel";
import type { ServiceCenterViewModel } from "../../../../models/ServiceCenter/ServiceCenterViewModel";
import dayjs from "dayjs";
import type { BlockedDateViewModel } from "../../../../models/BlockedDate/BlockedDateViewModel";

vi.mock("../../../../services/serviceCenterService");

vi.mock("../../../../context/useNotification");

const mockedGetCenterInfo = vi.mocked(serviceCenterService.getCenterInformation);
const mockedGetBlockedDate = vi.mocked(serviceCenterService.getBlockedDate);
const mockedUseNotification = vi.mocked(useNotification);

const mockNotification = {
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  open: vi.fn(),
  destroy: vi.fn(),
};
const mockCenterInfo: ResponseDto<ServiceCenterViewModel> = {
  statusCode: 200,
  data: {
    name: "Test",
    address: "AddressTest",
    openTime: dayjs("09:00:00"),
    closeTime: dayjs("17:00:00"),
    hotline: "HotlineTest",
    workStartDay: "StartDate",
    workEndDay: "EndDate",
  },
};
const mockBlockedDates: ResponseDto<BlockedDateViewModel[]> = {
  statusCode: 200,
  data: [{ dateTime: dayjs("2025-11-20T00:00:00"), reason: "Blocked Date" }],
};

const baseProps = {
  date: undefined,
  time: undefined,
  handleSelectDate: vi.fn(),
  handleSelectTime: vi.fn(),
  errors: {},
};

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetCenterInfo.mockResolvedValue(mockCenterInfo);
  mockedGetBlockedDate.mockResolvedValue(mockBlockedDates);
  mockedUseNotification.mockReturnValue(mockNotification);
});

describe("TimeSection", () => {
  it("TC01: should fetch data (center info and blocked dates) on mount", async () => {
    // ARRANGE
    render(<TimeSection {...baseProps} />);
    // ACT
    await waitFor(() => {
      // ASSERT
      expect(mockedGetCenterInfo).toHaveBeenCalledTimes(1);
      expect(mockedGetBlockedDate).toHaveBeenCalledTimes(1);
      expect(mockNotification.error).not.toHaveBeenCalled();
    });
  });

  it("TC02: should call notification.error if getCenterInformation fails", async () => {
    // ARRANGE
    const apiError = new Error("API is down");
    mockedGetCenterInfo.mockRejectedValue(apiError);

    // ACT
    render(<TimeSection {...baseProps} />);

    // ASSERT
    await waitFor(() => {
      expect(mockNotification.error).toHaveBeenCalledTimes(1);
      expect(mockNotification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Failed to fetch data",
        })
      );
    });
  });

  it("TC03: should call notification.error if getBlockedDate fails", async () => {
    // ARRANGE
    const apiError = new Error("API is down");
    mockedGetBlockedDate.mockRejectedValue(apiError);

    // ACT
    render(<TimeSection {...baseProps} />);

    // ASSERT
    await waitFor(() => {
      expect(mockNotification.error).toHaveBeenCalledTimes(1);
    });
  });

  it("TC04: should render error messages when passed via props", () => {
    // ARRANGE
    const errors = {
      date: "Please select a date.",
      time: "Please select a time.",
    };

    // ACT
    render(<TimeSection {...baseProps} errors={errors} />);

    // ASSERT
    expect(screen.getByText("Please select a date.")).toBeInTheDocument();
    expect(screen.getByText("Please select a time.")).toBeInTheDocument();
  });

  it("TC05: should NOT render error messages when errors prop is empty", () => {
    // ARRANGE
    render(<TimeSection {...baseProps} errors={{}} />);

    // ASSERT
    expect(screen.queryByText("Please select a date.")).not.toBeInTheDocument();
    expect(screen.queryByText("Please select a time.")).not.toBeInTheDocument();
  });
});
