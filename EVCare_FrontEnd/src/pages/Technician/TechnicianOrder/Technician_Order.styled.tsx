import styled from "styled-components";
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Outfit", sans-serif;
  background: #f9fafb;
  min-height: 100vh;
`;
export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;
export const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin: 2rem 0 1.5rem 0;
  color: #222;
`;

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 0 5%;
  margin-bottom: 40px;
  align-items: stretch;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 0;
  border-top: 1px solid #e5e7eb;
  background: #fff;
  margin-top: auto;
`;
