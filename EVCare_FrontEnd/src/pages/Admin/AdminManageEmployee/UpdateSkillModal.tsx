import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaCheck, FaTools } from "react-icons/fa";
import {
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalButton,
  SkillCategoryWrapper,
  CategoryHeader,
  SkillGrid,
  SkillSelectButton,
  CheckIcon,
} from "./Admin_ManageEmployee.styled";
import type { EmployeeViewModel } from "../../../models/Employee/EmployeeViewModel";
import { LoadingSpinner } from "../AdminServiceCenter/AdminServiceCenter.styled";
import type { EmployeeSkillCategoryViewModel } from "../../../models/Employee/EmployeeSkillCategoryViewModel";
import { useNotification } from "../../../context/useNotification";
import { getTechnicianCategories } from "../../../services/technicianCategoryService";
import SpinnerComponent from "../../../components/SpinnerComponent";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  technician: EmployeeViewModel | null;
  handleEditTechnicianSkills: (v: EmployeeViewModel, selectedSkillIds: number[]) => void;
  isSubmitting: boolean;
}

const UpdateSkillModal: React.FC<Props> = ({
  isOpen,
  onClose,
  technician,
  handleEditTechnicianSkills,
  isSubmitting,
}) => {
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [allSkillCategories, setAllSkillCategories] = useState<EmployeeSkillCategoryViewModel[]>([]);
  const notification = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const fetchServiceCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getTechnicianCategories();
      setAllSkillCategories(response.data ?? []);
    } catch (error) {
      notification.error({
        message: "ERROR",
        description: (error as Error).message,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen && technician) {
      fetchServiceCategories();
      const currentIds = technician.skills.map((s) => s.id);
      setSelectedSkillIds(currentIds);
    } else {
      setSelectedSkillIds([]);
    }
  }, [isOpen, technician]);

  const toggleSkill = (skillId: number) => {
    setSelectedSkillIds((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId);
      } else {
        return [...prev, skillId];
      }
    });
  };

  return (
    <AnimatePresence>
      {isLoading && <SpinnerComponent />}
      {isOpen && !isLoading && (
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <ModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 500 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "700px" }}
          >
            <ModalHeader>
              <ModalTitle>
                <FaTools /> Update Technician Skills
              </ModalTitle>
              <ModalCloseButton onClick={onClose}>
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>

            <ModalBody style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <p style={{ marginBottom: "20px" }}>
                Updating skills for: <strong>{technician?.fullName}</strong>
              </p>

              {allSkillCategories.map((category) => (
                <SkillCategoryWrapper key={category.name}>
                  <CategoryHeader>{category.name}</CategoryHeader>
                  <SkillGrid>
                    {category.services.map((skill) => {
                      const isSelected = selectedSkillIds.includes(skill.id);
                      return (
                        <motion.div key={skill.id} whileTap={{ scale: 0.95 }}>
                          <SkillSelectButton
                            type="button"
                            $isSelected={isSelected}
                            onClick={() => toggleSkill(skill.id)}
                            disabled={isSubmitting}
                          >
                            {isSelected && (
                              <CheckIcon>
                                <FaCheck />
                              </CheckIcon>
                            )}
                            {skill.name}
                          </SkillSelectButton>
                        </motion.div>
                      );
                    })}
                  </SkillGrid>
                </SkillCategoryWrapper>
              ))}

              {allSkillCategories.length === 0 && (
                <p style={{ color: "#9ca3af", textAlign: "center", marginTop: "20px" }}>
                  No skill categories available.
                </p>
              )}
            </ModalBody>

            <ModalFooter>
              <ModalButton type="button" $isConfirm={false} onClick={onClose} disabled={isSubmitting}>
                Cancel
              </ModalButton>
              <ModalButton
                type="button"
                $isConfirm={true}
                onClick={() => handleEditTechnicianSkills(technician!, selectedSkillIds)}
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner /> : <></>}
                Save Changes
              </ModalButton>
            </ModalFooter>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

export default UpdateSkillModal;
