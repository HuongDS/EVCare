import React from "react";
import {ReviewWrapper} from "./Review.styled.tsx";

interface SuccessMessageProps {
    onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({onClose}) => {
    return (
        <ReviewWrapper>
            <div className="success-message active">
                <div className="success-icon">✓</div>
                <h3 className="success-title">Review Submitted</h3>
                <p className="success-text">Thank you for sharing your feedback with us.</p>
                <button className="submit-btn" style={{marginTop: 30, maxWidth: 200}} onClick={onClose}>
                    Close
                </button>
            </div>
        </ReviewWrapper>
    );
};

export default SuccessMessage;
