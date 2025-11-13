import { ArrowLeft, ShoppingCart, Search, Package } from "lucide-react";
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
} from "./Technician_Order.styled";
import { Pagination } from "../../../components/Paginations/Pagination";

interface TechnicianOrderProps {
  orderId?: number;
  onPartsUpdated?: (orderId: number) => void;
  selectedCategory?: string;
}

export default function TechnicianOrder({
  orderId: propOrderId,
  onPartsUpdated,
  selectedCategory,
}: TechnicianOrderProps) {
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
    handleBack,
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
    selectedCategory,
  });

  const hasCartItems = cart.length > 0;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PageContainer>
      {/* Header */}
      <Header>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={20} />
          Back
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
        </div>
      </Header>

      <ContentWrapper>
        <CardGrid>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, idx) => <ProductCard key={idx} isSkeleton />)
          ) : displayParts && displayParts?.length > 0 ? (
            displayParts.map((part: OrderPartsResponseDto) => (
              <ProductCard key={part.id} part={part} onClick={() => handleOpenProductModal(part)} />
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

      <ProductModal open={open} onClose={handleCloseProductModal} part={selectedPart} onAddToCart={handleAddToCart} />

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
