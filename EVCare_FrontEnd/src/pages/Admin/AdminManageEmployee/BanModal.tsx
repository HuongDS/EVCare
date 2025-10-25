import React from "react";
import { AnimatePresence } from "framer-motion";
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
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  employeeName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const BanModal: React.FC<Props> = ({ isOpen, employeeName, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <ModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 500 }}
          >
            <ModalHeader>
              <ModalTitle>
                <FaExclamationTriangle />
                Confirm ban account
              </ModalTitle>
              <ModalCloseButton onClick={onClose}>
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to lock the employee's account
                <strong> {employeeName || "here"}</strong>?
              </p>
              <p>They will not be able to log into the system.</p>
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

export default BanModal;
