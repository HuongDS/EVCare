import styled from "styled-components";

export const AdminStatisticStyleWrapper = styled.div`
  font-family: "Outfit", sans-serif;

  .dashboard-page {
    padding: 1.5rem;
    background-color: #f9fafb;
    min-height: 100vh;
    font-family: "Outfit", sans-serif;
  }

  .dashboard-tabs {
    display: flex;
    gap: 8px;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 8px 8px 0 0;
    background-color: #e5e7eb;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tab-button:hover {
    background-color: #d1d5db;
  }

  .tab-button.active {
    background: linear-gradient(
      90deg,
      hsla(147, 100%, 34%, 1) 30%,
      hsla(147, 100%, 31%, 1) 100%
    );
    color: white;
    transform: translateY(2px);
    box-shadow: 0 -4px 10px rgba(0, 173, 78, 0.1);
  }

  .dashboard-content {
    background: #ffffff;
    border-radius: 0 8px 8px 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .tab-pane-content {
    animation: fadeIn 0.3s ease;
  }

  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .split-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .list-container .list-rank-number {
    font-size: 1.1rem;
    font-weight: 700;
    color: #00ad4e;
    width: 32px;
    text-align: center;
    font-family: "Outfit", sans-serif !important;
  }

  .list-container .ant-list-item-meta-title a {
    font-weight: 600;
    color: #1f2937;
  }

  .chart-container {
    width: 100%;
    min-height: 300px;
  }

  .action-tag-Added {
    background-color: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }

  .action-tag-Updated {
    background-color: #eff6ff;
    color: #1d4ed8;
    border-color: #bfdbfe;
  }

  .change-diff .change-item {
    font-size: 0.85rem;
    color: #4b5563;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .change-diff .change-label {
    font-weight: 600;
    color: #374151;
  }

  .change-diff .change-old {
    text-decoration: line-through;
    color: #ef4444;
  }

  .change-diff .change-new {
    font-weight: 700;
    color: #10b981;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
