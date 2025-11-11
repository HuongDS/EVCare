import { beforeEach, describe, expect, it, vi } from "vitest";
import type { VehicleCategoryViewDto } from "../../../../models/VehicleModels/vehicleCategoryViewDto";
import type { VehicleViewDto } from "../../../../models/VehicleModels/vehicleViewDto";
import { render, screen } from "@testing-library/react";
import SelectVehicleSection from "../SelectVehicleSection";
import userEvent from "@testing-library/user-event";

const mockListVehicle: VehicleViewDto[] = [
  { id: 999, licensePlate: "11A11111", cateId: 999 },
  { id: 888, licensePlate: "22A22222", cateId: 888 },
];

const mockListCategories: VehicleCategoryViewDto[] = [
  { id: 999, name: "Sedan" },
  { id: 888, name: "SUV" },
];

const mockProps = {
  isAddNew: true,
  selectedValue: 0,
  handleSelectVehicle: vi.fn(),
  listVehicleOfCustomer: mockListVehicle,
  listCategories: mockListCategories,
  handleSelectVehicleCategory: vi.fn(),
  vehicleCategory: 999,
  setLicensePlate: vi.fn(),
  licensePlate: "",
  errors: {},
};

vi.mock("../AddNewVehicleFields.tsx", () => ({
  default: () => {
    return <div>DUMMY_ADD_NEW_FIELDS</div>;
  },
}));

vi.mock("../ExistingVehicleFields.tsx", () => ({
  default: () => {
    return <div>DUMMY_EXISTING_FIELDS</div>;
  },
}));

vi.mock("../BookingForm.styled", () => ({
  SubTitle: (props: any) => <h5 {...props} />,
  FormGroup: (props: any) => <div {...props} />,
  Label: (props: any) => <label {...props} />,
  Required: (props: any) => <span {...props}>*</span>,
  Select: (props: any) => <select {...props} />,
  Input: (props: any) => <input {...props} />,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SelectVehicleSection", () => {
  it("TC01: should render the main dropdown", () => {
    render(<SelectVehicleSection {...mockProps} />);
    expect(screen.getByRole("combobox", { name: /Your Vehicle License Plate/i })).toBeInTheDocument();
  });

  it("TC02: should render AddNewVehicleFields when isAddNew is true", () => {
    // ARRANGE
    render(<SelectVehicleSection {...mockProps} isAddNew={true} />);
    // ACT
    // ASSERT
    expect(screen.getByText("DUMMY_ADD_NEW_FIELDS")).toBeInTheDocument();
    expect(screen.queryByText("DUMMY_EXISTING_FIELDS")).not.toBeInTheDocument();
  });

  it("TC03: should render ExistingVehicleFields when isAddNew is false", () => {
    // ARRANGE
    render(<SelectVehicleSection {...mockProps} isAddNew={false} />);
    // ACT
    // ASSERT
    expect(screen.getByText("DUMMY_EXISTING_FIELDS")).toBeInTheDocument();
    expect(screen.queryByText("DUMMY_ADD_NEW_FIELDS")).not.toBeInTheDocument();
  });

  it("TC04: should call handleSelectVehicle when user selects a vehicle", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<SelectVehicleSection {...mockProps} />);
    const mainDropdown = screen.getByRole("combobox", {
      name: /Your Vehicle License Plate/i,
    });

    // ACT
    await user.selectOptions(mainDropdown, "11A11111");

    // ASSERT
    expect(mockProps.handleSelectVehicle).toHaveBeenCalledTimes(1);
  });

  it("TC05: should display error message for vehicleSelect", () => {
    // ARRANGE
    const errors = {
      vehicleSelect: "Please select a vehicle",
    };
    render(<SelectVehicleSection {...mockProps} errors={errors} />);

    // ASSERT
    expect(screen.getByText("Please select a vehicle")).toBeInTheDocument();
  });

  it("TC06: should render dropdown correctly when listVehicle is empty", () => {
    // ARRANGE
    render(<SelectVehicleSection {...mockProps} listVehicleOfCustomer={[]} />);

    // ASSERT
    expect(screen.queryByText("11A-11111")).not.toBeInTheDocument();

    expect(screen.getByRole("option", { name: "Add Vehicle" })).toBeInTheDocument();
  });

  it("TC07: should set dropdown value to 0 when isAddNew is true", () => {
    // ARRANGE
    render(<SelectVehicleSection {...mockProps} isAddNew={true} selectedValue={999} />);
    const mainDropdown = screen.getByRole("combobox", {
      name: /Your Vehicle License Plate/i,
    });
    // ACT
    // ASSERT
    expect(mainDropdown).toHaveValue("0");
  });

  it("TC08: should set dropdown value to selectedValue when isAddNew is false", () => {
    // ARRANGE
    render(<SelectVehicleSection {...mockProps} isAddNew={false} selectedValue={999} />);
    const mainDropdown = screen.getByRole("combobox", {
      name: /Your Vehicle License Plate/i,
    });
    // ACT
    // ASSERT
    expect(mainDropdown).toHaveValue("999");
  });

  it("TC09: should not display error message when errors prop is undefined", () => {
    // ARRANGE
    render(<SelectVehicleSection {...mockProps} errors={undefined} />);
    // ACT
    // ASSERT
    expect(screen.queryByText(/Please select a vehicle/i)).not.toBeInTheDocument();
  });
});
