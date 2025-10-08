import React, {useState} from "react";
import ReviewForm from "./ReviewForm";
import SuccessMessage from "./SuccessMessage";
import type {ReviewCreateDto} from "../../models/Review/ReviewCreateDto";
import {ReviewWrapper} from "./Review.styled.tsx";
import type {AppointmentViewDetailModel} from "../../models/AppointmentsModel/AppointmentViewDetailModel.ts";

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    appointmentData: AppointmentViewDetailModel;
}

const ReviewModal: React.FC<ReviewModalProps> = ({open, onClose, appointmentData}) => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (data: ReviewCreateDto) => {
        console.log("Review submitted:", data);
        setSubmitted(true);
        setTimeout(onClose, 2500);
    };

    if (!open) return null;

    return (
        <ReviewWrapper>
            <div className="modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className="modal-content">
                    {!submitted ?
                        <ReviewForm appointmentData={appointmentData} onSubmit={handleSubmit} onCancel={onClose}/> :
                        <SuccessMessage onClose={onClose}/>}
                </div>
            </div>
        </ReviewWrapper>
    );
};

export default ReviewModal;
