import styled from "styled-components";

export const ReviewWrapper = styled.div`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: "Outfit", sans-serif;
        background: linear-gradient(135deg, #f1f1f1 0%, #e8e8e8 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }

    .review-icon {
        font-size: 18px;
    }

    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        animation: fadeIn 0.2s ease-out;
    }

    .modal.active {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background: #fff;
        border-radius: 12px;
        padding: 40px;
        max-width: 650px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease-out;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
    }

    .modal-title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        color: #999;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }

    .close-btn:hover {
        background: #f5f5f5;
        color: #333;
    }

    .info-section {
        margin-bottom: 20px;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 8px;
        border-left: 3px solid #00ad4e;
    }

    .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 8px;
    }

    .info-item {
        display: flex;
        flex-direction: column;
    }

    .info-label {
        font-size: 12px;
        font-weight: 600;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
    }

    .info-value {
        font-size: 15px;
        font-weight: 500;
        color: #333;
    }

    .rating-section {
        margin-bottom: 30px;
    }

    .rating-label {
        font-size: 15px;
        font-weight: 600;
        color: #333;
        margin-bottom: 15px;
    }

    .rating-container {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .stars {
        display: flex;
        gap: 8px;
    }

    .star {
        font-size: 32px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #e0e0e0;
    }

    .star:hover {
        color: #ffc107;
        transform: scale(1.1);
    }

    .star.active {
        color: #ffc107;
    }

    .rating-value {
        font-size: 18px;
        font-weight: 600;
        color: #00ad4e;
        min-width: 50px;
        padding-left: 8px;
        border-left: 1px solid #e0e0e0;
    }

    .rating-text {
        font-size: 13px;
        color: #666;
        margin-top: 8px;
    }

    .form-section {
        margin-bottom: 25px;
    }

    .form-label {
        display: block;
        font-size: 15px;
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
    }

    .textarea-container {
        position: relative;
    }


    .char-counter {
        position: absolute;
        bottom: 12px;
        right: 12px;
        font-size: 12px;
        color: #999;
        background: rgba(255, 255, 255, 0.9);
        padding: 4px 8px;
        border-radius: 4px;
    }

    .button-group {
        display: flex;
        gap: 12px;
        margin-top: 30px;
    }

    .submit-btn {
        flex: 1;
        background: #00ad4e;
        color: #fff;
        border: none;
        padding: 14px;
        border-radius: 8px;
        font-family: "Outfit", sans-serif;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) {
        background: #008f3f;
    }

    .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .cancel-btn {
        flex: 1;
        background: #fff;
        color: #666;
        border: 1px solid #e0e0e0;
        padding: 14px;
        border-radius: 8px;
        font-family: "Outfit", sans-serif;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .cancel-btn:hover {
        background: #f5f5f5;
        border-color: #d0d0d0;
    }

    .success-message {
        display: none;
        text-align: center;
        padding: 60px 40px;
    }

    .success-message.active {
        display: block;
        animation: fadeIn 0.3s ease-out;
    }

    .success-icon {
        width: 64px;
        height: 64px;
        background: #00ad4e;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 32px;
    }

    .success-title {
        font-size: 22px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
    }

    .success-text {
        font-size: 15px;
        color: #666;
    }


    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        .modal-content {
            padding: 30px 20px;
        }

        .info-grid {
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .stars {
            gap: 6px;
        }

        .star {
            font-size: 28px;
        }

        .button-group {
            flex-direction: column;
        }
    }
`;
