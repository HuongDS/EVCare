import { useState } from "react";
import {
  DetailWrapper,
  Button,
  Wrapper,
  Backdrop,
  OrderModal,
  Title,
  TitleID,
  Status,
  StatusBadge,
  Section,
  Row,
  ServiceList,
  ServiceItem,
  ServicePrice,
  TotalRow,
  NoteBox,
} from "./OrderDetail.styled";
import NameBoxComponent from "../NameBox"; // import NameBox

interface Staff {
  id: number;
  role: string;
  name: string;
}

interface Customer {
  name: string;
  vehicle_model: string;
  phone: string;
  note: string;
  reason?: string;
  date: string;
  location: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

type OrderStatus =
  | "done"
  | "in progress"
  | "cancel";

export default function OrderDetail() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const orderStatus: OrderStatus =
    "done" as OrderStatus;

  const customer: Customer = {
    name: "Picasso",
    vehicle_model: "Vinfast VF5",
    phone: "0123456789",
    note: "Check abc xyz dao ham tam giac vuong hinh binh hanh pitago picasso oop react ts js",
    reason: "Customer canceled due to emergency",
    date: "13/06/2025",
    location: "HCM City",
  };

  const staffs: Staff[] = [
    {
      id: 1,
      role: "Service Staff",
      name: "Alex",
    },
    {
      id: 2,
      role: "Technical Staff",
      name: "Alice",
    },
  ];

  const services: Service[] = [
    {
      id: 1,
      name: "Change Tire x 1",
      price: 500000,
    },
    {
      id: 2,
      name: "Change Oil x 1",
      price: 500000,
    },
  ];

  const total = services.reduce(
    (sum, s) => sum + s.price,
    0
  );

  const openModal = () => {
    setVisible(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeModal = () => setOpen(false);

  const handleAnimationEnd = () => {
    if (!open) setVisible(false);
  };

  return (
    <DetailWrapper>
      <Button onClick={openModal}>Detail</Button>

      {visible && (
        <Wrapper isOpen={open}>
          <Backdrop
            isOpen={open}
            onClick={closeModal}
          />
          <OrderModal
            isOpen={open}
            onClick={(e) => e.stopPropagation()}
            onTransitionEnd={handleAnimationEnd}
          >
            {/* Header */}
            <Row
              style={{
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <TitleID>ID: #12345</TitleID>
              <Status>
                Status:{" "}
                <StatusBadge status={orderStatus}>
                  {orderStatus}
                </StatusBadge>
              </Status>
            </Row>

            {/* Customer + Staff Info */}
            <Section>
              <Title>Information:</Title>
              <Row>
                <NameBoxComponent
                  label="Customer's Name"
                  name={customer.name}
                />
                <NameBoxComponent
                  label="Service Staff"
                  name={staffs[0].name}
                />
              </Row>
              <Row>
                <NameBoxComponent
                  label="Vehicle Model"
                  name={customer.vehicle_model}
                />
                <NameBoxComponent
                  label="Technical Staff"
                  name={staffs[1].name}
                />
              </Row>
              <Row>
                <NameBoxComponent
                  label="Phone"
                  name={customer.phone}
                />
                <NameBoxComponent
                  label="Date"
                  name={customer.date}
                />
              </Row>
              <Row>
                <NameBoxComponent
                  label="Location"
                  name={customer.location}
                />
                <NoteBox
                  readOnly
                  value={customer.note}
                  placeholder="Note"
                />
              </Row>
            </Section>

            {/* Service OR Reason */}
            <Section>
              {orderStatus === "cancel" ? (
                <>
                  <Title>Reason:</Title>
                  <NoteBox
                    readOnly
                    value={customer.reason}
                    placeholder="Reason"
                  />
                </>
              ) : (
                <>
                  <Title>Service:</Title>
                  <ServiceList>
                    {services.map((s) => (
                      <Row key={s.id}>
                        <ServiceItem>
                          • {s.name}
                        </ServiceItem>
                        <ServicePrice>
                          {s.price.toLocaleString(
                            "vi-VN"
                          )}
                          VNĐ
                        </ServicePrice>
                      </Row>
                    ))}
                  </ServiceList>
                  <TotalRow>
                    Total:{" "}
                    {total.toLocaleString(
                      "vi-VN"
                    )}
                    VNĐ
                  </TotalRow>
                </>
              )}
            </Section>
          </OrderModal>
        </Wrapper>
      )}
    </DetailWrapper>
  );
}
