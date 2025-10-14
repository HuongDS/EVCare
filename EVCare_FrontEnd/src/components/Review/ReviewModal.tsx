import React, { useState } from "react";
import ReviewForm from "./ReviewForm";
import SuccessMessage from "./SuccessMessage";
import type { ReviewCreateDto } from "../../models/Review/ReviewCreateDto.ts";
import { ReviewWrapper } from "./Review.styled.tsx";
import type { AppointmentViewDetailModel } from "../../models/AppointmentsModel/AppointmentViewDetailModel.ts";
import { handleError } from "../../utils/errorHandler.ts";
import { useAlert } from "../../context/useAlert.ts";
import { MSG_TITLE } from "../../constants/messages/Message.ts";
import { review } from "../../services/reviewService.ts";
import SpinnerComponent from "../SpinnerComponent.tsx";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  appointmentData: AppointmentViewDetailModel;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, appointmentData }) => {
  const [submitted, setSubmitted] = useState(false);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ReviewCreateDto) => {
    setIsLoading(true);
    try {
      await review(data);
    } catch (error) {
      handleError(error);
      showAlert("error", MSG_TITLE.REVIEW, error as string);
    }
    setSubmitted(true);
    setTimeout(onClose, 2500);
    setIsLoading(false);
  };

  if (!open) return null;

  return (
    <ReviewWrapper>
      <div className="modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-content">
          {!submitted ? (
            isLoading ? (
              <SpinnerComponent />
            ) : (
              <ReviewForm appointmentData={appointmentData} onSubmit={handleSubmit} onCancel={onClose} />
            )
          ) : (
            <SuccessMessage onClose={onClose} />
          )}
        </div>
      </div>
    </ReviewWrapper>
  );
};

export default ReviewModal;
