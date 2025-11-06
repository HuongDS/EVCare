import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { VehicleCategoryViewDto } from "../../../../models/VehicleModels/vehicleCategoryViewDto";
import AddNewVehicleFields from "../AddNewVehicleFields";

const mockListCategories: VehicleCategoryViewDto[] = [
  { id: 999, name: "Sedan" },
  { id: 888, name: "SUV" },
];

const mockProps = {
  listCategories: mockListCategories,
  handleSelectVehicleCategory: vi.fn(),
  vehicleCategory: 0,
  setLicensePlate: vi.fn(),
  licensePlate: "",
  errors: {},
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AddNewVehicleFields", () => {
  it("TC01: whether it display error when provided", () => {
    // ARRANGE
    const errors = {
      vehicleCategory: "Model is required",
      licensePlate: "License plate is required",
    };
    render(<AddNewVehicleFields {...mockProps} errors={errors} />);

    // ASSERT
    expect(screen.getByText("Model is required")).toBeInTheDocument();
    expect(screen.getByText("License plate is required")).toBeInTheDocument();
  });

  it("TC02: should call setLicensePlate when user types", () => {
    // ARRANGE
    render(<AddNewVehicleFields {...mockProps} />);
    const licenseInput = screen.getByPlaceholderText("Ex: 50G99999");

    // ACT
    fireEvent.change(licenseInput, { target: { value: "NEW-PLATE" } });

    // ASSERT
    expect(mockProps.setLicensePlate).toHaveBeenCalledWith("NEW-PLATE");
  });

  it("TC03: should render correct when listCategories is empty", () => {
    // ARRANGE
    render(<AddNewVehicleFields {...mockProps} listCategories={[]} />);

    // ACT
    // ASSERT
    expect(screen.queryByText("Sedan")).not.toBeInTheDocument();
    expect(screen.getByText("Select Vehicle Model")).toBeInTheDocument();
  });

  it("TC04: should render correctly when errors prop is undefined", () => {
    // ARRANGE
    render(<AddNewVehicleFields {...mockProps} errors={undefined} />);

    // ASSERT
    expect(screen.queryByText("Model is required")).not.toBeInTheDocument();
    expect(screen.queryByText("License plate is required")).not.toBeInTheDocument();
  });
});
