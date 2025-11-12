import { beforeEach, describe, expect, it, vi } from "vitest";
import * as customerServices from "../../../../services/customerServices";
import * as vehicleServices from "../../../../services/vehicleServicesApi";
import * as serviceServices from "../../../../services/serviceServicesApi";
import * as accountService from "../../../../services/accountService";
import * as appointmentService from "../../../../services/appointmentServiceApi";
import { useNotification } from "../../../../context/useNotification";
import { act } from "react";
import dayjs from "dayjs";
import { renderHook } from "@testing-library/react";
import { useBookingForm, type UseBookingFormProps } from "../../../../hooks/useBookingForm";
import { ERROR_MESSAGE } from "../../../../constants/messages/Message";
import { CustomerRankEnum, RoleEnum } from "../../../../models/enums";
import type { ResponseDto } from "../../../../models/AuthModel/authModel";
import type { CustomerViewDto } from "../../../../models/CustomerModels/CustomerViewDto";
import type { AccountViewModel } from "../../../../models/Accounts/accountViewModel";
import type { VehicleViewDto } from "../../../../models/VehicleModels/vehicleViewDto";
import type { VehicleCategoryWithScaleViewDto } from "../../../../models/VehicleModels/vehicleCategoryViewDto";
import type { ServiceCategoryViewModel } from "../../../../models/ServicesModel/ServiceCategoryViewModel";
import { handleError } from "../../../../utils/errorHandler";

vi.mock("../../../../services/customerServices.ts");
vi.mock("../../../../services/vehicleServicesApi.ts");
vi.mock("../../../../services/serviceServicesApi.ts");
vi.mock("../../../../services/accountService.ts");
vi.mock("../../../../services/appointmentServiceApi.ts");
vi.mock("../../../../context/useNotification.ts");
vi.mock("../../../../utils/errorHandler.ts");

const mockVehicles = [
  { id: 999, cateId: 999, licensePlate: "11A11111" },
  { id: 888, cateId: 888, licensePlate: "22A22222" },
];

const mockServiceCategory = {
  id: 111,
  name: "Category A",
  services: [
    { id: 222, name: "Service A" },
    { id: 333, name: "Service B" },
  ],
};

const mockAccountInfor: ResponseDto<AccountViewModel> = {
  statusCode: 200,
  data: {
    id: 999,
    role: RoleEnum.CUSTOMER,
    email: "test@example.com",
    first_Name: "Unit",
    last_Name: "Test01",
    phone: "0911111111",
  },
};

const mockDataCustomerResponse: ResponseDto<CustomerViewDto> = {
  statusCode: 200,
  data: { id: 123, address: "", rank: CustomerRankEnum.MEMBER },
};

const mockVehicleViewDto: ResponseDto<VehicleViewDto[]> = {
  statusCode: 200,
  data: [
    { id: 999, licensePlate: "11A11111", cateId: 999 },
    { id: 888, licensePlate: "22A22222", cateId: 888 },
  ],
};

const mockVehicleCategory: ResponseDto<VehicleCategoryWithScaleViewDto[]> = {
  statusCode: 200,
  data: [{ id: 999, name: "SUV", scaleX: 1, scaleY: 1, scaleZ: 1 }],
};

const mockServiceCategoryViewModel: ResponseDto<ServiceCategoryViewModel[]> = {
  statusCode: 200,
  data: [
    {
      name: "Category A",
      services: [
        { id: 222, name: "Service A" },
        { id: 333, name: "Service B" },
      ],
    },
    {
      name: "Category B",
      services: [
        { id: 444, name: "Service C" },
        { id: 555, name: "Service D" },
      ],
    },
  ],
};

const mockEmptyServiceCategory = { id: 222, name: "Category B", services: [] };

const mockedGetCustomerId = vi.mocked(customerServices.getCustomerId);
const mockedGetAccountInfo = vi.mocked(accountService.getAccountInformation);
const mockedGetVehicles = vi.mocked(vehicleServices.getVehicleByCustomerId);
const mockedGetCategories = vi.mocked(vehicleServices.getVehicleCategories);
const mockedGetServices = vi.mocked(serviceServices.getAllServices);
const mockedCreateVehicle = vi.mocked(vehicleServices.createVehicle);
const mockedCreateAppointment = vi.mocked(appointmentService.createAppointment);
const mockedHandleError = vi.mocked(handleError);
const mockedUseNotification = vi.mocked(useNotification);
const mockNotification = {
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  open: vi.fn(),
  destroy: vi.fn(),
};

const defaultProps: UseBookingFormProps = {
  show: true,
  setLoading: vi.fn(),
  handleClose: vi.fn(),
  accountId: 999,
  isAuthenticated: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetCustomerId.mockResolvedValue({ data: { id: 1 } } as any);
  mockedGetAccountInfo.mockResolvedValue({ data: {} } as any);
  mockedGetVehicles.mockResolvedValue({ data: [] } as any);
  mockedGetCategories.mockResolvedValue({ data: [] } as any);
  mockedGetServices.mockResolvedValue({ data: [] } as any);
  mockedUseNotification.mockReturnValue(mockNotification);
});

