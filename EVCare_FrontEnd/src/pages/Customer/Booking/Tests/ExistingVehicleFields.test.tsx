import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { VehicleCategoryViewDto } from "../../../../models/VehicleModels/vehicleCategoryViewDto";
import ExistingVehicleFields from "../ExistingVehicleFields";
// import ExistingVehicleFields from "../ExistingVehicleFields";

const mockCategories: VehicleCategoryViewDto[] = [
  { id: 999, name: "Sedan" },
  { id: 888, name: "SUV" },
  { id: 777, name: "" },
];

describe("ExistingVehicleFields", () => {
  it("TC01: should render the disabled model input with the correct name", () => {
    // ARRANGE
    render(
      <ExistingVehicleFields vehicleCategoryName="Test01" listCategories={mockCategories} vehicleCategory={999} />
    );

    // ACT
    const modelInput = screen.getByDisplayValue("Sedan");

    // ASSERT
    expect(modelInput).toBeInTheDocument();
    expect(modelInput).toBeDisabled();
  });

  it("TC02: should display fallback name if categoryIs = 0", () => {
    // ARRANGE
    render(
      <ExistingVehicleFields vehicleCategoryName="Test01" listCategories={mockCategories} vehicleCategory={111} />
    );

    // ACT
    const modelInput = screen.getByDisplayValue("Test01");

    // ASSERT
    expect(modelInput).toBeInTheDocument();
    expect(modelInput).toBeDisabled();
  });

  it("TC03: should display empty string if categoryIs = 0 and vehicleCategoryName is undefined", () => {
    // ARRANGE
    render(
      <ExistingVehicleFields vehicleCategoryName={undefined} listCategories={mockCategories} vehicleCategory={111} />
    );

    // ACT
    const input = screen.getByLabelText(/Vehicle Model/i);

    // ASSERT
    expect(input).toHaveValue("");
  });
});
