import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";

export default function VehicleCard({
  vehicle,
  onDelete,
}: {
  vehicle: VehicleViewDto;
  onDelete: (id: number) => void;
}) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      onDelete(vehicle.id);
    }
  };

  return (
    <div className="vehicle-card">
      <img src={vehicle.image} alt={vehicle.categoryName} className="vehicle-image" />
      <div className="vehicle-info">
        <div className="vehicle-model">{vehicle.categoryName}</div>
        <div className="vehicle-plate">{vehicle.licensePlate}</div>
      </div>
      <button className="delete-vehicle-btn" onClick={handleDelete}>
        Delete Vehicle
      </button>
    </div>
  );
}
