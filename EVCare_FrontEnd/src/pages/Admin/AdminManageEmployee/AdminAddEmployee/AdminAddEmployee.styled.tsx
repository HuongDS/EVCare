import styled from "styled-components";

export const AdminAddEmployeeWrapper = styled.div`
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

  .main-content {
    flex: 1;
    padding: 30px;
  }

  .back-btn {
    background: #fff;
    border: 2px solid #00ad4e;
    color: #00ad4e;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .back-btn:hover {
    background: #00ad4e;
    color: #fff;
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

  .form-container {
    margin: 0px auto;
    max-width: 90%;
    background: #fff;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .form-section {
    margin-bottom: 30px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f1f1f1;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .form-grid.single {
    grid-template-columns: 1fr;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .required {
    color: #ff4757;
    margin-left: 4px;
  }

  .form-input,
  .form-select {
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: "Outfit", sans-serif;
    font-size: 15px;
    transition: all 0.2s ease;
    background: #fff;
  }

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }

  .form-select {
    cursor: pointer;
  }

  .role-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .role-card {
    padding: 20px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }

  .role-card:hover {
    border-color: #00ad4e;
    background: #f9f9f9;
  }

  .role-card.selected {
    border-color: #00ad4e;
    background: #f0f9f4;
  }

  .role-icon {
    font-size: 40px;
    margin-bottom: 10px;
  }

  .role-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }

  .role-description {
    font-size: 13px;
    color: #666;
  }

  .technician-fields {
    display: none;
    margin-top: 20px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    border-left: 3px solid #7b1fa2;
  }

  .technician-fields.show {
    display: block;
  }

  .info-note {
    padding: 12px 16px;
    background: #e3f2fd;
    border-left: 3px solid #2196f3;
    border-radius: 4px;
    font-size: 14px;
    color: #1565c0;
    margin-bottom: 20px;
  }

  .form-actions {
    display: flex;
    gap: 15px;
    margin-top: 40px;
    padding-top: 30px;
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
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-btn:hover {
    background: #008f3f;
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
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cancel-btn:hover {
    background: #f5f5f5;
  }

  .skills-search {
    margin: 15px 0 20px 0;
  }

  .skills-section {
    margin-top: 25px;
  }

  .skills-groups {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 15px;
  }

  .skill-group {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  .skill-group-header {
    background: #f9f9f9;
    padding: 15px 20px;
    font-weight: 600;
    font-size: 15px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #e0e0e0;
  }

  .skill-group-body {
    padding: 15px 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .skill-checkbox-wrapper {
    display: flex;
    align-items: center;
  }

  .skill-checkbox {
    display: none;
  }

  .skill-label {
    padding: 8px 16px;
    background: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
  }

  .skill-label:hover {
    border-color: #00ad4e;
    background: #f9f9f9;
  }

  .skill-checkbox:checked + .skill-label {
    background: #00ad4e;
    border-color: #00ad4e;
    color: #fff;
  }

  .selected-skills-display {
    margin-top: 25px;
    padding: 20px;
    background: #fff;
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
  }

  .selected-label {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin-bottom: 12px;
  }

  .selected-skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-height: 40px;
    align-items: center;
  }

  .no-skills-text {
    color: #999;
    font-size: 14px;
    font-style: italic;
  }

  .selected-skill-tag {
    padding: 8px 16px;
    background: #00ad4e;
    color: #fff;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .remove-skill {
    cursor: pointer;
    font-weight: 700;
    font-size: 16px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .remove-skill:hover {
    opacity: 1;
  }

  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
    }

    .main-content {
      margin-left: 0;
    }

    .form-grid,
    .role-cards {
      grid-template-columns: 1fr;
    }

    .form-container {
      padding: 25px;
    }

    .form-actions {
      flex-direction: column-reverse;
    }
  }
`;
