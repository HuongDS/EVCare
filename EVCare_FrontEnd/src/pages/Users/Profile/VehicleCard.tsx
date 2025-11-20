import { MSG_TITLE, SUCCESS_MESSAGE } from "../../../constants/messages/Message";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import { useNotification } from "../../../context/useNotification";
import DeleteConfirmationModal from "../../Admin/AdminService&Parts/DeleteConfirmModal";
import { useState } from "react";

export default function VehicleCard({
  vehicle,
  onDelete,
}: {
  vehicle: VehicleViewDto;
  onDelete: (id: number) => void;
}) {
  const notification = useNotification();
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const deleteVehicle = async () => {
    await onDelete(vehicle.id);
    notification.info({
      message: MSG_TITLE.DELETE_VEHICLE,
      description: SUCCESS_MESSAGE.DELETE_VEHICLE_SUCCESS,
      showProgress: true,
      duration: 1000,
    });
  };

  const handleDeleteClick = () => {
    setIsOpenConfirmModal(true);
  };

  const handleNoConfirmDelete = () => {
    setIsOpenConfirmModal(false);
  };

  return (
    <>
      <div className="vehicle-card">
        <img src={vehicle.image} alt={vehicle.categoryName} className="vehicle-image" />
        <div className="vehicle-info">
          <div className="vehicle-model">{vehicle.categoryName}</div>
          <div className="vehicle-plate">{vehicle.licensePlate}</div>
        </div>
        <button className="delete-vehicle-btn" onClick={handleDeleteClick}>
          Delete Vehicle
        </button>
      </div>
      {isOpenConfirmModal ? (
        <DeleteConfirmationModal
          onConfirm={deleteVehicle}
          onClose={handleNoConfirmDelete}
          isOpen={isOpenConfirmModal}
          itemName={"Car with license " + vehicle.licensePlate}
        />
      ) : (
        <></>
      )}
    </>
  );
}
