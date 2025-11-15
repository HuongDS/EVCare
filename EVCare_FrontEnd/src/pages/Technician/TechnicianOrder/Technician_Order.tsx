import {
  ArrowLeft,
  ShoppingCart,
  Search,
  Package,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import ProductCard from "../Technician_Component/ProductCard";
import ProductModal from "../Technician_Component/ProductModal";
import CartModal from "../Technician_Component/CartModal";
import { useTechnicianOrder } from "../../../hooks/useTechnicianOrder";
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
import type { ServiceViewModel } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import type { PartInServiceDetail } from "../../../models/PartModel/PartModel";

interface TechnicianOrderProps {
  orderId: number;
  onPartsUpdated?: (orderId: number) => void;
  setIsOrder: (v: boolean) => void;
  appointmentId: number;
}

export default function TechnicianOrder({
  orderId,
  setIsOrder,
  appointmentId,
}: TechnicianOrderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);

  const {
    cart,
    pageIndex,
    searchQuery,
    isSending,
    isUpdating,
    appointmentHasCondition,
    pageSize,
    open,
    selectedPart,
    cartOpen,
    serviceLists,
    loadingServices,
    partsInService,
    loadingPartInService,
    totalPages,
    totalItems,
    damageLevels,
    setDamageLevels,
    handleAddToCart,
    handleRemoveFromCart,
    handleSendCart,
    handleUpdateCart,
    handleOpenProductModal,
    handleCloseProductModal,
    handleOpenCart,
    handleCloseCart,
    handlePageChange,
    handleSearchChange,
    handleCartQuantityChange,
    handleSelectAllParts,
  } = useTechnicianOrder({
    orderId,
    selectedCategory: currentCategory,
    appointmentId,
    setCurrentCategory,
    setIsOrder,
  });

  const handleServiceSelect = (service: ServiceViewModel) => {
    setCurrentCategory(service.serviceId);
    setIsSidebarOpen(false);
  };

  const handleAllPart = () => {
    handleSelectAllParts();
    setIsSidebarOpen(false);
  };

  const hasCartItems = cart.length > 0;
  const cartItemCount = cart.length;

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
            <>
              <ServiceItem
                $isActive={0 === currentCategory}
                onClick={handleAllPart}
              >
                <div>All Parts</div>
              </ServiceItem>
              {serviceLists?.data?.map((service) => (
                <ServiceItem
                  key={service.serviceId}
                  $isActive={service.serviceId === currentCategory}
                  onClick={() => handleServiceSelect(service)}
                >
                  {service.serviceName}
                </ServiceItem>
              ))}
            </>
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
            aria-label="Choose Services"
          >
            <LayoutGrid size={20} />
          </ServiceToggleButton>
        </div>
      </Header>

      <ContentWrapper>
        <CardGrid>
          {loadingPartInService ? (
            Array.from({ length: pageSize }).map((_, idx) => (
              <ProductCard key={idx} isSkeleton />
            ))
          ) : partsInService?.data?.items &&
            partsInService?.data?.items?.length > 0 ? (
            partsInService?.data.items.map((part: PartInServiceDetail) => (
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

        {!loadingPartInService &&
          (partsInService?.data?.totalItems ?? 0) > pageSize && (
            <PaginationWrapper>
              <Pagination
                pageIndex={pageIndex}
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
        appointmentHasCondition={
          appointmentHasCondition?.data?.partDamageLevels ?? []
        }
        open={cartOpen}
        onClose={handleCloseCart}
        cart={cart}
        onQuantityChange={handleCartQuantityChange}
        onRemove={handleRemoveFromCart}
        onSend={handleSendCart}
        onUpdate={handleUpdateCart}
        isSending={isSending}
        isUpdating={isUpdating}
        orderId={orderId}
        damageLevels={damageLevels}
        setDamageLevels={setDamageLevels}
      />
    </PageContainer>
  );
}
