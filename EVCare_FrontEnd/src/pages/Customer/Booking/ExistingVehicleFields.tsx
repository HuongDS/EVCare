import { useMemo } from "react";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";
import { FormGroup, Input, Label, Required } from "./BookingForm.styled";

interface ExistingProps {
  listCategories: VehicleCategoryViewDto[];
  vehicleCategory: number;
  vehicleCategoryName: string | undefined;
}

function ExistingVehicleFields({ listCategories, vehicleCategory, vehicleCategoryName }: ExistingProps) {
  const categoryName = useMemo(() => {
    return listCategories.find((c) => c.id === vehicleCategory)?.name ?? vehicleCategoryName;
  }, [listCategories, vehicleCategory]);

  return (
    <FormGroup>
      <Label htmlFor="vehicle-model-disabled">
        Vehicle Model <Required>*</Required>
      </Label>
      <Input id="vehicle-model-disabled" type="text" disabled value={categoryName} />
    </FormGroup>
  );
}

export default ExistingVehicleFields;
