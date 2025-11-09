import { useState } from "react";
import {
  Table,
  Tag,
  Statistic,
  Row,
  Col,
  Popover,
  Typography,
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
            <ColorSpinner width="6em" height="6em" />
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

import {
  ContentWrapper,
  EmptyState,
  EmptyText,
  FilterSection,
  FilterSelect,
  ForecastCard,
  ForecastControls,
  ForecastHint,
  ForecastLabel,
  ForecastSection,
  Header,
  HeaderText,
  PageContainer,
  PartName,
  PredictButton,
  QuantityText,
  ReasonContent,
  SearchInput,
  StyledCard,
  StyledInputNumber,
  SummarySection,
  TableCard,
  ViewReasonButton,
} from "./styles/AIPrediction.styled";
