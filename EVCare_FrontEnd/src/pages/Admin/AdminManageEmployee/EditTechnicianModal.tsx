import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import {
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalButton,
} from "./Admin_ManageEmployee.styled";
import type { EmployeeViewModel } from "../../../models/Employee/EmployeeViewModel";
import { useNotification } from "../../../context/useNotification";
import { InputGroup, LoadingSpinner, StyledInput, StyledLabel } from "../AdminServiceCenter/AdminServiceCenter.styled";
import { updateTechnician } from "../../../services/adminService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeViewModel | null;
}

const EditTechnicianModal: React.FC<Props> = ({ isOpen, onClose, employee }) => {
  const [formData, setFormData] = useState({
    expYear: 0,
    kpiGetDays: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();

  useEffect(() => {
    if (employee) {
      setFormData({
        expYear: employee.expYear ?? 0,
        kpiGetDays: employee.kpiGetDays ?? 0,
      });
    }
  }, [employee, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value) < 0 ? 0 : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !employee.technicianId) return;
    setIsSubmitting(true);
    try {
      await updateTechnician(employee.technicianId, formData.expYear, formData.kpiGetDays);
      notification.success({ message: "Update Technician Successfully !" });
      onClose();
    } catch (error) {
      notification.error({ message: "Update Technician Failed !", description: (error as Error).message });
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <ModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 500 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <ModalHeader>
                <ModalTitle>Edit Technician KPI</ModalTitle>
                <ModalCloseButton type="button" onClick={onClose}>
                  <FaTimes />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <p>
                  You are editing KPI details for: <strong>{employee?.fullName}</strong>
                </p>

                <InputGroup>
                  <StyledLabel htmlFor="expYear">Years of Experience</StyledLabel>
                  <StyledInput
                    id="expYear"
                    name="expYear"
                    type="number"
                    value={formData.expYear}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    min={0}
                  />
                </InputGroup>

                <InputGroup>
                  <StyledLabel htmlFor="kpiGetDays">KPI (Days)</StyledLabel>
                  <StyledInput
                    id="kpiGetDays"
                    name="kpiGetDays"
                    type="number"
                    value={formData.kpiGetDays}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    min={0}
                  />
                </InputGroup>
              </ModalBody>
              <ModalFooter>
                <ModalButton type="button" $isConfirm={false} onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </ModalButton>
                <ModalButton $isConfirm={true} disabled={isSubmitting} onClick={handleSubmit}>
                  {isSubmitting && <LoadingSpinner />} Save Changes
                </ModalButton>
              </ModalFooter>
            </div>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

export default EditTechnicianModal;
