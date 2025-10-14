import styled from "styled-components";

export const AdminCustomerVehicleWrapper = styled.div`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Outfit", sans-serif;
    background: #f1f1f1;
    display: flex;
    min-height: 100vh;
  }

  .logo-section {
    padding: 0 30px 30px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    width: 45px;
    height: 45px;
    background: #00ad4e;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px;
    font-weight: 700;
  }

  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #00ad4e;
  }

  .nav-menu {
    list-style: none;
  }

  .nav-item {
    padding: 12px 30px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #666;
    font-size: 15px;
    font-weight: 500;
  }

  .nav-item:hover {
    background: #f9f9f9;
    color: #333;
  }

  .nav-item.active {
    background: #f0f9f4;
    color: #00ad4e;
    border-left: 3px solid #00ad4e;
  }

  .nav-icon {
    font-size: 20px;
    width: 24px;
  }

  .nav-section {
    margin-top: 20px;
  }

  .nav-submenu {
    list-style: none;
    padding-left: 66px;
  }

  .nav-submenu .nav-item {
    padding: 8px 0;
    font-size: 14px;
  }

  .sidebar-footer {
    margin-top: 40px;
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
  }

  .main-content {
    flex: 1;
    padding: 30px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .page-title {
    font-size: 28px;
    font-weight: 600;
    color: #333;
  }

  .user-section {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .notification-icon {
    position: relative;
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid #e0e0e0;
  }

  .notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 18px;
    height: 18px;
    background: #ff4757;
    border-radius: 50%;
    font-size: 10px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #00ad4e;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    cursor: pointer;
  }

  .search-bar {
    margin-bottom: 25px;
    display: flex;
    gap: 15px;
    justify-content: center;
  }

  .search-input {
    flex: 1;
    padding: 12px 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: "Outfit", sans-serif;
    font-size: 15px;
    transition: all 0.2s ease;
    width: 400px;
    max-width: 60%;
  }

  .search-input:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }

  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 20px;
  }

  .user-card {
    background: #fff;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }

  .user-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f1f1f1;
  }

  .user-info {
    flex: 1;
  }

  .user-name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .user-contact {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;
  }

  .contact-icon {
    font-size: 16px;
  }

  .user-actions {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-family: "Outfit", sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .view-btn {
    background: #00ad4e;
    color: #fff;
  }

  .view-btn:hover {
    background: #008f3f;
  }

  .ban-btn {
    background: #fff;
    color: #ff4757;
    border: 1px solid #ff4757;
  }

  .ban-btn:hover {
    background: #ff4757;
    color: #fff;
  }

  .banned-badge {
    background: #ff4757;
    color: #fff;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .vehicles-section {
    margin-top: 20px;
  }

  .vehicles-header {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .vehicle-count {
    background: #f1f1f1;
    color: #666;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
  }

  .vehicles-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .vehicle-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .vehicle-item:hover {
    background: #f0f0f0;
  }

  .vehicle-info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .vehicle-plate {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .vehicle-model {
    font-size: 13px;
    color: #666;
  }

  .vehicle-img {
    width: 200px;
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: #999;
  }

  .user-card.disabled {
    opacity: 0.4;
    pointer-events: none;
    position: relative;
    transition: all 0.3s ease;
  }

  .user-card.disabled:hover {
    box-shadow: none;
  }

  .banned-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 71, 86, 0.26);
    color: rgba(255, 0, 21, 1);
    font-weight: 800;
    font-size: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    z-index: 5;
  }

  .toggle-btn {
    margin-top: 8px;
    background: none;
    border: none;
    color: #00ad4e;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    padding: 6px 0;
    transition: color 0.2s ease;
  }

  .toggle-btn:hover {
    color: #008f3f;
  }

  /* Modal Styles */
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
    padding: 30px;
    max-width: 500px;
    width: 90%;
    animation: slideUp 0.3s ease-out;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .modal-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: #f5f5f5;
    color: #333;
  }

  .modal-body {
    margin-bottom: 25px;
    color: #666;
    line-height: 1.6;
  }

  .modal-buttons {
    display: flex;
    gap: 12px;
  }

  .modal-btn {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .confirm-btn {
    background: #ff4757;
    color: #fff;
  }

  .confirm-btn:hover {
    background: #e84252;
  }

  .cancel-modal-btn {
    background: #fff;
    color: #666;
    border: 1px solid #e0e0e0;
  }

  .cancel-modal-btn:hover {
    background: #f5f5f5;
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

  @media (max-width: 1200px) {
    .users-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
    }

    .main-content {
      margin-left: 0;
    }
  }
`;
