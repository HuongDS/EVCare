import { useState } from "react";
import { Modal } from "antd";
import { BookingFormButton, Checkbox, MoreInfoLink } from "./BookingForm.styled";
import type { ServiceCategoryViewModel } from "../../../models/ServicesModel/ServiceCategoryViewModel";

const MoreInfo = ({
  serviceCategorieModel,
  handleSelectServices,
  selectedServices,
}: {
  serviceCategorieModel: ServiceCategoryViewModel;
  handleSelectServices: (serviceId: number) => void;
  selectedServices: number[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <MoreInfoLink onClick={showModal}> More Infor</MoreInfoLink>
      <Modal
        title={serviceCategorieModel.name}
        closable={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        zIndex={2000}
        style={{ top: 100 }}
        footer={[
          <BookingFormButton key="submit" onClick={handleOk}>
            <button>OK</button>
          </BookingFormButton>,
        ]}
      >
        {serviceCategorieModel.services?.map((s) => (
          <div key={s.id}>
            <Checkbox
              key={s.id}
              type="checkbox"
              checked={selectedServices.includes(s.id)}
              onChange={() => handleSelectServices(s.id)}
            />
            <span> {s.name}</span>
            <br />
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default MoreInfo;
