import { useState } from "react";
import VehiclesGrid from "./VehicleGrid";
import AddVehicleModal from "./AddVehicleModal";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";

interface Props {
  vehicles: VehicleViewDto[];
  onAdd: (v: Omit<VehicleViewDto, "id">) => void;
  onDelete: (id: number) => void;
}

export default function VehiclesSection({ vehicles, onAdd, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">My Vehicles</h2>
        <button className="add-vehicle-btn" onClick={() => setOpen(true)}>
          + Add Vehicle
        </button>
      </div>

      <VehiclesGrid vehicles={vehicles} onDelete={onDelete} />

      <AddVehicleModal
        open={open}
        onClose={() => setOpen(false)}
        onAdd={(payload) => {
          onAdd(payload);
          setOpen(false);
        }}
      />
    </>
  );
}
