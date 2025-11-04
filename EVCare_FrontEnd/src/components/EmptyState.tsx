import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { EmptyStateWrapper } from "./EmptyState.styled";

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No data found",
  description = "There is currently nothing to display here. Please try again later.",
}) => {
  return (
    <EmptyStateWrapper>
      <div className="empty-icon-wrapper">
        <InboxOutlined />
      </div>
      <h3 className="empty-title">{message}</h3>
      <p className="empty-description">{description}</p>
    </EmptyStateWrapper>
  );
};
