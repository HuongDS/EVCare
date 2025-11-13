import {
  ArrowLeft,
  ShoppingCart,
  Search,
  Package,
  LayoutGrid,
} from "lucide-react";
import { useState, useEffect } from "react";
import ProductCard from "../Technician_Component/ProductCard";
import ProductModal from "../Technician_Component/ProductModal";
import CartModal from "../Technician_Component/CartModal";
import { useTechnicianOrder } from "../../../hooks/useTechnicianOrder";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";
import {
  BackButton,
  CardGrid,
  CartBadge,
  CartButton,
  ContentWrapper,
  EmptyHint,
  EmptyState,
  EmptyText,
  Header,
  HeaderContent,
  HeaderIcon,
  HeaderText,
  PageContainer,
  PaginationWrapper,
  SearchIcon,
  SearchInput,
  SearchWrapper,
  Subtitle,
  Title,
  Overlay,
  ServiceToggleButton,
  SidebarHeader,
  SidebarWrapper,
  ServiceList,
  ServiceItem,
  LoadingSpinner,
} from "./Technician_Order.styled";

import { Pagination } from "../../../components/Paginations/Pagination";

interface Service {
  serviceId: number;
  serviceName: string;
}

const mockServices: Service[] = [
  { serviceId: 12, serviceName: "Battery Module Replacement" },
  { serviceId: 14, serviceName: "Brake Regeneration Calibration" },
  { serviceId: 16, serviceName: "Gearbox / Gear Shift Check" },
  { serviceId: 17, serviceName: "Body Panel Repair / Replacement" },
  { serviceId: 18, serviceName: "Charging Port Inspection" },
];

const fetchServices = (): Promise<Service[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockServices);
    }, 300);
  });
};

interface TechnicianOrderProps {
  propOrderId?: number;
  onPartsUpdated?: (orderId: number) => void;
  selectedCategory?: string;
  setIsOrder: (v: boolean) => void;
}

export default function TechnicianOrder({
  propOrderId,
  onPartsUpdated,
  selectedCategory,
  setIsOrder,
}: TechnicianOrderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [currentCategory, setCurrentCategory] = useState(selectedCategory);

  const {
    cart,
    displayParts,
    page,
    searchQuery,
    isLoading,
    isSending,
    pageSize,
    open,
    selectedPart,
    cartOpen,
    totalItems,
    totalPages,
    handleAddToCart,
    handleRemoveFromCart,
    handleSendCart,
    handleOpenProductModal,
    handleCloseProductModal,
    handleOpenCart,
    handleCloseCart,
    handlePageChange,
    handleSearchChange,
    handleCartQuantityChange,
  } = useTechnicianOrder({
    propOrderId,
    onPartsUpdated,
    selectedCategory: currentCategory,
  });

  useEffect(() => {
    setLoadingServices(true);
    fetchServices()
      .then((data) => {
        setServices(data);
        setLoadingServices(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch services:", err);
        setLoadingServices(false);
      });
  }, []);

  const handleServiceSelect = (service: Service) => {
    setCurrentCategory(service.serviceName);
    setIsSidebarOpen(false);
  };

  const hasCartItems = cart.length > 0;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PageContainer>
      <Overlay
        $isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(false)}
      />
      <SidebarWrapper $isOpen={isSidebarOpen}>
        <SidebarHeader>
          <h2>All Services</h2>
          <button onClick={() => setIsSidebarOpen(false)} aria-label="Close">
            &times;
          </button>
        </SidebarHeader>
        <ServiceList>
          {loadingServices ? (
            <LoadingSpinner>Loading...</LoadingSpinner>
          ) : (
            services.map((service) => (
              <ServiceItem
                key={service.serviceId}
                $isActive={service.serviceName === currentCategory}
                onClick={() => handleServiceSelect(service)}
              >
                {service.serviceName}
              </ServiceItem>
            ))
          )}
        </ServiceList>
      </SidebarWrapper>

      <Header>
        <BackButton onClick={() => setIsOrder(false)}>
          <ArrowLeft size={20} />
          Close
        </BackButton>

        <HeaderContent>
          <HeaderIcon>
            <Package size={32} />
          </HeaderIcon>
          <HeaderText>
            <Title>Order Parts</Title>
            <Subtitle>Select parts for your order</Subtitle>
          </HeaderText>
        </HeaderContent>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SearchWrapper>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search for parts by name..."
            />
          </SearchWrapper>

          <CartButton onClick={handleOpenCart} $hasItems={hasCartItems}>
            <ShoppingCart size={20} />
            <CartBadge $show={hasCartItems}>{cartItemCount}</CartBadge>
          </CartButton>

          <ServiceToggleButton
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Chọn dịch vụ"
          >
            <LayoutGrid size={20} />
          </ServiceToggleButton>
        </div>
      </Header>

      <ContentWrapper>
        <CardGrid>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, idx) => (
              <ProductCard key={idx} isSkeleton />
            ))
          ) : displayParts && displayParts?.length > 0 ? (
            displayParts.map((part: OrderPartsResponseDto) => (
              <ProductCard
                key={part.id}
                part={part}
                onClick={() => handleOpenProductModal(part)}
              />
            ))
          ) : (
            <EmptyState>
              <Package size={64} opacity={0.3} />
              <EmptyText>No parts found</EmptyText>
              <EmptyHint>Try adjusting your search or filters</EmptyHint>
            </EmptyState>
          )}
        </CardGrid>

        {displayParts && displayParts.length > 0 && (
          <PaginationWrapper style={{ marginTop: "2rem" }}>
            <Pagination
              pageIndex={page}
              totalPage={totalPages ?? 0}
              totalItems={totalItems ?? 0}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </PaginationWrapper>
        )}
      </ContentWrapper>

      <ProductModal
        open={open}
        onClose={handleCloseProductModal}
        part={selectedPart}
        onAddToCart={handleAddToCart}
      />

      <CartModal
        open={cartOpen}
        onClose={handleCloseCart}
        cart={cart}
        onQuantityChange={handleCartQuantityChange}
        onRemove={handleRemoveFromCart}
        onSend={handleSendCart}
        loading={isSending}
      />
    </PageContainer>
  );
}
