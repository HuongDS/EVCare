import React from "react";
import { AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import {
  ModalBackdrop,
  ModalBody,
  ModalButton,
  ModalCloseButton,
  ModalContainer,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "./DeleteConfirmModal.style";

interface Props {
  isOpen: boolean;
  partName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<Props> = ({ isOpen, partName, onClose, onConfirm }) => {
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
            <ModalHeader>
              <ModalTitle>
                <FaExclamationTriangle />
                Confirm Delete Spare Part
              </ModalTitle>
              <ModalCloseButton onClick={onClose}>
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete the widget
                <strong> {partName || "here"}</strong>?
              </p>
              <p>This action will permanently remove the product from the system.</p>
            </ModalBody>
            <ModalFooter>
              <ModalButton $isConfirm={false} onClick={onClose}>
                Cancel
              </ModalButton>
              <ModalButton $isConfirm={true} onClick={onConfirm}>
                Confirm
              </ModalButton>
            </ModalFooter>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
