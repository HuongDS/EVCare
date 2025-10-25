import React, { useState } from "react";
import type { FullCustomerInfor } from "../../../models/CustomerModels/FullCustomerInfor";
import { AnimatePresence, motion } from "framer-motion";
import {
  TableWrapper,
  StyledTable,
  Th,
  TBody,
  Tr,
  Td,
  CustomerName,
  ContactInfo,
  StatusBadge,
  ActionButton,
  ExpandableRow,
  ExpandableContent,
  VehicleGrid,
  VehicleCard,
  VehicleImage,
  VehicleInfo,
  EmptyState,
  ActionGroup,
  AvatarIconWrapper,
} from "./Admin_Customer_Vehicle.styled";
import { FaChevronDown, FaBan, FaUser, FaEnvelope, FaPhone, FaCar } from "react-icons/fa";
import defaultCar from "../../../assets/EVcar.webp";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";

interface CustomerTableProps {
  customers: FullCustomerInfor[];
  onBanCustomer: (user: FullCustomerInfor) => void;
}

const CustomerRow: React.FC<{
  user: FullCustomerInfor;
  onBanCustomer: (user: FullCustomerInfor) => void;
}> = ({ user, onBanCustomer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getVehicleImage = (v: VehicleViewDto) => {
    return v.image && v.image.length !== 0 && v.image !== "string" ? v.image : defaultCar;
  };

  const totalVehicles = user.vehicles?.length ?? 0;

  return (
    <>
      <Tr
        $isBanned={user.banned}
        onClick={() => totalVehicles > 0 && setIsExpanded(!isExpanded)}
        $expandable={totalVehicles > 0}
      >
        <Td>
          <AvatarIconWrapper>
            <FaUser />
          </AvatarIconWrapper>
        </Td>
        <Td>
          <CustomerName>{user.customerName}</CustomerName>
          <ContactInfo>
            <FaEnvelope /> {user.email}
          </ContactInfo>
        </Td>
        <Td>
          <ContactInfo>
            <FaPhone /> {user.phoneNumber ?? "N/A"}
          </ContactInfo>
        </Td>
        <Td>
          <ContactInfo>
            <FaCar style={{ color: "#00ad4e" }} /> {totalVehicles} vehicle(s)
          </ContactInfo>
        </Td>
        <Td>
          <StatusBadge $isBanned={user.banned}>{user.banned ? "Banned" : "Active"}</StatusBadge>
        </Td>
        <Td>
          <ActionGroup onClick={(e) => e.stopPropagation()}>
            <ActionButton $isBanButton={true} onClick={() => onBanCustomer(user)} disabled={user.banned}>
              <FaBan />
              {user.banned ? "Banned" : "Ban"}
            </ActionButton>
            {totalVehicles > 0 && (
              <ActionButton $isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
                <FaChevronDown />
              </ActionButton>
            )}
          </ActionGroup>
        </Td>
      </Tr>

      <AnimatePresence>
        {isExpanded && (
          <ExpandableRow
            as={motion.tr}
            key={`expand-${user.accountId}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            $isBanned={user.banned}
          >
            <Td colSpan={6}>
              <ExpandableContent>
                <h4>Xe của {user.customerName}</h4>
                <VehicleGrid>
                  {user.vehicles.map((v) => (
                    <VehicleCard key={v.id}>
                      <VehicleImage src={getVehicleImage(v)} alt={v.categoryName} />
                      <VehicleInfo>
                        <strong>{v.licensePlate}</strong>
                        <span>{v.categoryName}</span>
                      </VehicleInfo>
                    </VehicleCard>
                  ))}
                </VehicleGrid>
              </ExpandableContent>
            </Td>
          </ExpandableRow>
        )}
      </AnimatePresence>
    </>
  );
};

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onBanCustomer }) => {
  if (customers.length === 0) {
    return (
      <TableWrapper>
        <EmptyState>
          <h3>No customers found</h3>
          <p>Try adjusting your search filters or keywords.</p>
        </EmptyState>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <Tr>
            <Th>Avatar</Th>
            <Th>Customer</Th>
            <Th>Phone</Th>
            <Th>Vehicles</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </thead>
        <TBody>
          {customers.map((user) => (
            <CustomerRow key={user.accountId} user={user} onBanCustomer={onBanCustomer} />
          ))}
        </TBody>
      </StyledTable>
    </TableWrapper>
  );
};

export default CustomerTable;
