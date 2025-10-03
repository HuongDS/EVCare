import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Outfit", sans-serif;
  background: #f9fafb;
`;

export const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin: 2rem 0 1.5rem 0;
  color: #222;
`;

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  padding: 0 5%;
  margin-bottom: 40px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 0;
  border-top: 1px solid #e5e7eb;
  background: #fff;
`;
