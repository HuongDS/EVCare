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
} from "./Admin_Customer_Vehicle.styled";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface BanModalProps {
  visible: boolean;
  userName?: string;
  isBanned?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const BanModal: React.FC<BanModalProps> = ({ visible, userName, isBanned, onCancel, onConfirm }) => {
  if (isBanned) return null;

  return (
    <AnimatePresence>
      {visible && (
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
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
                Confirm Ban User
              </ModalTitle>
              <ModalCloseButton onClick={onCancel}>
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to ban user
                <strong> {userName || "this"}</strong>?
              </p>
              <p>They will no longer be able to access their account or make appointments.</p>
            </ModalBody>
            <ModalFooter>
              <ModalButton $isConfirm={false} onClick={onCancel}>
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
