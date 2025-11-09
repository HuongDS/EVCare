import { Select } from "antd";
import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background: #fafafa;
  * {
    font-family: "Outfit", sans-serif;
  }
`;

export const HeaderSection = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  padding: 2rem;
`;

export const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  color: #1a1a1a;

  svg {
    color: #595959;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

export const StatCard = styled.div`
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d9d9d9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

export const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #8c8c8c;
  font-weight: 500;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1;
`;

export const StatSubtext = styled.div`
  font-size: 0.8rem;
  color: #8c8c8c;
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

export const FilterBar = styled.div`
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  .filter-icon {
    color: #8c8c8c;
  }
`;

export const StyledSelect = styled(Select)`
  min-width: 220px;

  .ant-select-selector {
    border: 1px solid #d9d9d9 !important;
    border-radius: 6px !important;
    height: 40px !important;
    padding: 0 12px !important;

    &:hover {
      border-color: #262626 !important;
    }
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #262626 !important;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.06) !important;
  }
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #8c8c8c;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  svg {
    opacity: 0.3;
    margin-bottom: 1rem;
  }

  h3 {
    color: #595959;
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #8c8c8c;
    margin: 0;
  }
`;

export const TableWrapper = styled.div`
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 1.5rem;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  th,
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  th {
    background: #fafafa;
    color: #595959;
    font-weight: 600;
    font-size: 0.9rem;
  }

  td {
    font-size: 0.9rem;
    color: #1a1a1a;
    vertical-align: middle;
  }

  tr.low-stock {
    background: #fff2f0;
  }

  tr:hover {
    background: #fafafa;
  }

  button {
    height: 36px;
    border-radius: 6px;
    font-weight: 500;
  }
`;
