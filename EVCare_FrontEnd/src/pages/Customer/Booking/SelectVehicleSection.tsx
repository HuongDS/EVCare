import React from "react";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import {
  FormGroup,
  Input,
  Label,
  Required,
  Select,
  SubTitle,
} from "./BookingForm.styled";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";

interface Props {
  isAddNew: boolean;
  selectedValue: number;
  handleSelectVehicle: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  listVehicleOfCustomer: VehicleViewDto[];
  listCategories: VehicleCategoryViewDto[];
  handleSelectVehicleCategory: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
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
        <Label>
          Your Vehicle License Plate <Required>*</Required>
        </Label>
        <Select
          value={isAddNew ? 0 : selectedValue}
          onChange={handleSelectVehicle}
        >
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
          <p style={{ color: "red", marginTop: "2px", marginBottom: 0 }}>
            {errors.vehicleSelect}
          </p>
        )}
      </FormGroup>
      <FormGroup>
        <Label>
          Vehicle Model <Required>*</Required>
        </Label>
        {isAddNew ? (
          <Select
            value={vehicleCategory}
            onChange={handleSelectVehicleCategory}
          >
            <option value={0} disabled>
              Select Vehicle Model
            </option>
            {listCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            type="text"
            disabled
            value={listCategories.find((c) => c.id === vehicleCategory)?.name}
          />
        )}
        {isAddNew && errors?.vehicleCategory && (
          <p style={{ color: "red", marginTop: "2px", marginBottom: 0 }}>
            {errors.vehicleCategory}
          </p>
        )}
      </FormGroup>
      {isAddNew && (
        <FormGroup>
          <Label>
            Vehicle License Plate <Required>*</Required>
          </Label>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLicensePlate(e.target.value)
            }
            type="text"
            placeholder="Ex: 50G99999"
            value={licensePlate}
            required={true}
          />
          {errors?.licensePlate && (
            <p style={{ color: "red", marginTop: "2px", marginBottom: 0 }}>
              {errors.licensePlate}
            </p>
          )}
        </FormGroup>
      )}
    </>
  );
}

const SelectVehicleSection = React.memo(SelectVehicleComponent);
export default SelectVehicleSection;
