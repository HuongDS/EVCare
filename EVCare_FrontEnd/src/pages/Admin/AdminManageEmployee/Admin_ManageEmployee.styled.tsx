import styled from "styled-components";

export const AdminManageEmployeeWrapper = styled.div`
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
  .main-content {
    flex: 1;
    padding: 30px;
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
  .filter-bar {
    margin-bottom: 25px;
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }
  .search-input {
    flex: 1;
    min-width: 300px;
    padding: 12px 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: "Outfit", sans-serif;
    font-size: 15px;
    transition: all 0.2s ease;
  }
  .search-input:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }
  .filter-select {
    padding: 12px 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: "Outfit", sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: #666;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 150px;
  }
  .filter-select:focus {
    outline: none;
    border-color: #00ad4e;
  }
  .add-employee-btn {
    padding: 12px 24px;
    background: #00ad4e;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: "Outfit", sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .add-employee-btn:hover {
    background: #008f3f;
  }
  .employees-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 20px;
  }
  .employee-card {
    background: #fff;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  .employee-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: #00ad4e;
  }
  .employee-header {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f1f1f1;
  }
  .employee-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    background: #e0e0e0;
    flex-shrink: 0;
  }
  .employee-basic-info {
    flex: 1;
  }
  .employee-name-section {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .employee-name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  .role-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .role-staff {
    background: #e3f2fd;
    color: #1976d2;
  }
  .role-technician {
    background: #f3e5f5;
    color: #7b1fa2;
  }
  .banned-badge {
    background: #ff4757;
    color: #fff;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    margin-top: 8px;
  }
  .status-available {
    background: #e8f5e9;
    color: #2e7d32;
  }
  .status-busy {
    background: #fff3e0;
    color: #e65100;
  }
  .status-onleave {
    background: #fce4ec;
    color: #c2185b;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
  .employee-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }
  .detail-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #666;
    padding: 8px;
    background: #f9f9f9;
    border-radius: 6px;
  }
  .detail-icon {
    font-size: 16px;
    color: #00ad4e;
  }
  .technician-extra {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #f1f1f1;
  }
  .extra-title {
    font-size: 13px;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .experience-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f3e5f5;
    color: #7b1fa2;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .skill-tag {
    padding: 5px 10px;
    background: #e0e0e0;
    color: #666;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  .employee-actions {
    display: flex;
    justify-content: flex-end;
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
  .ban-btn {
    background: #fff;
    color: #ff4757;
    border: 2px solid #ff4757;
  }
  .ban-btn:hover {
    background: #ff4757;
    color: #fff;
  }
  .empty-state {
    text-align: center;
    padding: 60px;
    color: #999;
    font-size: 16px;
    grid-column: 1 / -1;
  } /* Modal Styles */
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  .modal.active {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: #fff;
    border-radius: 12px;
    padding: 35px;
    max-width: 500px;
    width: 90%;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }
  .modal-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
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
  }
  .modal-body {
    margin-bottom: 30px;
    color: #666;
    line-height: 1.6;
    font-size: 15px;
  }
  .modal-buttons {
    display: flex;
    gap: 12px;
  }
  .modal-btn {
    flex: 1;
    padding: 14px;
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
    border: 2px solid #e0e0e0;
  }
  .cancel-modal-btn:hover {
    background: #f5f5f5;
  }
  @media (max-width: 1200px) {
    .employees-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
    }
    .main-content {
      margin-left: 0;
    }
    .employees-grid {
      grid-template-columns: 1fr;
    }
    .filter-bar {
      flex-direction: column;
    }
    .search-input {
      min-width: 100%;
    }
  }
`;
