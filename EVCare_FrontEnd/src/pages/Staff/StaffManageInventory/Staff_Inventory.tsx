import { useEffect, useState } from "react";
import styled from "styled-components";
import { InputNumber, Select, Button, Card, Typography } from "antd";
import {
  Package,
  Save,
  Filter,
  AlertCircle,
  ChartCandlestick,
} from "lucide-react";
import {
  useExportInventoryToExcel,
  useGetAllPartCategories,
  useGetParts,
} from "../../../services/staffService";
import SearchBar from "../../../components/SearchBar/Search";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { DownloadButton } from "../../../components/Button/DownloadButton";

const { Text } = Typography;

// ====== Styled Components ======

const Staff_Inventory = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [newQuantities, setNewQuantities] = useState<Record<number, number>>(
    {}
  );

  const [total, setTotal] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const { data: partCategories } = useGetAllPartCategories({});
  const { data: parts, isLoading } = useGetParts({
    ...((searchValue && { partName: searchValue }) || {}),
  });

  const handleQuantityChange = (id: number, value: number | null) => {
    if (value === null) {
      const { [id]: _, ...rest } = newQuantities;
      setNewQuantities(rest);
    } else {
      setNewQuantities((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSave = (id: number) => {
    const newQuantity = newQuantities[id];
    if (newQuantity === undefined) return;
    console.log("Saving quantity:", { id, quantity: newQuantity });
    const { [id]: _, ...rest } = newQuantities;
    setNewQuantities(rest);
  };

  const filteredParts =
    (selectedCategory
      ? parts?.data?.items?.filter((p) => p.categoryId === selectedCategory)
      : parts?.data?.items) ?? [];

  const categoryOptions = [
    { label: "All Categories", value: null },
    ...(partCategories?.data?.items?.map((c) => ({
      label: c.name,
      value: c.id,
    })) ?? []),
  ];

  useEffect(() => {
    const totalParts = parts?.data?.items?.length;
    const lowStockItems = parts?.data?.items?.filter(
      (p) => p.quantity < 10
    ).length;
    const totalValue = parts?.data?.items?.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    setTotal(totalParts ?? 0);
    setLowStockItems(lowStockItems ?? 0);
    setTotalValue(totalValue ?? 0);
  }, []);

  const { mutate: exportToExcel, isPending } = useExportInventoryToExcel();

  return (
    <Container>
      <HeaderSection>
        <HeaderContent>
          <TitleRow>
            <Title>
              <Package size={28} />
              Inventory Management
            </Title>
            {isPending ? (
              <SpinnerComponent />
            ) : (
              <DownloadButton
                action={() => exportToExcel()}
                text="Export to Excel"
              />
            )}
          </TitleRow>
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatLabel>Total Items</StatLabel>
                <StatIcon $color="#e8e8e8">
                  <Package size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>{total}</StatValue>
              <StatSubtext>Parts in inventory</StatSubtext>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatLabel>Low Stock Alert</StatLabel>
                <StatIcon $color={lowStockItems > 0 ? "#fff1f0" : "#f6ffed"}>
                  <AlertCircle size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue
                style={{ color: lowStockItems > 0 ? "#cf1322" : "#1a1a1a" }}
              >
                {lowStockItems}
              </StatValue>
              <StatSubtext>Items below threshold</StatSubtext>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatLabel>Inventory Value</StatLabel>
                <StatIcon $color="#e8e8e8">
                  <ChartCandlestick size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue style={{ fontSize: "1.5rem" }}>
                {totalValue.toLocaleString("vi-VN")}đ
              </StatValue>
              <StatSubtext>Total stock value</StatSubtext>
            </StatCard>
          </StatsGrid>
        </HeaderContent>
      </HeaderSection>

      <ContentWrapper>
        <FilterBar>
          <SearchBar
            handleSearchValue={setSearchValue}
            searchValue={searchValue}
            placeholder="Search part..."
          />
          <Filter size={20} className="filter-icon" />
          <StyledSelect
            options={categoryOptions}
            placeholder="Filter by Category"
            value={selectedCategory}
            onChange={(v) => setSelectedCategory(Number(v))}
          />
          <Text style={{ marginLeft: "auto", color: "#8c8c8c" }}>
            Showing {filteredParts.length} of {total} items
          </Text>
        </FilterBar>

        {isLoading ? (
          <SpinnerComponent />
        ) : (
          <PartsGrid>
            {filteredParts.length > 0 ? (
              filteredParts.map((part) => (
                <PartCard key={part.id}>
                  <ImageWrapper>
                    <PartImage src={part.imageUrl} alt={part.name} />
                    <StockBadge $lowStock={part.quantity < 10}>
                      {part.quantity < 10 ? "Low Stock" : "In Stock"}
                    </StockBadge>
                  </ImageWrapper>

                  <CardContent>
                    <CategoryLabel>
                      {partCategories?.data?.items.find(
                        (c) => c.id === part.categoryId
                      )?.name || "Uncategorized"}
                    </CategoryLabel>
                    <PartName>{part.name}</PartName>

                    <PriceRow>
                      <PriceLabel>Unit Price</PriceLabel>
                      <Price>{part.price.toLocaleString("vi-VN")}đ</Price>
                    </PriceRow>

                    <QuantitySection>
                      <CurrentQuantity>
                        <span className="label">Current Stock</span>
                        <span className="value">{part.quantity}</span>
                      </CurrentQuantity>

                      <NewQuantityRow>
                        <QuantityLabel>New Stock</QuantityLabel>
                        <StyledInputNumber
                          min={0}
                          type="number"
                          value={newQuantities[part.id]}
                          placeholder="Enter new quantity"
                          onChange={(value) =>
                            handleQuantityChange(part.id, Number(value))
                          }
                        />
                        <SaveButton
                          icon={<Save size={16} />}
                          onClick={() => handleSave(part.id)}
                          disabled={newQuantities[part.id] === undefined}
                        >
                          Save
                        </SaveButton>
                      </NewQuantityRow>
                    </QuantitySection>
                  </CardContent>
                </PartCard>
              ))
            ) : (
              <EmptyState>
                <Package size={64} />
                <h3>No items found</h3>
                <p>Try adjusting your filters or check back later</p>
              </EmptyState>
            )}
          </PartsGrid>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default Staff_Inventory;

const Container = styled.div`
  min-height: 100vh;
  background: #fafafa;
  * {
    font-family: "Outfit", sans-serif;
  }
`;

const HeaderSection = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  padding: 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
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

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #8c8c8c;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1;
`;

const StatSubtext = styled.div`
  font-size: 0.8rem;
  color: #8c8c8c;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const FilterBar = styled.div`
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

const StyledSelect = styled(Select)`
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

const PartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PartCard = styled(Card)`
  border: 1px solid #e8e8e8 !important;
  border-radius: 8px !important;
  overflow: hidden;
  transition: all 0.25s ease;
  background: white;

  &:hover {
    border-color: #262626 !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .ant-card-body {
    padding: 0;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: #f5f5f5;
  overflow: hidden;
`;

const PartImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StockBadge = styled.div<{ $lowStock: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${({ $lowStock }) => ($lowStock ? "#fff1f0" : "#f6ffed")};
  border: 1px solid ${({ $lowStock }) => ($lowStock ? "#ffa39e" : "#b7eb8f")};
  color: ${({ $lowStock }) => ($lowStock ? "#cf1322" : "#389e0d")};
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const CardContent = styled.div`
  padding: 1.25rem;
`;

const CategoryLabel = styled.div`
  font-size: 0.8rem;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const PartName = styled.h3`
  font-size: 1.125rem;
  margin: 0 0 1rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const PriceLabel = styled.div`
  font-size: 0.875rem;
  color: #8c8c8c;
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const QuantitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CurrentQuantity = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e8e8e8;

  .label {
    font-size: 0.875rem;
    color: #595959;
    font-weight: 500;
  }

  .value {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
  }
`;

const NewQuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const QuantityLabel = styled.div`
  font-size: 0.875rem;
  color: #595959;
  font-weight: 500;
  white-space: nowrap;
`;

const StyledInputNumber = styled(InputNumber)`
  flex: 1;

  .ant-input-number-input {
    height: 40px;
    font-size: 1rem;
    text-align: center;
  }

  &.ant-input-number {
    border: 1px solid #d9d9d9;
    border-radius: 6px;

    &:hover {
      border-color: #262626;
    }

    &.ant-input-number-focused {
      border-color: #262626;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.06);
    }
  }
`;

const SaveButton = styled(Button)`
  height: 40px;
  border-radius: 6px;
  background: #1a1a1a;
  border: none;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.25rem;

  &:hover:not(:disabled) {
    background: #262626 !important;
    color: white !important;
  }

  &:active:not(:disabled) {
    background: #000000 !important;
  }

  &:disabled {
    background: #f5f5f5 !important;
    color: #bfbfbf !important;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
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
