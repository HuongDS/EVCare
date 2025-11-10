import React from "react";
import styled from "styled-components";
import { InboxOutlined } from "@ant-design/icons";

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.3);

  .empty-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #ecfdf5;
    margin-bottom: 1rem;
  }
  .anticon {
    font-size: 3rem;
    color: #00ad4e;
  }
  .empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
  .empty-description {
    font-size: 0.9rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
`;

export const EmptyState: React.FC = () => {
  return (
    <EmptyStateWrapper>
      <div className="empty-icon-wrapper">
        <InboxOutlined />
      </div>
      <h3 className="empty-title">Appointment not found</h3>
      <p className="empty-description">There are no appointments matching your filters.</p>
    </EmptyStateWrapper>
  );
};
