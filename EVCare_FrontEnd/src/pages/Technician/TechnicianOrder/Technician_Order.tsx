import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import ProductCard from "../Technician_Component/ProductCard";
import ProductModal from "../Technician_Component/ProductModal";
import CartModal from "../Technician_Component/CartModal";
import SearchBar from "../Technician_Component/SearchBar";
import ButtonAction from "../../../components/Button/ButtonAction";

import {
  PageContainer,
  TitleContainer,
  Title,
  CardWrapper,
  CenterWrapper,
  PaginationContainer,
  SearchWrapper,
  ContentWrapper,
} from "./Technician_Order.styled";

import { useTechnicianOrder } from "../../../hooks/useTechnicianOrder";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";

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

  return (
    <PageContainer>
      <TitleContainer>
        <ButtonAction
          text="← Back"
          color="white"
          backgroundColor="#888"
          action={handleBack}
        />

        <CenterWrapper>
          <Title>Technician Order</Title>
          <SearchWrapper>
            <SearchBar
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search for parts..."
            />
          </SearchWrapper>
        </CenterWrapper>

        <ButtonAction
          text={`Open Cart (${cart.length})`}
          color="white"
          backgroundColor="#00AD4E"
          action={() => setCartOpen(true)}
        />
      </TitleContainer>

      <ContentWrapper>
        <CardWrapper>
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
            <div
              style={{ width: "100%", textAlign: "center", padding: "2rem" }}
            >
              No parts found.
            </div>
          )}
        </CardWrapper>

        <PaginationContainer>
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
          />
        </PaginationContainer>
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
