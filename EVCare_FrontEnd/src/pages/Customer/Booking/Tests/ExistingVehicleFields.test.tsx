import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { VehicleCategoryViewDto } from "../../../../models/VehicleModels/vehicleCategoryViewDto";
import ExistingVehicleFields from "../ExistingVehicleFields";
// import ExistingVehicleFields from "../ExistingVehicleFields";

const mockCategories: VehicleCategoryViewDto[] = [
  { id: 999, name: "Sedan" },
  { id: 888, name: "SUV" },
];

describe("ExistingVehicleFields", () => {
  it("TC01: should render the disabled model input with the correct name", () => {
    // ARRANGE
    render(<ExistingVehicleFields listCategories={mockCategories} vehicleCategory={999} />);

    // ACT
    const modelInput = screen.getByDisplayValue("Sedan");

    // ASSERT
    expect(modelInput).toBeInTheDocument();
    expect(modelInput).toBeDisabled();
  });

  it("TC02: should display 'N/A' if category is not found", () => {
    // ARRANGE
    render(<ExistingVehicleFields listCategories={mockCategories} vehicleCategory={111} />);

    // ACT
    const modelInput = screen.getByDisplayValue("N/A");

    // ASSERT
    expect(modelInput).toBeInTheDocument();
    expect(modelInput).toBeDisabled();
  });
});
