import React from "react";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import { FormGroup, Label, Required, Select, SubTitle } from "./BookingForm.styled";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";
import AddNewVehicleFields from "./AddNewVehicleFields";
import ExistingVehicleFields from "./ExistingVehicleFields";

interface Props {
  isAddNew: boolean;
  selectedValue: number;
  handleSelectVehicle: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  listVehicleOfCustomer: VehicleViewDto[];
  listCategories: VehicleCategoryViewDto[];
  handleSelectVehicleCategory: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  vehicleCategory: number;
  setLicensePlate: (l: string) => void;
  licensePlate: string;
  errors?: { [key: string]: string };
}

function SelectVehicleComponent({
  isAddNew,
  selectedValue,
  handleSelectVehicle,
  listVehicleOfCustomer,
  listCategories,
  handleSelectVehicleCategory,
  vehicleCategory,
  setLicensePlate,
  licensePlate,
  errors,
}: Props) {
  return (
    <>
      <SubTitle
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Vehicle
      </SubTitle>
      <FormGroup>
        <Label htmlFor="vehicle-select">
          Your Vehicle License Plate <Required>*</Required>
        </Label>
        <Select id="vehicle-select" value={isAddNew ? 0 : selectedValue} onChange={handleSelectVehicle}>
          {listVehicleOfCustomer.map((v) => (
            <option key={v.id} value={v.id}>
              {v.licensePlate}
            </option>
          ))}
          <option defaultChecked={true} value={0}>
            Add Vehicle
          </option>
        </Select>
        {errors?.vehicleSelect && (
          <p style={{ color: "red", marginTop: "2px", marginBottom: 0 }}>{errors.vehicleSelect}</p>
        )}
      </FormGroup>

      {isAddNew ? (
        <AddNewVehicleFields
          listCategories={listCategories}
          handleSelectVehicleCategory={handleSelectVehicleCategory}
          vehicleCategory={vehicleCategory}
          setLicensePlate={setLicensePlate}
          licensePlate={licensePlate}
          errors={errors}
        />
      ) : (
        <ExistingVehicleFields listCategories={listCategories} vehicleCategory={vehicleCategory} />
      )}
    </>
  );
}

const SelectVehicleSection = React.memo(SelectVehicleComponent);
export default SelectVehicleSection;
