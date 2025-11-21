import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const InvoiceWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

export const InvoiceContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const InvoiceHeader = styled.div`
  background: linear-gradient(135deg, #3d8c63 0%, #00ab66 100%);
  color: white;
  padding: 32px 40px;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const CompanyInfo = styled.div`
  h1 {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  p {
    margin: 4px 0;
    opacity: 0.9;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 26px;
    }
  }
`;

export const InvoiceInfo = styled.div`
  text-align: right;

  h2 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  p {
    margin: 4px 0;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    text-align: left;

    h2 {
      font-size: 24px;
    }
  }
`;

export const InvoiceId = styled.div`
  font-size: 18px;
  font-weight: 600;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  display: inline-block;
`;

export const InvoiceBody = styled.div`
  padding: 32px 40px;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

export const CustomerSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const InfoCard = styled.div``;

export const CardTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;

  svg {
    color: #666;
    flex-shrink: 0;
  }

  strong {
    font-weight: 600;
    color: #000;
  }
`;

export const TableSection = styled.div`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h3`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 0 16px 0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeaderOrder = styled.thead`
  background: #f5f5f5;

  th {
    padding: 12px;
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.6px;

    &:nth-child(2) {
      text-align: left;
    }
    &:nth-child(3) {
      text-align: center;
    }
    &:nth-child(4),
    &:nth-child(5) {
      text-align: right;
    }
    &:nth-child(6) {
      text-align: right;
    }
  }

  @media (max-width: 768px) {
    th {
      padding: 10px 8px;
      font-size: 12px;
    }
  }
`;

export const TableBodyOrder = styled.tbody`
  tr {
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 14px 12px;
    font-size: 14px;
    color: #333;
    font-weight: 600;

    &:nth-child(2) {
      text-align: left;
    }

    &:nth-child(3) {
      text-align: center;
    }

    &:nth-child(4),
    &:nth-child(5) {
      text-align: right;
    }
    &:nth-child(6) {
      text-align: right;
    }
  }

  @media (max-width: 768px) {
    td {
      padding: 12px 8px;
      font-size: 13px;
    }
  }
`;

export const TableHeader = styled.thead`
  background: #f5f5f5;

  th {
    padding: 12px;
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:nth-child(2) {
      text-align: center;
    }

    &:nth-child(3),
    &:nth-child(4) {
      text-align: right;
    }

    &:nth-child(5) {
      text-align: right;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 5px;
    }
  }

  @media (max-width: 768px) {
    th {
      padding: 10px 8px;
      font-size: 12px;
    }
  }
`;

export const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 14px 12px;
    font-size: 14px;
    color: #333;
    font-weight: 600;

    &:nth-child(2) {
      text-align: center;
    }

    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5) {
      text-align: right;
    }
  }

  @media (max-width: 768px) {
    td {
      padding: 12px 8px;
      font-size: 13px;
    }
  }
`;

export const SummarySection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const SummaryCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const SummaryRow = styled.div<{ $isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: ${(props) => (props.$isTotal ? "18px" : "15px")};
  font-weight: ${(props) => (props.$isTotal ? "700" : "500")};
  color: ${(props) => (props.$isTotal ? "#000" : "#333")};

  ${(props) =>
    props.$isTotal &&
    `
    border-top: 2px solid #000;
    margin-top: 8px;
    padding-top: 16px;
  `}

  @media (max-width: 768px) {
    font-size: ${(props) => (props.$isTotal ? "16px" : "14px")};
  }
`;

export const PaymentBadge = styled.div<{ $method: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-top: 12px;

  ${(props) =>
    props.$method === "Cash"
      ? `
    background: #e8f5e9;
    color: #2e7d32;
  `
      : `
    background: #e3f2fd;
    color: #1565c0;
  `}
`;

export const InvoiceFooter = styled.div`
  padding: 24px 40px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  text-align: center;

  p {
    margin: 4px 0;
    font-size: 13px;
    color: #666;
  }

  strong {
    color: #000;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const SpinStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
`;
