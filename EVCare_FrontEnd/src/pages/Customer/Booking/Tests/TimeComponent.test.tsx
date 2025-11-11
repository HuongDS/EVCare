import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import TimeSection from "../TimeSection";
import * as serviceCenterService from "../../../../services/serviceCenterService";
import { useNotification } from "../../../../context/useNotification";
import type { ResponseDto } from "../../../../models/AuthModel/authModel";
import type { ServiceCenterViewModel } from "../../../../models/ServiceCenter/ServiceCenterViewModel";
import dayjs, { Dayjs } from "dayjs";
import type { BlockedDateViewModel } from "../../../../models/BlockedDate/BlockedDateViewModel";
import { DatePicker, TimePicker } from "antd";

vi.mock("../../../../services/serviceCenterService");
vi.mock("../../../../context/useNotification");
vi.mock("antd", async (importOriginal) => {
  const antd: any = await importOriginal();

  const MockDatePicker = (props: any) => {
    MockDatePicker.currentProps = props;
    return (
      <div data-testid="mock-date-picker">
        {props.cellRender && props.cellRender(dayjs(), { type: "date" })}
        <button data-testid="date-change" onClick={() => props.onChange(dayjs("2025-12-25"))}>
          Change Date
        </button>
      </div>
    );
  };
  MockDatePicker.currentProps = {};

  const MockTimePicker = (props: any) => {
    MockTimePicker.currentProps = props;
    return (
      <div data-testid="mock-time-picker">
        <button data-testid="time-change" onClick={() => props.onChange(dayjs("14:30:00"))}>
          Change Time
        </button>
        <button data-testid="time-clear" onClick={() => props.onChange(null)}>
          Clear Time
        </button>
      </div>
    );
  };
  MockTimePicker.currentProps = {};
  return {
    ...antd,
    DatePicker: MockDatePicker,
    TimePicker: MockTimePicker,
  };
});

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
    openTime: "09:00:00",
    closeTime: "17:00:00",
    hotline: "HotlineTest",
    workStartDay: "StartDate",
    workEndDay: "EndDate",
  } as any,
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

