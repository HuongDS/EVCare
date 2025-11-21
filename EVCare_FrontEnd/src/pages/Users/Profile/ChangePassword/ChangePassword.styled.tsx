import styled from "styled-components";

export const ChangePassordStyleWrapper = styled.div`
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

  .container {
    text-align: center;
  }

  .change-password-btn {
    background: #00ad4e;
    color: #fff;
    border: none;
    padding: 16px 32px;
    border-radius: 8px;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
  }

  .change-password-btn:hover {
    background: #008f3f;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
  }

  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
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
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.4s ease-out;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f1f1f1;
  }

  .modal-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .title-icon {
    font-size: 28px;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 28px;
    color: #999;
    cursor: pointer;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: #f5f5f5;
    color: #333;
    transform: rotate(90deg);
  }

  .form-group {
    margin-bottom: 25px;
    text-align: left;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .required {
    color: #ff4757;
    margin-left: 4px;
  }

  .password-input-wrapper {
    position: relative;
  }

  .form-input {
    width: 100%;
    padding: 14px 45px 14px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-family: "Outfit", sans-serif;
    font-size: 15px;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }

  .form-input.error {
    border-color: #ff4757;
  }

  .toggle-password {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: #999;
    transition: all 0.2s ease;
  }

  .toggle-password:hover {
    color: #00ad4e;
  }

  .error-message {
    display: none;
    margin-top: 8px;
    font-size: 13px;
    color: #ff4757;
  }

  .error-message.show {
    display: block;
  }

  .password-strength {
    margin-top: 10px;
  }

  .strength-bar {
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .strength-fill {
    height: 100%;
    width: 0%;
    transition: all 0.3s ease;
    border-radius: 3px;
  }

  .strength-fill.weak {
    width: 33%;
    background: #ff4757;
  }

  .strength-fill.medium {
    width: 66%;
    background: #ffa726;
  }

  .strength-fill.strong {
    width: 100%;
    background: #00ad4e;
  }

  .strength-text {
    font-size: 13px;
    font-weight: 600;
  }

  .strength-text.weak {
    color: #ff4757;
  }

  .strength-text.medium {
    color: #ffa726;
  }

  .strength-text.strong {
    color: #00ad4e;
  }

  .password-requirements {
    margin-top: 15px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    border-left: 3px solid #2196f3;
  }

  .requirement-title {
    font-size: 13px;
    font-weight: 600;
    color: #666;
    margin-bottom: 8px;
  }

  .requirement-list {
    list-style: none;
    font-size: 13px;
    color: #666;
  }

  .requirement-item {
    padding: 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .requirement-item.met {
    color: #00ad4e;
  }

  .requirement-item::before {
    content: "○";
    color: #999;
  }

  .requirement-item.met::before {
    content: "✓";
    color: #00ad4e;
    font-weight: 700;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #f1f1f1;
  }

  .submit-btn {
    flex: 2;
    padding: 14px;
    background: #00ad4e;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background: #008f3f;
    transform: translateY(-1px);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cancel-btn {
    flex: 1;
    padding: 14px;
    background: #fff;
    color: #666;
    border: 2px solid #e0e0e0;
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
    padding: 40px;
  }

  .success-message.active {
    display: block;
    animation: fadeIn 0.5s ease-out;
  }

  .success-icon {
    width: 80px;
    height: 80px;
    background: #00ad4e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 40px;
    animation: successPop 0.6s ease-out;
  }

  .success-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }

  .success-text {
    font-size: 15px;
    color: #666;
    margin-bottom: 30px;
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
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes successPop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .modal-content {
      padding: 30px 20px;
    }

    .form-actions {
      flex-direction: column-reverse;
    }
  }
`;
