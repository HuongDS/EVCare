import { type Dispatch, type SetStateAction } from "react";
import { Modal, Fade, Backdrop } from "@mui/material";
import { ShoppingCart, Trash2, Minus, Plus, X } from "lucide-react";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";
import {
  DamageLevelStringEnum,
  damageColorMap,
} from "../../../models/enums/DamageLevelEnum";
import type { PartDamageLevelDetail } from "../../../models/OrderPartModel/AppointmentPartCondition";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
  cart: { part: OrderPartsResponseDto; quantity: number }[];
  onQuantityChange: (partId: number, newQty: number) => void;
  onRemove: (partId: number) => void;
  onSend: (orderId: number) => void;
  onUpdate: (orderId: number) => void;
  isSending: boolean;
  isUpdating: boolean;
  orderId: number;
  damageLevels: Record<number, DamageLevelStringEnum>;
  setDamageLevels: Dispatch<
    SetStateAction<Record<number, DamageLevelStringEnum>>
  >;
  appointmentHasCondition: PartDamageLevelDetail[];
}

export default function CartModal({
  appointmentHasCondition,
  open,
  onClose,
  cart,
  onQuantityChange,
  onRemove,
  onSend,
  onUpdate,
  isSending,
  isUpdating,
  orderId,
  damageLevels,
  setDamageLevels,
}: CartModalProps) {
  const total = cart.reduce(
    (sum, item) => sum + (item.part.price ?? 0) * item.quantity,
    0
  );

  const isProcessing = isSending || isUpdating;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
    >
      <Fade in={open} timeout={300}>
        <ModalContainer>
          <Header>
            <HeaderLeft>
              <CartIcon>
                <ShoppingCart size={24} />
              </CartIcon>
              <HeaderText>
                <Title>Parts Order Cart</Title>
                <ItemCount>
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </ItemCount>
              </HeaderText>
            </HeaderLeft>
            <CloseButton onClick={onClose}>
              <X size={24} />
            </CloseButton>
          </Header>

          <ContentWrapper>
            <CartSection>
              {cart.length === 0 ? (
                <EmptyState>
                  <ShoppingCart size={64} opacity={0.3} />
                  <EmptyText>Your cart is empty</EmptyText>
                  <EmptyHint>Add some parts to get started</EmptyHint>
                </EmptyState>
              ) : (
                <CartList>
                  {cart.map(({ part, quantity }) => (
                    <CartItem key={part.id}>
                      <ItemInfo>
                        <PartName>{part.name}</PartName>
                        <PartPrice>
                          {(part.price ?? 0).toLocaleString("vi-VN")}₫
                        </PartPrice>
                      </ItemInfo>

                      <ItemControls>
                        <QuantityControl>
                          <QuantityButton
                            onClick={() =>
                              onQuantityChange(
                                part.id,
                                Math.max(1, quantity - 1)
                              )
                            }
                            disabled={quantity <= 1}
                          >
                            <Minus size={16} />
                          </QuantityButton>
                          <QuantityDisplay>{quantity}</QuantityDisplay>
                          <QuantityButton
                            onClick={() =>
                              onQuantityChange(part.id, quantity + 1)
                            }
                          >
                            <Plus size={16} />
                          </QuantityButton>
                        </QuantityControl>

                        <DamageSelect
                          value={
                            damageLevels[part.id] ??
                            DamageLevelStringEnum.Critical
                          }
                          onChange={(e) =>
                            setDamageLevels((prev) => ({
                              ...prev,
                              [part.id]: e.target
                                .value as DamageLevelStringEnum,
                            }))
                          }
                          $color={
                            damageColorMap[
                              damageLevels[part.id] ??
                                DamageLevelStringEnum.Critical
                            ]
                          }
                        >
                          {Object.entries(DamageLevelStringEnum).map(
                            ([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            )
                          )}
                        </DamageSelect>

                        <DeleteButton onClick={() => onRemove(part.id)}>
                          <Trash2 size={18} />
                        </DeleteButton>
                      </ItemControls>

                      <ItemTotal>
                        {((part.price ?? 0) * quantity).toLocaleString("vi-VN")}
                        ₫
                      </ItemTotal>
                    </CartItem>
                  ))}
                </CartList>
              )}
            </CartSection>

            <SummarySection>
              <SummaryCard>
                <SummaryTitle>Order Summary</SummaryTitle>

                {/* {cart.length > 0 && ( */}
                <>
                  <SummaryItems>
                    {cart.map(({ part, quantity }) => (
                      <SummaryItem key={part.id}>
                        <ItemName>
                          {part.name} <Quantity>×{quantity}</Quantity>
                        </ItemName>
                        <ItemAmount>
                          {((part.price ?? 0) * quantity).toLocaleString(
                            "vi-VN"
                          )}
                          ₫
                        </ItemAmount>
                      </SummaryItem>
                    ))}
                  </SummaryItems>

                  <Divider />

                  <TotalRow>
                    <TotalLabel>Total Amount</TotalLabel>
                    <TotalAmount>{total.toLocaleString("vi-VN")}₫</TotalAmount>
                  </TotalRow>

                  <ActionButton
                    onClick={() =>
                      appointmentHasCondition.length > 0
                        ? onUpdate(orderId)
                        : onSend(orderId)
                    }
                    disabled={isProcessing}
                    $processing={isProcessing}
                  >
                    {isProcessing
                      ? appointmentHasCondition.length > 0
                        ? "Updating..."
                        : "Sending..."
                      : appointmentHasCondition.length > 0
                      ? "Update Cart"
                      : "Send Order"}
                  </ActionButton>
                </>
                {/* )} */}
              </SummaryCard>
            </SummarySection>
          </ContentWrapper>
        </ModalContainer>
      </Fade>
    </Modal>
  );
}

import {
  ActionButton,
  CartIcon,
  CartItem,
  CartList,
  CartSection,
  CloseButton,
  ContentWrapper,
  DamageSelect,
  DeleteButton,
  Divider,
  EmptyHint,
  EmptyState,
  EmptyText,
  Header,
  HeaderLeft,
  HeaderText,
  ItemAmount,
  ItemControls,
  ItemCount,
  ItemInfo,
  ItemName,
  ItemTotal,
  ModalContainer,
  PartName,
  PartPrice,
  Quantity,
  QuantityButton,
  QuantityControl,
  QuantityDisplay,
  SummaryCard,
  SummaryItem,
  SummaryItems,
  SummarySection,
  SummaryTitle,
  Title,
  TotalAmount,
  TotalLabel,
  TotalRow,
} from "./Style/CartModal.styled";
