import { MSG_TITLE, SUCCESS_MESSAGE } from "../../../constants/messages/Message";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import { useNotification } from "../../../context/useNotification";

export default function VehicleCard({
  vehicle,
  onDelete,
}: {
  vehicle: VehicleViewDto;
  onDelete: (id: number) => void;
}) {
  const notification = useNotification();
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      await onDelete(vehicle.id);
      notification.info({
        message: MSG_TITLE.DELETE_VEHICLE,
        description: SUCCESS_MESSAGE.DELETE_VEHICLE_SUCCESS,
        showProgress: true,
        duration: 1000,
      });
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
