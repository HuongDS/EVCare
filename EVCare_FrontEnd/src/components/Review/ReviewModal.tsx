import React, { useState } from "react";
import ReviewForm from "./ReviewForm";
import SuccessMessage from "./SuccessMessage";
import type { ReviewCreateDto } from "../../models/Review/ReviewCreateDto.ts";
import type { AppointmentViewDetailModel } from "../../models/AppointmentsModel/AppointmentViewDetailModel.ts";
import { handleError } from "../../utils/errorHandler.ts";
import { useAlert } from "../../context/useAlert.ts";
import { MSG_TITLE } from "../../constants/messages/Message.ts";
import { review } from "../../services/reviewService.ts";
import SpinnerComponent from "../SpinnerComponent.tsx";
import { ModalOverlay } from "./Review.styled.tsx";
import { useNavigate } from "react-router";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  appointmentData: AppointmentViewDetailModel;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, appointmentData }) => {
  const [submitted, setSubmitted] = useState(false);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: ReviewCreateDto) => {
    setIsLoading(true);
    try {
      await review(data);
      setSubmitted(true);
      setTimeout(onClose, 2500);
      navigate("/review");
    } catch (error) {
      handleError(error);
      showAlert("error", MSG_TITLE.REVIEW, (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {!submitted ? (
        isLoading ? (
          <ModalOverlay>
            <SpinnerComponent />
          </ModalOverlay>
        ) : (
          <ReviewForm appointmentData={appointmentData} onSubmit={handleSubmit} onCancel={onClose} />
        )
      ) : (
        <SuccessMessage onClose={onClose} />
      )}
    </>
  );
};

export default ReviewModal;
