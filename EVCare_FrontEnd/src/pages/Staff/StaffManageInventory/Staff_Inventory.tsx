import { useState } from "react";
import { Select, Typography } from "antd";
import { Package, AlertCircle, ChartCandlestick, Sparkles } from "lucide-react";
import {
  useExportInventoryToExcel,
  useGetAllPartCategories,
  useGetInventoryValue,
  useGetLowStocks,
  useGetParts,
} from "../../../services/staffService";
import SearchBar from "../../../components/SearchBar/Search";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { DownloadButton } from "../../../components/Button/DownloadButton";
import UpdatePartModal from "./UpdatePartModal";
import type { PartDetailDto } from "../../../models/PartModel/PartModel";
import ShowButton from "../../../components/Button/ShowButton";
import { Pagination } from "../../../components/Paginations/Pagination";
import StockPredictionTable from "./AIPrediction";
import ColorSpinner from "../StaffComponents/ColorSpinner";

const { Text } = Typography;

const Staff_Inventory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedPart, setSelectedPart] = useState<PartDetailDto | undefined>();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [aiPage, setAiPage] = useState(false);

  const { data: partCategories } = useGetAllPartCategories({});
  const { data: parts, isLoading } = useGetParts({
    ...((searchValue && { partName: searchValue }) || {}),
    ...((selectedCategory && {
      CategoryIds: [selectedCategory],
    }) ||
      {}),
    pageIndex: currentPage,
    pageSize: pageSize,
  });
  const { mutate: exportToExcel, isPending } = useExportInventoryToExcel();
  const { data: inventoryValue } = useGetInventoryValue();
  const { data: lowStocks } = useGetLowStocks();

  const filteredParts = parts?.data?.items ?? [];

  // console.log(parts?.data?.items);

  const categoryOptions = [
    { label: "All Categories", value: null },
    ...(partCategories?.data?.items?.map((c) => ({
      label: c.name,
      value: c.id,
    })) ?? []),
  ];

  const onSelectPageSize = (value: any) => {
    setPageSize(value);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilter = (value: number | null) => {
    setSelectedCategory(value === null ? null : Number(value));
    setCurrentPage(1);
  };

  if (aiPage) {
    return <StockPredictionTable onBack={() => setAiPage(false)} />;
  } else {
    return (
      <Container>
        <HeaderSection>
          <HeaderContent>
            <TitleRow>
              <Title>
                <Package size={28} />
                Inventory Management
                <ShowButton
                  text="AI Prediction"
                  onclick={() => setAiPage(true)}
                  height="40px"
                  icon={<Sparkles color="#00ad4e" />}
                />
              </Title>
              {isPending ? <ColorSpinner /> : <DownloadButton action={() => exportToExcel()} text="Export to Excel" />}
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
                  <StatIcon $color={Number(lowStocks?.data?.length) > 0 ? "#fff1f0" : "#f6ffed"}>
                    <AlertCircle size={20} />
                  </StatIcon>
                </StatHeader>
                <StatValue
                  style={{
                    color: Number(lowStocks?.data?.length) > 0 ? "#cf1322" : "#1a1a1a",
                  }}
                >
                  {lowStocks?.data?.length}
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
                <StatValue style={{ fontSize: "1.5rem" }}>{inventoryValue?.toLocaleString("vi-VN")}đ</StatValue>
                <StatSubtext>Total stock value</StatSubtext>
              </StatCard>
            </StatsGrid>
          </HeaderContent>
        </HeaderSection>

        <ContentWrapper>
          <FilterBar>
            <SearchBar handleSearchValue={handleSearch} searchValue={searchValue} placeholder="Search part..." />
            <StyledSelect
              options={categoryOptions}
              placeholder="Filter by Category"
              value={selectedCategory ? selectedCategory : "All Categories"}
              onChange={(v) => handleFilter(Number(v))}
              style={{
                height: "44px",
              }}
            />
            <Text style={{ marginLeft: "auto", color: "#8c8c8c" }}>
              Showing{" "}
              <Select
                onChange={onSelectPageSize}
                defaultValue={10}
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
                    <th style={{ display: "flex", justifyContent: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParts.map((part) => {
                    const category =
                      partCategories?.data?.items.find((c) => c.id === part.categoryId)?.name || "Uncategorized";

                    return (
                      <tr key={part.id} className={part.quantity < 10 ? "low-stock" : ""}>
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
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
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

        {isOpen && <UpdatePartModal isOpen={isOpen} setIsOpen={setIsOpen} part={selectedPart} />}
      </Container>
    );
  }
};

export default Staff_Inventory;

import {
  Container,
  ContentWrapper,
  EmptyState,
  FilterBar,
  HeaderContent,
  HeaderSection,
  StatCard,
  StatHeader,
  StatIcon,
  StatLabel,
  StatSubtext,
  StatValue,
  StatsGrid,
  StyledSelect,
  TableWrapper,
  Title,
  TitleRow,
} from "./styles/Staff_Inventory.styled";