describe("TS01: TimeSection", () => {
  it("TC01: should fetch data (center info and blocked dates) on mount", async () => {
    // ARRANGE
    render(<TimeSection {...baseProps} />);
    // ACT & ASSERT
    await waitFor(() => {
      expect(mockedGetCenterInfo).toHaveBeenCalledTimes(1);
      expect(mockedGetBlockedDate).toHaveBeenCalledTimes(1);
    });
    expect(mockNotification.error).not.toHaveBeenCalled();
  });

  it("TC02: should call notification.error if getCenterInformation fails", async () => {
    // ARRANGE
    const apiError = new Error("API is down");
    mockedGetCenterInfo.mockRejectedValue(apiError);

    // ACT
    render(<TimeSection {...baseProps} />);

    // ASSERT
    await waitFor(
      () => {
        expect(mockNotification.error).toHaveBeenCalledTimes(1);
        expect(mockNotification.error).toHaveBeenCalledWith(
          expect.objectContaining({
            description: "Failed to fetch data",
          })
        );
      },
      { timeout: 10000 }
    );
  });

  it("TC03: should call notification.error if getBlockedDate fails", async () => {
    // ARRANGE
    const apiError = new Error("API is down");
    mockedGetBlockedDate.mockRejectedValue(apiError);

    // ACT
    render(<TimeSection {...baseProps} />);

    // ASSERT
    await waitFor(
      () => {
        expect(mockNotification.error).toHaveBeenCalledTimes(1);
      },
      { timeout: 10000 }
    );
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

  it("TC06: should call handleSelectDate when DatePicker value changes", async () => {
    // ARRANGE
    render(<TimeSection {...baseProps} />);
    const dateChangeButton = screen.getByTestId("date-change");
    // ACT
    fireEvent.click(dateChangeButton);
    // ASSERT
    expect(baseProps.handleSelectDate).toHaveBeenCalledTimes(1);
  });

  it("TC07: should call handleSelectTime when TimePicker value changes", async () => {
    // ARRANGE
    render(<TimeSection {...baseProps} />);
    const timeChangeButton = screen.getByTestId("time-change");
    // ACT
    fireEvent.click(timeChangeButton);
    // ASSERT
    expect(baseProps.handleSelectTime).toHaveBeenCalledTimes(1);
  });

  it("TC08: should call handleSelectTime with undefined when TimePicker value is null", async () => {
    // ARRANGE
    render(<TimeSection {...baseProps} />);
    const clearButton = screen.getByTestId("time-clear");
    // ACT
    fireEvent.click(clearButton);
    // ASSERT
    expect(baseProps.handleSelectTime).toHaveBeenCalledWith(undefined);
    expect(baseProps.handleSelectTime).toHaveBeenCalledTimes(1);
  });
});

describe("TS02: TimeSection - Disable Logic", () => {
  const NOW = dayjs().hour(14).minute(30).second(0).millisecond(0);
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetCenterInfo.mockResolvedValue(mockCenterInfo);
    mockedGetBlockedDate.mockResolvedValue(mockBlockedDates);
    mockedUseNotification.mockReturnValue(mockNotification);
    vi.useFakeTimers();
    vi.setSystemTime(NOW.toDate());

    (DatePicker as any).currentProps = {};
    (TimePicker as any).currentProps = {};
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const getDisableDateFn = () => {
    return (DatePicker as any).currentProps.disabledDate as (current: Dayjs) => boolean;
  };

  const getDisableTimeFn = () => {
    return (TimePicker as any).currentProps.disabledTime as (current: Dayjs) => {
      disabledHours: () => number[];
      disabledMinutes: (h?: number) => number[];
    };
  };

  it("TC01: disableDate - should disable dates in the past (isPast)", async () => {
    // ARRANGE
    render(<TimeSection {...baseProps} />);
    // ACT
    await act(async () => {
      vi.runAllTimers();
    });
    // ASSERT
    const disableDate = getDisableDateFn();
    expect(disableDate).toBeDefined();
    expect(disableDate(NOW.subtract(1, "day").startOf("day"))).toBe(true);
    expect(disableDate(NOW.add(1, "day").startOf("day"))).toBe(false);
    expect(disableDate(null as any)).toBe(false);
  });

  it("TC02: disableDate - should disable a blocked date (isBlocked)", async () => {
    // ARRANGE
    const nextDay = NOW.add(1, "day").startOf("day");
    mockedGetBlockedDate.mockResolvedValue({
      statusCode: 200,
      data: [{ dateTime: nextDay, reason: "Test Block" }],
    });
    render(<TimeSection {...baseProps} />);
    // ACT
    await act(async () => {
      vi.runAllTimers();
    });
    // ASSERT
    const disableDate = getDisableDateFn();
    expect(disableDate).toBeDefined();
    expect(disableDate(nextDay)).toBe(true);
    expect(disableDate(nextDay.add(1, "day"))).toBe(false);
  });

  it("TC03: disableTime - disabledHours should disable hours outside of 09:00 - 17:00", async () => {
    // ARRANGE
    render(<TimeSection {...baseProps} />);
    // ACT
    await act(async () => {
      vi.runAllTimers();
    });
    // ASSERT
    const disableTime = getDisableTimeFn();
    expect(disableTime).toBeDefined();
    const disabledHours = disableTime(dayjs()).disabledHours();
    expect(disabledHours).toHaveLength(15);
    expect(disabledHours).toContain(8);
    expect(disabledHours).toContain(18);
    expect(disabledHours).not.toContain(9);
    expect(disabledHours).not.toContain(17);
  });

  it("TC04: disableTime - disabledMinutes should restrict time on current day (cutoff logic)", async () => {
    // ARRANGE
    const TODAY = NOW.startOf("day");
    const propsWithDate = { ...baseProps, date: TODAY };
    render(<TimeSection {...propsWithDate} />);
    //  ACT
    await act(async () => {
      vi.runAllTimers();
    });
    // ASSERT
    const disableTime = getDisableTimeFn();
    expect(disableTime).toBeDefined();
    const disabledMinutes = disableTime(dayjs()).disabledMinutes;
    const minutes15 = disabledMinutes(15);
    expect(minutes15).toHaveLength(30);
    expect(minutes15).toContain(29);
    expect(minutes15).not.toContain(30);
    const minutes14 = disabledMinutes(14);
    expect(minutes14).toHaveLength(60);
    const minutes16 = disabledMinutes(16);
    expect(minutes16).toHaveLength(0);
  });

  it("TC05: disableTime - disabledMinutes should restrict minutes based on start/end time (future day)", async () => {
    // ARRANGE
    const centerInfo: ResponseDto<ServiceCenterViewModel> = {
      statusCode: 200,
      data: {
        name: "Test",
        address: "AddressTest",
        openTime: "09:15:00",
        closeTime: "17:00:00",
        hotline: "HotlineTest",
        workStartDay: "StartDate",
        workEndDay: "EndDate",
      } as any,
    };
    mockedGetCenterInfo.mockResolvedValue(centerInfo);
    const FUTURE_DAY = NOW.add(1, "day");
    const propsWithDate = { ...baseProps, date: FUTURE_DAY };
    render(<TimeSection {...propsWithDate} />);
    // ACT
    await act(async () => {
      vi.runAllTimers();
    });
    // ASSERT
    const disableTime = getDisableTimeFn();
    expect(disableTime).toBeDefined();
    const disabledMinutes = disableTime(dayjs()).disabledMinutes;

    const minutes09 = disabledMinutes(9);
    expect(minutes09).toHaveLength(15);
    expect(minutes09).not.toContain(15);

    const minutes17 = disabledMinutes(17);
    expect(minutes17).toHaveLength(60);

    expect(disabledMinutes(undefined)).toHaveLength(0);

    expect(disabledMinutes(10)).toHaveLength(0);
  });

  it("TC06: disabledHours - should NOT disable any hours if API returns null data", async () => {
    // ARRANGE
    mockedGetCenterInfo.mockResolvedValue({ statusCode: 200, data: undefined });
    render(<TimeSection {...baseProps} />);
    // ACT
    await act(async () => {
      vi.runAllTimers();
    });
    // ASSERT
    const disableTime = getDisableTimeFn();
    expect(disableTime).toBeDefined();
    const disabledHours = disableTime(dayjs()).disabledHours();
    expect(disabledHours).toHaveLength(0);
  });
});
