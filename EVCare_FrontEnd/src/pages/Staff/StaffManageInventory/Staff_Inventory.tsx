import { useMemo, useState } from "react";
import styled from "styled-components";
import { Select, Typography } from "antd";
import { Package, AlertCircle, ChartCandlestick } from "lucide-react";
import {
  useExportInventoryToExcel,
  useGetAllPartCategories,
  useGetParts,
} from "../../../services/staffService";
import SearchBar from "../../../components/SearchBar/Search";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { DownloadButton } from "../../../components/Button/DownloadButton";
import UpdatePartModal from "./UpdatePartModal";
import type { PartDetailDto } from "../../../models/PartModel/PartModel";
import ShowButton from "../../../components/Button/ShowButton";
import { Pagination } from "../../../components/Paginations/Pagination";

const { Text } = Typography;

const Staff_Inventory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedPart, setSelectedPart] = useState<PartDetailDto | undefined>();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>();

  const { data: partCategories } = useGetAllPartCategories({});
  const { data: parts, isLoading } = useGetParts({
    ...((searchValue && { partName: searchValue }) || {}),
    categoryId: selectedCategory ? [selectedCategory] : [],
    pageIndex: currentPage,
    pageSize: pageSize,
  });
  const { mutate: exportToExcel, isPending } = useExportInventoryToExcel();

  const filteredParts = parts?.data?.items ?? [];

  const categoryOptions = [
    { label: "All Categories", value: null },
    ...(partCategories?.data?.items?.map((c) => ({
      label: c.name,
      value: c.id,
    })) ?? []),
  ];

  const { lowStockItems, totalValue } = useMemo(() => {
    const items = parts?.data?.items ?? [];

    const total = items.length;
    const lowStockItems = items.filter((p) => p.quantity < 10).length;
    const totalValue = items.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return { total, lowStockItems, totalValue };
  }, [parts]);

  const onSelectPageSize = (value: any) => {
    setPageSize(value);
  };

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
              <StatValue>{parts?.data?.totalItems}</StatValue>
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
          <StyledSelect
            options={categoryOptions}
            placeholder="Filter by Category"
            value={selectedCategory}
            onChange={(v) => setSelectedCategory(v === null ? null : Number(v))}
            style={{
              height: "44px",
            }}
          />
          <Text style={{ marginLeft: "auto", color: "#8c8c8c" }}>
            Showing{" "}
            <Select
              onChange={onSelectPageSize}
              defaultValue={parts?.data?.totalItems}
              options={[
                { value: "5", label: <span>5</span> },
                { value: "10", label: <span>10</span> },
                { value: "20", label: <span>20</span> },
              ]}
              style={{ width: "60px", margin: "0 5px" }}
            />
            items
          </Text>
        </FilterBar>

        {isLoading ? (
          <SpinnerComponent />
        ) : filteredParts.length > 0 ? (
          <TableWrapper>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Part Name</th>
                  <th>Category</th>
                  <th>Unit Price (đ)</th>
                  <th>Stock</th>
                  <th style={{ display: "flex", justifyContent: "center" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredParts.map((part) => {
                  const category =
                    partCategories?.data?.items.find(
                      (c) => c.id === part.categoryId
                    )?.name || "Uncategorized";

                  return (
                    <tr
                      key={part.id}
                      className={part.quantity < 10 ? "low-stock" : ""}
                    >
                      <td>
                        <img
                          src={part.imageUrl}
                          alt={part.name}
                          width={60}
                          height={60}
                          style={{
                            borderRadius: "6px",
                            objectFit: "cover",
                            width: "60px",
                            height: "60px",
                          }}
                        />
                      </td>
                      <td>{part.name}</td>
                      <td>{category}</td>
                      <td>{part.price.toLocaleString("vi-VN")}</td>
                      <td
                        style={{
                          color: part.quantity < 10 ? "#cf1322" : "#1a1a1a",
                          fontWeight: 500,
                        }}
                      >
                        {part.quantity}
                      </td>
                      <td>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <ShowButton
                            text="Update"
                            onclick={() => {
                              setIsOpen(true);
                              setSelectedPart(part);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              totalPage={parts?.data?.totalPages || 0}
              totalItems={parts?.data?.totalItems || 0}
              pageIndex={currentPage}
              pageSize={5}
              onPageChange={setCurrentPage}
            />
          </TableWrapper>
        ) : (
          <EmptyState>
            <Package size={64} />
            <h3>No items found</h3>
            <p>Try adjusting your filters or check back later</p>
          </EmptyState>
        )}
      </ContentWrapper>

      {isOpen && (
        <UpdatePartModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          part={selectedPart}
        />
      )}
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

const TableWrapper = styled.div`
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
