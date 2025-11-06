import { useState } from "react";
import styled from "styled-components";
import {
  Table,
  Input,
  Select,
  Tag,
  Card,
  Statistic,
  Row,
  Col,
  Popover,
  Typography,
  InputNumber,
  message as antMessage,
} from "antd";
import {
  Search,
  AlertCircle,
  Package,
  TrendingUp,
  ShoppingCart,
  Calendar,
  Send,
} from "lucide-react";
import { useGetPredictedParts } from "../../../services/staffService";
import type { AIPredictionItems } from "../../../models/Inventory/InventoryModel";
import ColorSpinner from "../StaffComponents/ColorSpinner";
import BackButton from "../../../components/Button/BackButton";
import ShowButton from "../../../components/Button/ShowButton";
import UpdatePartModal from "./UpdatePartModal";

const { Title, Paragraph, Text } = Typography;

interface Props {
  onBack: () => void;
}

export default function StockPredictionTable({ onBack }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "need" | "safe">(
    "all"
  );
  const [leadDate, setLeadDate] = useState<number>();
  const [predictionDate, setPredictionDate] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);

  const { data: predictedParts, isFetching } = useGetPredictedParts({
    ...((predictionDate !== 0 && { LeadDate: predictionDate }) || {}),
  });

  // Handle AI prediction
  const handlePredict = async () => {
    if (!leadDate || leadDate < 1 || leadDate > 365) {
      antMessage.error("Please enter a valid number of days (1-365)");
      return;
    }
    setPredictionDate(leadDate);
  };

  // Filter data based on search and status
  const filteredData =
    predictedParts?.data?.items.filter((item) => {
      const matchSearch = item.partName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "need"
          ? item.needQuantity > 0
          : item.needQuantity === 0;

      return matchSearch && matchStatus;
    }) || [];

  // Calculate summary statistics
  const totalParts = predictedParts?.data?.totalItems || 0;
  const partsNeedingRestock =
    predictedParts?.data?.items.filter((item) => item.needQuantity > 0)
      .length || 0;
  const totalQuantityNeeded =
    predictedParts?.data?.items.reduce(
      (sum, item) => sum + item.needQuantity,
      0
    ) || 0;
  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <BackButton action={onBack} />
          </div>

          <HeaderText>
            <Title
              level={2}
              style={{ margin: 0, color: "#00ad4e", fontFamily: "Outfit" }}
            >
              AI Stock Prediction
            </Title>
            <Paragraph
              style={{ margin: 0, color: "#666", fontFamily: "Outfit" }}
            >
              AI-powered inventory forecasting and recommendations
            </Paragraph>
          </HeaderText>
        </Header>

        <ForecastSection>
          <ForecastCard>
            <ForecastLabel style={{ fontFamily: "Outfit" }}>
              <Calendar size={20} />
              Forecast Period (Days)
            </ForecastLabel>
            <ForecastControls>
              <StyledInputNumber
                min={1}
                max={365}
                value={leadDate}
                onChange={(value) => setLeadDate(Number(value))}
                placeholder="Enter days"
              />
              <PredictButton onClick={handlePredict} disabled={isFetching}>
                <Send size={20} />
                {isFetching ? "Predicting..." : "Predict"}
              </PredictButton>
            </ForecastControls>
            <ForecastHint style={{ fontFamily: "Outfit" }}>
              Enter number of days to forecast (1-365)
            </ForecastHint>
          </ForecastCard>
        </ForecastSection>

        {isFetching ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ColorSpinner />
          </div>
        ) : (
          predictedParts?.data?.items && (
            <>
              <SummarySection>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <StyledCard>
                      <Statistic
                        title="Total Parts"
                        value={totalParts}
                        prefix={<Package size={24} color="#00ad4e" />}
                        valueStyle={{
                          color: "#333",
                          fontWeight: 700,
                          fontFamily: "Outfit",
                        }}
                        style={{ fontFamily: "Outfit" }}
                      />
                    </StyledCard>
                  </Col>
                  <Col xs={24} sm={8}>
                    <StyledCard>
                      <Statistic
                        title="Need Restock"
                        value={partsNeedingRestock}
                        prefix={<AlertCircle size={24} color="#ff4d4f" />}
                        valueStyle={{
                          color: "#ff4d4f",
                          fontWeight: 700,
                          fontFamily: "Outfit",
                        }}
                        style={{ fontFamily: "Outfit" }}
                      />
                    </StyledCard>
                  </Col>
                  <Col xs={24} sm={8}>
                    <StyledCard>
                      <Statistic
                        title="Total Quantity Needed"
                        value={totalQuantityNeeded}
                        prefix={<ShoppingCart size={24} color="#1890ff" />}
                        valueStyle={{
                          color: "#1890ff",
                          fontWeight: 700,
                          fontFamily: "Outfit",
                        }}
                        style={{ fontFamily: "Outfit" }}
                      />
                    </StyledCard>
                  </Col>
                </Row>
              </SummarySection>

              <FilterSection>
                <SearchInput
                  placeholder="Search by part name..."
                  prefix={<Search size={20} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  allowClear
                />
                <FilterSelect
                  value={filterStatus}
                  onChange={(e: any) => setFilterStatus(e)}
                  options={[
                    { label: "All Parts", value: "all" },
                    { label: "Need Refill", value: "need" },
                    { label: "Safe Stock", value: "safe" },
                  ]}
                />
              </FilterSection>

              <TableCard>
                <Table
                  dataSource={filteredData}
                  rowKey="partId"
                  loading={isFetching}
                  scroll={{ x: 1000 }}
                >
                  <Table.Column
                    title="Part ID"
                    dataIndex="partId"
                    key="partId"
                    width={100}
                    sorter={(a: AIPredictionItems, b: AIPredictionItems) =>
                      a.partId - b.partId
                    }
                  />

                  <Table.Column
                    title="Part Name"
                    dataIndex="partName"
                    key="partName"
                    sorter={(a: AIPredictionItems, b: AIPredictionItems) =>
                      a.partName.localeCompare(b.partName)
                    }
                    render={(text: string) => <PartName>{text}</PartName>}
                    width={140}
                  />

                  <Table.Column
                    title="Min Stock"
                    dataIndex="minStock"
                    key="minStock"
                    width={120}
                    align="center"
                    sorter={(a: AIPredictionItems, b: AIPredictionItems) =>
                      a.minStock - b.minStock
                    }
                  />

                  <Table.Column
                    title="Need Quantity"
                    dataIndex="needQuantity"
                    key="needQuantity"
                    width={140}
                    align="center"
                    sorter={(a: AIPredictionItems, b: AIPredictionItems) =>
                      a.needQuantity - b.needQuantity
                    }
                    render={(quantity: number) => (
                      <QuantityText $needRefill={quantity > 0}>
                        {quantity}
                      </QuantityText>
                    )}
                  />

                  <Table.Column
                    title="Status"
                    key="status"
                    width={140}
                    align="center"
                    filters={[
                      { text: "Need Refill", value: "need" },
                      { text: "Safe", value: "safe" },
                    ]}
                    onFilter={(value, record: AIPredictionItems) =>
                      value === "need"
                        ? record.needQuantity > 0
                        : record.needQuantity === 0
                    }
                    render={(_, record: AIPredictionItems) =>
                      record.needQuantity > 0 ? (
                        <Tag color="error">Need Refill</Tag>
                      ) : (
                        <Tag color="success">Safe</Tag>
                      )
                    }
                  />

                  <Table.Column
                    title="Reason"
                    key="reason"
                    width={120}
                    align="center"
                    render={(_, record: AIPredictionItems) => (
                      <Popover
                        content={<ReasonContent>{record.reason}</ReasonContent>}
                        title={<Text strong>Stock Analysis</Text>}
                        trigger="click"
                      >
                        <ViewReasonButton>View Details</ViewReasonButton>
                      </Popover>
                    )}
                  />

                  <Table.Column
                    title="Action"
                    key="action"
                    width={120}
                    align="center"
                    render={(_, record: AIPredictionItems) =>
                      record.needQuantity > 0 && (
                        <ShowButton
                          text="Update"
                          onclick={() => setIsOpen(true)}
                          height="30px"
                        />
                      )
                    }
                  />
                </Table>
              </TableCard>
            </>
          )
        )}

        {isOpen && <UpdatePartModal isOpen={isOpen} setIsOpen={setIsOpen} />}

        {!predictedParts?.data && !isFetching && (
          <EmptyState>
            <TrendingUp size={64} opacity={0.3} />
            <EmptyText>
              Enter forecast days and click Predict to see AI predictions
            </EmptyText>
          </EmptyState>
        )}
      </ContentWrapper>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 32px 20px;
  font-family: "Outfit", sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  background: white;
  padding: 24px 28px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeaderText = styled.div`
  flex: 1;
`;

