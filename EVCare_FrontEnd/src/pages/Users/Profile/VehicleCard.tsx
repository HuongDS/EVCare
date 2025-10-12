import {MSG_TITLE, SUCCESS_MESSAGE} from "../../../constants/messages/Message";
import {useAlert} from "../../../context/useAlert";
import type {VehicleViewDto} from "../../../models/VehicleModels/vehicleViewDto";

export default function VehicleCard({
                                        vehicle,
                                        onDelete,
                                    }: {
    vehicle: VehicleViewDto;
    onDelete: (id: number) => void;
}) {
    const {showAlert} = useAlert();
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this vehicle?")) {
            await onDelete(vehicle.id);
            showAlert("info", MSG_TITLE.DELETE_VEHICLE, SUCCESS_MESSAGE.DELETE_VEHICLE_SUCCESS);
        }
    };

    return (
        <div className="vehicle-card">
            <img src={vehicle.image} alt={vehicle.categoryName} className="vehicle-image"/>
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
