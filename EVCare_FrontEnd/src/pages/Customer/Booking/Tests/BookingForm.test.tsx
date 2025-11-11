import { beforeEach, describe, it, vi } from "vitest";
import { useBookingForm } from "../../../../hooks/useBookingForm";
import { fireEvent, screen } from "@testing-library/react";
import BookingForm from "../BookingForm";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../../utils/test-utils";

vi.mock("../../../../hooks/useBookingForm.ts");
vi.mock("../../../../components/SpinnerComponent.tsx", () => ({
  default: () => <div data-testid="spinner" />,
}));
vi.mock("../../../../components/UploadFields/uploadImage.tsx", () => ({
  default: ({
    handleFileRemove,
    handleFileSubmit,
  }: {
    handleFileRemove: (url: string) => void;
    handleFileSubmit: (file: { url: string; name: string }) => void;
  }) => (
    <div data-testid="mock-upload">
      <button onClick={() => handleFileSubmit({ url: "new-file.jpg", name: "new-file.jpg" })}>Upload</button>
      <button onClick={() => handleFileRemove("existing-file.jpg")}>Remove</button>
    </div>
  ),
}));
vi.mock("../AppointmentPolicySection.tsx", () => ({
  default: ({ handleSetVisible }: { handleSetVisible: () => void }) => (
    <div data-testid="mock-policy" onClick={handleSetVisible}>
      Mock Policy
    </div>
  ),
}));
vi.mock("../NameAndPhoneNumberSection.tsx", () => ({
  default: () => <div data-testid="mock-name-phone" />,
}));
vi.mock("../SelectVehicleSection.tsx", () => ({
  default: ({ handleSelectVehicleCategory }: { handleSelectVehicleCategory: (e: any) => void }) => (
    <div data-testid="mock-vehicle">
      <select data-testid="mock-category-select" onChange={handleSelectVehicleCategory}>
        <option value="0">Select</option>
        <option value="1">Category 1</option>
      </select>
    </div>
  ),
}));
vi.mock("../ServiceSection.tsx", () => ({
  default: () => <div data-testid="mock-service" />,
}));
vi.mock("../TimeSection.tsx", () => ({
  default: () => <div data-testid="mock-time" />,
}));
vi.mock("../../../../components/StepperComponent.tsx", () => ({
  default: ({ children, currentStep }: { children: React.ReactNode[]; currentStep: number }) => (
    <div data-testid="mock-stepper">{children[currentStep]}</div>
  ),
  Step: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockedUseBookingForm = vi.mocked(useBookingForm);
const mockHookReturn = {
  accountInfor: undefined,
  listVehicleOfCustomer: [],
  listCategories: [],
  serviceCategories: [],
  selectedValue: 0,
  isAddNew: true,
  vehicleCategory: 0,
  licensePlate: "",
  files: [],
  selectedServices: [],
  dateSelected: undefined,
  timeSelected: undefined,
  note: "",
  isLoading: false,
  checkbox: false,
  visible: false,
  currentStep: 0,
  errors: {},
  setVehicleCategory: vi.fn(),
  setLicensePlate: vi.fn(),
  setFiles: vi.fn(),
  setNote: vi.fn(),
  setCheckBox: vi.fn(),
  setVisible: vi.fn(),
  setCurrentStep: vi.fn(),
  setIsAddNew: vi.fn(),
  setSelectedServices: vi.fn(),
  setDateSelected: vi.fn(),
  setTimeSelected: vi.fn(),
  handleSelectVehicle: vi.fn(),
  handleSelectServices: vi.fn(),
  handleServiceCategoriesChange: vi.fn(),
  handleSelectDate: vi.fn(),
  handleSelectTime: vi.fn(),
  validateStep: vi.fn(() => true),
  handleSubmit: vi.fn(),
};

const defaultProps = {
  show: true,
  handleClose: vi.fn(),
  setLoading: vi.fn(),
  loading: false,
};

const defaultPreloadedState = {
  auth: {
    isAuthenticated: true,
    user: null,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockedUseBookingForm.mockReturnValue(mockHookReturn);
});

describe("BookingForm", () => {
  it("TC01: (Step 1) should render Name/Phone and Vehicle sections when currentStep is 0", () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({ ...mockHookReturn, currentStep: 0 });
    // ACT
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ASSERT
    expect(screen.getByTestId("mock-name-phone")).toBeInTheDocument();
    expect(screen.getByTestId("mock-vehicle")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-service")).not.toBeInTheDocument();
  });

  it("TC02: (Step 2) should render Service section when currentStep is 1", () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({ ...mockHookReturn, currentStep: 1 });
    // ACT
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ASSERT
    expect(screen.getByTestId("mock-service")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-name-phone")).not.toBeInTheDocument();
  });

  it("TC03: (Step 3) should DISABLE the SEND button if checkbox is false", () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({
      ...mockHookReturn,
      currentStep: 2,
      checkbox: false,
      isLoading: false,
    });
    // ACT
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ASSERT
    const sendButton = screen.getByRole("button", { name: /SEND/i });
    expect(sendButton).toBeDisabled();
  });

  it("TC04: (Step 3) should ENABLE the SEND button if checkbox is true", () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({
      ...mockHookReturn,
      currentStep: 2,
      checkbox: true,
      isLoading: false,
    });
    // ACT
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ASSERT
    const sendButton = screen.getByRole("button", { name: /SEND/i });
    expect(sendButton).not.toBeDisabled();
  });

  //   it("TC05: (Step 3) should show Spinner (and hide button) if isLoading is true", () => {
  //     // ARRANGE
  //     mockedUseBookingForm.mockReturnValue({
  //       ...mockHookReturn,
  //       currentStep: 2,
  //       isLoading: true,
  //     });
  //     // ACT
  //     render(<BookingForm {...defaultProps} />);
  //     // ASSERT
  //     expect(screen.getByTestId("mock-spinner")).toBeInTheDocument();
  //     expect(screen.queryByRole("button", { name: /SEND/i })).not.toBeInTheDocument();
  //   });

  it("TC06: should call handleClose when CloseButton is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ACT
    // "x" button is a <CloseButton> (styled-component), not a <button> => use getByText
    await user.click(screen.getByText("x"));

    // ASSERT
    expect(defaultProps.handleClose).toHaveBeenCalledOnce();
  });

  it("TC07: (Branch) should render nothing if 'show' prop is false", () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({ ...mockHookReturn, currentStep: 0 });
    // ACT
    const { container } = renderWithProviders(<BookingForm {...defaultProps} show={false} />, {
      preloadedState: defaultPreloadedState,
    });
    // ASSERT
    expect(container.firstChild).toBeNull();
  });

  it("TC08: (Branch) should display error message for services", () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({
      ...mockHookReturn,
      currentStep: 1,
      errors: { services: "Error services" },
    });
    // ACT
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });

    // ASSERT
    expect(screen.getByText("Error services")).toBeInTheDocument();
  });

  it("TC09: (Function) should call 'setNote' from hook when user types in TextArea", async () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({ ...mockHookReturn, currentStep: 2 });
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ACT
    const noteTextArea = screen.getByPlaceholderText("Enter any additional notes...");
    fireEvent.change(noteTextArea, { target: { value: "Test Note" } });
    // ASSERT
    expect(mockHookReturn.setNote).toHaveBeenCalledWith("Test Note");
  });

  it("TC10: (Function) should call 'handleSubmit' from hook when SEND button is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockedUseBookingForm.mockReturnValue({
      ...mockHookReturn,
      currentStep: 2,
      checkbox: true,
      isLoading: false,
    });
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ACT
    const sendButton = screen.getByRole("button", { name: /SEND/i });
    await user.click(sendButton);
    // ASSERT
    expect(mockHookReturn.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("TC11: (Step 3) should show Spinner (and hide button) if isLoading is true", () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({
      ...mockHookReturn,
      currentStep: 2,
      isLoading: true,
    });
    // ACT
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ASSERT
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /SEND/i })).not.toBeInTheDocument();
  });

  it("TC12: (Step 1) should call setFiles when handleFileSubmit is triggered from UploadImage", async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockedUseBookingForm.mockReturnValue({ ...mockHookReturn, currentStep: 0 });
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ACT
    await user.click(screen.getByRole("button", { name: "Upload" }));
    // ASSERT
    expect(mockHookReturn.setFiles).toHaveBeenCalledWith(expect.any(Function));
    const updaterFunction = mockHookReturn.setFiles.mock.calls[0][0];
    const prevState = [{ url: "old.jpg", name: "old.jpg" }];
    const newState = updaterFunction(prevState);
    expect(newState).toHaveLength(2);
    expect(newState[1].url).toBe("new-file.jpg");
  });

  it("TC13: (Step 1) should call setFiles when handleFileRemove is triggered from UploadImage", async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockedUseBookingForm.mockReturnValue({ ...mockHookReturn, currentStep: 0 });
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ACT
    await user.click(screen.getByRole("button", { name: "Remove" }));
    // ASSERT
    expect(mockHookReturn.setFiles).toHaveBeenCalledWith(expect.any(Function));
    const updaterFunction = mockHookReturn.setFiles.mock.calls[0][0];
    const prevState = [
      { url: "kept.jpg", name: "kept.jpg" },
      { url: "existing-file.jpg", name: "removed.jpg" },
    ];
    const newState = updaterFunction(prevState);
    // Expected
    expect(newState).toHaveLength(1);
    expect(newState[0].url).toBe("kept.jpg");
  });

  it("TC14: (Step 3) should call setVisible and setCheckBox(false) when policy is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockedUseBookingForm.mockReturnValue({ ...mockHookReturn, currentStep: 2 });
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ACT
    await user.click(screen.getByTestId("mock-policy"));
    // ASSERT
    expect(mockHookReturn.setVisible).toHaveBeenCalledWith(expect.any(Function));
    expect(mockHookReturn.setCheckBox).toHaveBeenCalledWith(false);
  });

  it("TC15: (Step 3) should call setCheckBox when policy checkbox is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    mockedUseBookingForm.mockReturnValue({
      ...mockHookReturn,
      currentStep: 2,
      visible: false,
    });
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ACT
    await user.click(screen.getByRole("checkbox"));
    // ASSERT
    expect(mockHookReturn.setCheckBox).toHaveBeenCalledWith(expect.any(Function));
  });

  it("TC16: (Step 1) should call setVehicleCategory when category is changed", () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({ ...mockHookReturn, currentStep: 0 });
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ACT
    fireEvent.change(screen.getByTestId("mock-category-select"), { target: { value: "1" } });
    // ASSERT
    expect(mockHookReturn.setVehicleCategory).toHaveBeenCalledWith(1);
  });

  it("TC17: (Branch) should render nothing if 'loading' prop is true", () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({ ...mockHookReturn, currentStep: 0 });
    // ACT
    const { container } = renderWithProviders(<BookingForm {...defaultProps} loading={true} />, {
      preloadedState: defaultPreloadedState,
    });
    // ASSERT
    expect(container.firstChild).toBeNull();
  });

  it("TC18: (Step 3) should HIDE policy checkbox if policy modal is visible", () => {
    // ARRANGE
    mockedUseBookingForm.mockReturnValue({
      ...mockHookReturn,
      currentStep: 2,
      visible: true,
    });
    // ACT
    renderWithProviders(<BookingForm {...defaultProps} />, { preloadedState: defaultPreloadedState });
    // ASSERT
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
