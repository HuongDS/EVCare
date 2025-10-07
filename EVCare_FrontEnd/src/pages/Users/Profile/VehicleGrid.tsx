import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import VehicleCard from "./VehicleCard";

export default function VehiclesGrid({
  vehicles,
  onDelete,
}: {
  vehicles: VehicleViewDto[];
  onDelete: (id: number) => void;
}) {
  return (
    <div className="vehicles-grid" id="vehiclesGrid">
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} onDelete={onDelete} />
      ))}
    </div>
  );
}
