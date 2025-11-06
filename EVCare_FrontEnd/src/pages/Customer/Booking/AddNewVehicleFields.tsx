import React from "react";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";
import { FormGroup, Input, Label, Required, Select } from "./BookingForm.styled";

interface AddNewProps {
  listCategories: VehicleCategoryViewDto[];
  handleSelectVehicleCategory: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  vehicleCategory: number;
  setLicensePlate: (l: string) => void;
  licensePlate: string;
  errors?: { [key: string]: string };
}

function AddNewVehicleFields({
  listCategories,
  handleSelectVehicleCategory,
  vehicleCategory,
  setLicensePlate,
  licensePlate,
  errors,
}: AddNewProps) {
  return (
    <>
      <FormGroup>
        <Label htmlFor="vehicle-category-select">
          Vehicle Model <Required>*</Required>
        </Label>
        <Select id="vehicle-category-select" value={vehicleCategory} onChange={handleSelectVehicleCategory}>
          <option value={0} disabled>
            Select Vehicle Model
          </option>
          {listCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        {errors?.vehicleCategory && (
          <p style={{ color: "red", marginTop: "2px", marginBottom: 0 }}>{errors.vehicleCategory}</p>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="license-plate-input">
          Enter New License Plate <Required>*</Required>
        </Label>
        <Input
          id="license-plate-input"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLicensePlate(e.target.value)}
          type="text"
          placeholder="Ex: 50G99999"
          value={licensePlate}
          required={true}
        />
        {errors?.licensePlate && (
          <p style={{ color: "red", marginTop: "2px", marginBottom: 0 }}>{errors.licensePlate}</p>
        )}
      </FormGroup>
    </>
  );
}

export default AddNewVehicleFields;