describe("useBookingForm Hook", () => {
  it("TC01: validateStep(0) (Add New) - should set errors if model or license plate is empty", async () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    // ACT
    let isValid;
    act(() => {
      isValid = result.current.validateStep(0);
    });
    // ASSERT
    expect(isValid).toBe(false);
    expect(result.current.errors.vehicleCategory).toBe("Please select a vehicle model.");
    expect(result.current.errors.licensePlate).toBe("License plate is required.");
  });

  it("TC02: validateStep(0) (Add New) - should set error for invalid license plate regex", async () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    // ACT
    act(() => {
      result.current.setVehicleCategory(1);
      result.current.setLicensePlate("INVALID-PLATE");
    });
    let isValid;
    act(() => {
      isValid = result.current.validateStep(0);
    });

    // ASSERT
    expect(isValid).toBe(false);
    expect(result.current.errors.licensePlate).toBe(ERROR_MESSAGE.LICENSE_PLATE_WRONG);
  });

  it("TC03: validateStep(1) (Services) - should set error if no services are selected", async () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    // ACT
    let isValid;
    act(() => {
      isValid = result.current.validateStep(1);
    });
    // ASSERT
    expect(isValid).toBe(false);
    expect(result.current.errors.services).toBe("Please select at least one service.");
  });

  it("TC04: validateStep(2) (Time) - should set errors if date or time is missing", async () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    // ACT
    let isValid;
    act(() => {
      isValid = result.current.validateStep(2);
    });
    // ASSERT
    expect(isValid).toBe(false);
    expect(result.current.errors.date).toBe("Please select a date.");
    expect(result.current.errors.time).toBe("Please select a time.");
  });

  it("TC05: handleSubmit - should show error if policy checkbox is not checked", async () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    expect(result.current.checkbox).toBe(false);
    act(() => {
      result.current.handleSelectDate(dayjs());
      result.current.handleSelectTime(dayjs());
    });
    // ACT
    await act(async () => {
      await result.current.handleSubmit();
    });

    // ASSERT
    expect(mockedCreateAppointment).not.toHaveBeenCalled();
  });

  it("TC06: handleSubmit - should call createAppointment if all steps are valid", async () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    mockedCreateVehicle.mockResolvedValue({ data: 99 } as any);
    mockedCreateAppointment.mockResolvedValue({ message: "Success" } as any);

    // ACT
    act(() => {
      // Step 1
      result.current.setIsAddNew(true);
      result.current.setVehicleCategory(1);
      result.current.setLicensePlate("51G-12345");
      // Step 2
      result.current.setSelectedServices([1, 2]);
      // Step 3
      result.current.setDateSelected(dayjs());
      result.current.setTimeSelected(dayjs());
      result.current.setCheckBox(true);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    // ASSERT
    expect(mockNotification.error).not.toHaveBeenCalled();
    expect(mockedCreateVehicle).toHaveBeenCalledTimes(1);
    expect(mockedCreateAppointment).toHaveBeenCalledTimes(1);
    expect(mockNotification.success).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Success",
      })
    );
    expect(defaultProps.handleClose).toHaveBeenCalledTimes(1);
  });

  //   it("TC07: validateStep(0) - should FAIL because category N/A is not validated", async () => {
  //     // ARRANGE
  //     const { result } = renderHook(() => useBookingForm(defaultProps));
  //     // ACT
  //     act(() => {
  //       result.current.setIsAddNew(false); // select exist vehicle
  //       result.current.setVehicleCategory(0); // Category does not exist
  //     });
  //     let isValid;
  //     act(() => {
  //       isValid = result.current.validateStep(0);
  //     });
  //     // ASSERT
  //     expect(isValid).toBe(false);
  //     expect(result.current.errors.vehicleCategory).toBe("Selected vehicle category is invalid.");
  //   });

  it("TC07: useEffect [show, accountId] - should fetch data and update state when component is shown", async () => {
    // ARRANGE
    mockedGetCustomerId.mockResolvedValue(mockDataCustomerResponse);
    mockedGetAccountInfo.mockResolvedValue(mockAccountInfor);
    mockedGetVehicles.mockResolvedValue(mockVehicleViewDto);
    mockedGetCategories.mockResolvedValue(mockVehicleCategory);
    mockedGetServices.mockResolvedValue(mockServiceCategoryViewModel);
    // ACT
    const { result } = renderHook(() => useBookingForm(defaultProps));
    await act(async () => {
      await Promise.resolve();
    });

    // ASSERT
    expect(defaultProps.setLoading).toHaveBeenCalledWith(true);
    expect(mockedGetCustomerId).toHaveBeenCalledWith(defaultProps.accountId);
    expect(mockedGetVehicles).toHaveBeenCalledWith(123);
    expect(result.current.accountInfor?.first_Name).toBe("Unit");
    expect(result.current.listVehicleOfCustomer).toEqual(mockVehicles);
    expect(result.current.listCategories.length).toBe(1);
    expect(result.current.serviceCategories.length).toBe(2);
    expect(defaultProps.setLoading).toHaveBeenCalledWith(false);
  });

  it("TC08: handleSelectVehicle - should update state when selecting an existing vehicle", async () => {
    // ARRANGE
    mockedGetVehicles.mockResolvedValue(mockVehicleViewDto);
    const { result } = renderHook(() => useBookingForm(defaultProps));
    await act(async () => {});

    // ACT
    act(() => {
      result.current.handleSelectVehicle({ target: { value: "999" } } as any);
    });

    // ASSERT
    expect(result.current.isAddNew).toBe(false);
    expect(result.current.selectedValue).toBe(999);
    expect(result.current.vehicleCategory).toBe(999);
    expect(result.current.licensePlate).toBe("11A11111");
  });

  it("TC09: handleSelectVehicle - should reset to 'Add New' when selecting value 0", async () => {
    // ARRANGE
    mockedGetVehicles.mockResolvedValue(mockVehicleViewDto);
    const { result } = renderHook(() => useBookingForm(defaultProps));
    await act(async () => {});
    act(() => {
      result.current.handleSelectVehicle({ target: { value: "999" } } as any);
    });
    expect(result.current.isAddNew).toBe(false);
    act(() => {
      result.current.handleSelectVehicle({ target: { value: "0" } } as any);
    });
    // ASSERT
    expect(result.current.isAddNew).toBe(true);
    expect(result.current.selectedValue).toBe(0);
  });

  it("TC10: handleSelectServices - should add a service if not exist", () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    expect(result.current.selectedServices).toEqual([]);
    // ACT
    act(() => {
      result.current.handleSelectServices(333);
    });
    // ASSERT
    expect(result.current.selectedServices).toEqual([333]);
  });

  it("TC11: handleSelectServices - should remove a service if exist", () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    act(() => {
      result.current.handleSelectServices(222);
    });
    expect(result.current.selectedServices).toEqual([222]);
    act(() => {
      result.current.handleSelectServices(222);
    });
    // ASSERT
    expect(result.current.selectedServices).toEqual([]);
  });

  it("TC12: handleServiceCategoriesChange - should add all services from a category", () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    expect(result.current.selectedServices).toEqual([]);
    // ACT
    act(() => {
      result.current.handleServiceCategoriesChange(mockServiceCategory);
    });
    // ASSERT
    expect(result.current.selectedServices).toEqual([222, 333]);
  });

  it("TC13: handleServiceCategoriesChange - should remove all services from a category if all are already selected", () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    act(() => {
      result.current.setSelectedServices([222, 333]);
    });
    expect(result.current.selectedServices).toEqual([222, 333]);
    // ACT
    act(() => {
      result.current.handleServiceCategoriesChange(mockServiceCategory);
    });

    // ASSERT
    expect(result.current.selectedServices).toEqual([]);
  });

  it("TC14: handleServiceCategoriesChange - should do nothing if category has no services", () => {
    // ARRANGE
    const { result } = renderHook(() => useBookingForm(defaultProps));
    expect(result.current.selectedServices).toEqual([]);
    act(() => {
      result.current.handleServiceCategoriesChange(mockEmptyServiceCategory);
    });
    expect(result.current.selectedServices).toEqual([]);
  });

  it("TC15: handleSubmit - should handle API error and show notification", async () => {
    // ARRANGE
    const error = new Error("Submit failed");
    mockedCreateAppointment.mockRejectedValue(error);
    const { result } = renderHook(() => useBookingForm(defaultProps));
    act(() => {
      result.current.setDateSelected(dayjs());
      result.current.setTimeSelected(dayjs());
      result.current.setCheckBox(true);
    });
    // ACT
    await act(async () => {
      await result.current.handleSubmit();
    });
    // ASSERT
    expect(mockedHandleError).toHaveBeenCalledWith(error);
    expect(mockNotification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Submit failed",
      })
    );
    expect(result.current.isLoading).toBe(false);
  });

  it("TC16: useEffect (Initial Fetch) - should handle fetch errors and stop loading", async () => {
    // ARRANGE
    const fetchError = new Error("Failed to fetch data");
    mockedGetCustomerId.mockResolvedValue({
      statusCode: 400,
      data: { id: 0, address: "", rank: CustomerRankEnum.MEMBER },
    });
    mockedGetVehicles.mockRejectedValue(fetchError);
    // ACT
    const { result } = renderHook(() => useBookingForm(defaultProps));
    await act(async () => {
      await Promise.resolve();
    });

    // ASSERT
    expect(mockedHandleError).toHaveBeenCalledWith(fetchError);
    expect(defaultProps.setLoading).toHaveBeenCalledWith(false);
    expect(result.current.listVehicleOfCustomer).toEqual([]);
  });

  it("TC17: useEffect [show] - should call resetForm and reset state when show changes to false", () => {
    // ARRANGE
    const { result, rerender } = renderHook((props) => useBookingForm(props), {
      initialProps: { ...defaultProps, show: true },
    });
    act(() => {
      result.current.setNote("Test Note");
      result.current.setCheckBox(true);
    });
    // ACT
    rerender({ ...defaultProps, show: false });
    // ASSERT
    expect(result.current.note).toBe("");
    expect(result.current.checkbox).toBe(false);
  });
});
