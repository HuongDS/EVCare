import styled from "styled-components";

export const ContainerWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-size: cover;
    background-position: center;
    filter: blur(10px) brightness(1.1);
    transform: scale(1.02);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Outfit", sans-serif;
  }

  .container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 3fr 7fr;
    gap: 24px;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .sidebar-info-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    text-align: center;

    .avatar-placeholder {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #e0e0e0;
      margin: 0 auto 15px;
      border: 2px solid rgba(255, 255, 255, 1);
    }
    h2 {
      color: #333;
      font-size: 1.5rem;
      font-weight: 700;
    }
    p {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 15px;
      word-break: break-all;
    }
  }

  .sidebar-nav {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .sidebar-nav-btn {
    background: transparent;
    color: #495057;
    border: 1px solid transparent;
    padding: 14px 20px;
    border-radius: 12px;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 12px;

    svg {
      font-size: 1.2rem;
      color: #6c757d;
      transition: all 0.3s ease;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #212529;
    }

    &.active {
      background: #00ad4e;
      color: #fff;
      border-color: #00ad4e;
      box-shadow: 0 4px 15px rgba(0, 173, 78, 0.2);

      svg {
        color: #fff;
      }
    }
  }

  .content-area {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
    animation: slideDown 0.6s ease-out;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto 30px;
  }

  .back-btn {
    background: #fff;
    border: 2px solid #00ad4e;
    color: #00ad4e;
    padding: 12px 24px;
    border-radius: 12px;
    cursor: pointer;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .back-btn:hover {
    background: #00ad4e;
    color: #fff;
    transform: translateX(-5px);
  }

  .logo {
    font-size: 32px;
    font-weight: 700;
    color: #00ad4e;
  }

  .profile-card {
    // background: rgba(255, 255, 255, 0.7);
    // backdrop-filter: blur(15px);
    background: #fff;
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: fadeInUp 0.6s ease-out;
  }

  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  .profile-title {
    font-size: 28px;
    font-weight: 700;
    color: #333; /* Chữ màu tối */
  }

  .rank-badge {
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    transition: all 0.3s ease;
  }
  .rank-regular {
    background: #f1f1f1;
    color: #666;
  }
  .rank-member {
    background: #e3f2fd;
    color: #1976d2;
  }
  .rank-vip {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    color: #333;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  .info-field {
    position: relative;
  }
  .info-field label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin-bottom: 8px;
  }

  .info-field input {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    font-family: "Outfit", sans-serif;
    font-size: 16px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid #ddd;
    color: #333;
  }
  .info-field input:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
    background: rgba(255, 255, 255, 0.8);
  }
  .info-field input:disabled {
    background: #f9f9f9;
    color: #999;
    cursor: not-allowed;
  }

  .edit-btn {
    background: #00ad4e;
    color: #fff;
    border: none;
    padding: 14px 32px;
    border-radius: 12px;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 10px;
  }
  .edit-btn:hover {
    background: #008f3f;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 173, 78, 0.3);
  }

  .cancel-btn {
    background: #fff;
    color: #666;
    border: 2px solid #e0e0e0;
    padding: 14px 32px;
    border-radius: 12px;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cancel-btn:hover {
    background: #f5f5f5;
  }

  .spending-section {
    text-align: center;
    padding: 30px;
    background: linear-gradient(135deg, #00ad4e 0%, #00c955 100%);
    border-radius: 16px;
    margin-top: 30px;
    animation: pulse 2s ease-in-out infinite;
  }
  .spending-label {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .spending-amount {
    color: #fff;
    font-size: 48px;
    font-weight: 700;
  }

  .vehicles-section {
    animation: fadeInUp 0.6s ease-out 0.2s both;
  }

  .invoices-section {
    animation: fadeInUp 0.6s ease-out 0.15s both;
  }

  .invoices-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .invoice-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 20px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.5); /* Kính trắng mờ */
    border-radius: 12px;
    border-left: 4px solid #00ad4e;
    transition: all 0.3s ease;
    align-items: center;
  }
  .invoice-item:hover {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transform: translateX(5px);
  }

  .invoice-field {
    display: flex;
    flex-direction: column;
  }

  .invoice-label {
    font-size: 12px;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    margin-bottom: 5px;
  }

  .invoice-value {
    font-size: 15px;
    font-weight: 600;
    color: #333;
  }

  .invoice-amount {
    font-size: 18px;
    font-weight: 700;
    color: #00ad4e;
  }

  .status-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
    display: inline-block;
  }
  .status-pending {
    background: #fff3cd;
    color: #856404;
  }
  .status-completed {
    background: #d4edda;
    color: #155724;
  }
  .status-failed {
    background: #f8d7da;
    color: #721c24;
  }
  .status-refunded {
    background: #d1ecf1;
    color: #0c5460;
  }

  .payment-method {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;
  }

  .payment-icon {
    font-size: 18px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }
  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
  }

  .add-vehicle-btn {
    background: #00ad4e;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .add-vehicle-btn:hover {
    background: #008f3f;
    transform: scale(1.05);
  }

  .vehicles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .vehicle-card {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    animation: scaleIn 0.4s ease-out;
  }
  .vehicle-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.8);
  }

  .vehicle-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 15px;
    background: #f1f1f1;
  }

  .vehicle-info {
    margin-bottom: 15px;
  }
  .vehicle-model {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
  }
  .vehicle-plate {
    font-size: 16px;
    color: #666;
    padding: 8px 12px;
    background: #f1f1f1;
    border-radius: 8px;
    display: inline-block;
  }

  .delete-vehicle-btn {
    width: 100%;
    background: #ff4757;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 8px;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .delete-vehicle-btn:hover {
    background: #e84252;
    transform: scale(1.02);
  }

  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  }
  .modal.active {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideUp 0.4s ease-out;
  }
  .modal-title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 25px;
  }

  .form-group {
    margin-bottom: 20px;
  }
  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin-bottom: 8px;
  }

  .form-group select,
  .form-group input {
    width: 100%;
    padding: 14px;
    border: 2px solid #f1f1f1;
    border-radius: 12px;
    font-family: "Outfit", sans-serif;
    font-size: 16px;
    transition: all 0.3s ease;
    background: #f9f9f9;
    color: #333;
  }
  .form-group select:focus,
  .form-group input:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }

  .image-upload {
    border: 2px dashed #00ad4e;
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #666;
  }
  .image-upload:hover {
    background: rgba(0, 173, 78, 0.05);
  }
  .image-upload input {
    display: none;
  }
  .preview-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: 12px;
    margin-top: 15px;
  }

  .modal-buttons {
    display: flex;
    gap: 10px;
    margin-top: 30px;
  }
  .modal-buttons button {
    flex: 1;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(0, 173, 78, 0.4);
    }
    50% {
      box-shadow: 0 0 0 20px rgba(0, 173, 78, 0);
    }
  }

  @media (max-width: 992px) {
    .container {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 768px) {
    .profile-card {
      padding: 25px;
    }
    .info-grid {
      grid-template-columns: 1fr;
    }
    .vehicles-grid {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 768px) {
    .invoice-item {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }
`;
