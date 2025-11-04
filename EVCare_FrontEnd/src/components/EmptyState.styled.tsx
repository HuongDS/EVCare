import styled from "styled-components";

export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: 200px;
  text-align: center;
  background-color: #fff;
  border-radius: 12px;

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

  .empty-icon-wrapper .anticon {
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
    max-width: 350px;
  }
`;
