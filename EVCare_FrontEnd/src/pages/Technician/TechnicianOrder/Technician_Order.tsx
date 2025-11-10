import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
  const hook = useTechnicianOrder({
    propOrderId,
    onPartsUpdated,
    selectedCategory,
  });

  const {
    cart,
    displayParts,
    page,
    totalPages,
    searchQuery,
    isLoading,
    isSending,
    pageSize,
    open,
    selectedPart,
    cartOpen,
    setCart,
    setOpen,
    setCartOpen,
    setPage,
    setSearchQuery,
    handleBack,
    handleAddToCart,
    handleRemoveFromCart,
    handleSendCart,
  } = hook;

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PageContainer>
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

        <div style={{ display: "flex", alignContent: "center", gap: "10px" }}>
          <SearchWrapper>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search for parts by name..."
            />
          </SearchWrapper>
          <CartButton
            onClick={() => setCartOpen(true)}
            $hasItems={cart.length > 0}
          >
            <ShoppingCart size={20} />
            <CartBadge $show={cart.length > 0}>{cartItemCount}</CartBadge>
          </CartButton>
        </div>
      </Header>

      <ContentWrapper>
        <CardGrid>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, idx) => (
              <ProductCard key={idx} isSkeleton />
            ))
          ) : displayParts.length > 0 ? (
            displayParts.map((part: OrderPartsResponseDto) => (
              <ProductCard
                key={part.id}
                part={part}
                onClick={() => {
                  if (part.isDeleted || part.quantity <= 0) return;
                  hook.setSelectedPart(part);
                  hook.setOpen(true);
                }}
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

        {totalPages > 1 && (
          <PaginationWrapper>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
              sx={{
                "& .MuiPaginationItem-root": {
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 600,
                  "&.Mui-selected": {
                    backgroundColor: "#00ad4e",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#00c853",
                    },
                  },
                },
              }}
            />
          </PaginationWrapper>
        )}
      </ContentWrapper>

      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        part={selectedPart}
        onAddToCart={handleAddToCart}
      />

      <CartModal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onQuantityChange={(id, qty) =>
          setCart((prev) =>
            prev.map((item) =>
              item.part.id === id ? { ...item, quantity: qty } : item
            )
          )
        }
        onRemove={handleRemoveFromCart}
        onSend={handleSendCart}
        loading={isSending}
      />
    </PageContainer>
  );
}
