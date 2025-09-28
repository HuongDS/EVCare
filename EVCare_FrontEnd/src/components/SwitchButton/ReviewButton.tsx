import styled from "styled-components";

type ReviewButtonProps = {
  status: number;
};

const enumStatus: Record<number, string> = {
  1: "Pending",
  2: "Confirmed",
  3: "Checked In",
  4: "In Progress",
  5: "Done",
  6: "Cancelled",
};

const checkStatus = (status: number) => {
  return enumStatus[status] || "Unknown";
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return "#ff9800";
    case 2:
      return "#2196f3";
    case 3:
      return "#9c27b0";
    case 4:
      return "#ffc107";
    case 5:
      return "#4caf50";
    case 6:
      return "#f44336";
    default:
      return "#9e9e9e";
  }
};

const StatusButton = styled.button<{ status: number }>`
  width: 100px;
  max-height: 40px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ status }) => getStatusColor(status)};
`;

export default function ReviewButton({ status }: ReviewButtonProps) {
  return <StatusButton status={status}>{checkStatus(status)}</StatusButton>;
}