const ForecastSection = styled.div`
  margin-bottom: 24px;
`;

const ForecastCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #00ad4e;
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e9 100%);
`;

const ForecastLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #00ad4e;
  margin-bottom: 16px;
`;

const ForecastControls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledInputNumber = styled(InputNumber)`
  flex: 1;

  .ant-input-number-input {
    font-family: "Outfit", sans-serif;
    font-size: 16px;
    font-weight: 600;
    height: 48px;
  }

  &.ant-input-number {
    border-radius: 10px;
    border: 2px solid #e0e0e0;
  }

  &.ant-input-number-focused {
    border-color: #00ad4e;
  }
`;

const PredictButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 32px;
  height: 48px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
  min-width: 150px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const ForecastHint = styled.div`
  font-size: 13px;
  color: #666;
  font-style: italic;
`;

const SummarySection = styled.div`
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e8f5e9;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.15);
  }

  .ant-statistic-title {
    font-size: 14px;
    font-weight: 600;
    color: #666;
  }

  .ant-statistic-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled(Input)`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  font-family: "Outfit", sans-serif;

  &:focus,
  &:hover {
    border-color: #00ad4e;
  }

  .ant-input {
    font-family: "Outfit", sans-serif;
  }
`;

const FilterSelect = styled(Select)`
  width: 200px;
  height: 44px;

  .ant-select-selector {
    height: 44px !important;
    border-radius: 10px !important;
    border: 2px solid #e0e0e0 !important;
    font-family: "Outfit", sans-serif;
    display: flex;
    align-items: center;
  }

  &:hover .ant-select-selector,
  &.ant-select-focused .ant-select-selector {
    border-color: #00ad4e !important;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TableCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;

  .ant-table-thead > tr > th {
    background: #f8fdf9;
    font-weight: 700;
    color: #333;
    font-family: "Outfit", sans-serif;
    border-bottom: 2px solid #e8f5e9;
  }

  .ant-table-tbody > tr {
    font-family: "Outfit", sans-serif;
    transition: all 0.3s ease;
  }

  .ant-table-tbody > tr:hover {
    background: #f8fdf9;
  }

  .ant-tag {
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 6px;
  }
`;

const PartName = styled.span`
  font-weight: 600;
  color: #333;
`;

const QuantityText = styled.span<{ $needRefill: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => (props.$needRefill ? "#ff4d4f" : "#52c41a")};
`;

const ViewReasonButton = styled.button`
  width: fit-content;
  padding: 3px 5px;
  background: #00ad4e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #00c853;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 173, 78, 0.3);
  }
`;

const ReasonContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  font-family: "Outfit", sans-serif;
  max-width: 400px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 80px 40px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  svg {
    margin-bottom: 20px;
    color: #00ad4e;
  }
`;

const EmptyText = styled.div`
  font-size: 16px;
  color: #666;
  font-weight: 500;
`;
