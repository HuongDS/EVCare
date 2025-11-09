import React, { useMemo, useState } from "react";
import { Typography } from "antd";
import { Phone, Mail, Car, User, Users, UserCheck, Ban } from "lucide-react";
import {
  useGetAllCustomer,
  useGetBannedCustomers,
} from "../../../services/staffService";
import SearchBar from "../../../components/SearchBar/Search";
import ColorSpinner from "../StaffComponents/ColorSpinner";
const { Title, Text } = Typography;

const Manage_Customer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: bannedCus, isPending: bannedLoading } = useGetBannedCustomers();

  const { data: allCustomersRaw, isPending: allLoading } = useGetAllCustomer({
    keyword: "",
  });

  const { data: customers } = useGetAllCustomer({
    keyword: searchTerm,
  });

  const { totalCus, activeCustomer, totalVehicles } = useMemo(() => {
    const items = allCustomersRaw?.data?.items || [];
    const bannedCount = bannedCus?.data || 0;

    const totalCus = items.length;
    const activeCustomer =
      !bannedLoading && !allLoading ? Math.max(totalCus - bannedCount, 0) : 0;
    const totalVehicles = items.reduce(
      (sum, c) => sum + (c.vehicles?.length || 0),
      0
    );

    return { totalCus, activeCustomer, totalVehicles };
  }, [
    allCustomersRaw?.data?.items,
    bannedCus?.data,
    bannedLoading,
    allLoading,
  ]);

  return (
    <Container>
      <ContentWrapper>
        <StatsBar>
          <StatCard>
            <div className="icon">
              <Users size={24} />
            </div>
            <div className="content">
              {bannedLoading && allLoading ? (
                <ColorSpinner width="2em" height="2em" />
              ) : (
                <h3>{totalCus}</h3>
              )}

              <p>Total Customers</p>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <UserCheck size={24} />
            </div>
            <div className="content">
              {bannedLoading ? (
                <ColorSpinner width="2em" height="2em" />
              ) : (
                <h3>{activeCustomer}</h3>
              )}
              <p>Active Customers</p>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <Ban size={24} />
            </div>
            <div className="content">
              {bannedLoading && allLoading ? (
                <ColorSpinner width="2em" height="2em" />
              ) : (
                <h3>{bannedCus?.data}</h3>
              )}
              <p>Banned</p>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <Car size={24} />
            </div>
            <div className="content">
              {bannedLoading && allLoading ? (
                <ColorSpinner width="2em" height="2em" />
              ) : (
                <h3>{totalVehicles}</h3>
              )}
              <p>Total Vehicles</p>
            </div>
          </StatCard>
        </StatsBar>

        <FilterSection>
          <SearchBar
            handleSearchValue={setSearchTerm}
            placeholder="Search customer..."
          />
        </FilterSection>

        <CustomerGrid>
          {customers?.data?.items.map((customer) => (
            <CustomerCard key={customer.accountId} $banned={customer.banned}>
              <CustomerHeader>
                <CustomerAvatar
                  size={40}
                  src={`https://ui-avatars.com/api/?name=${customer.customerName}&background=00ad4e&color=fff&bold=true`}
                >
                  {customer.customerName.charAt(0)}
                </CustomerAvatar>
                <CustomerInfo>
                  <h3>{customer.customerName}</h3>
                  <Text className="customer-id">ID: #{customer.accountId}</Text>
                </CustomerInfo>
                <StatusBadge
                  status={customer.banned ? "error" : "success"}
                  text={customer.banned ? "Banned" : "Active"}
                  $banned={customer.banned}
                />
              </CustomerHeader>

              <InfoRow>
                <Mail size={18} />
                <div className="content">
                  <div className="label">Email</div>
                  <div className="value">{customer.email}</div>
                </div>
              </InfoRow>

              <InfoRow>
                <Phone size={18} />
                <div className="content">
                  <div className="label">Phone</div>
                  <div className="value">{customer.phoneNumber}</div>
                </div>
              </InfoRow>

              {customer.vehicles.length > 0 && (
                <VehiclesSection>
                  <div className="vehicles-header">
                    <Car size={16} />
                    <span>Vehicles ({customer.vehicles.length})</span>
                  </div>
                  <div style={{ maxHeight: "40px", overflowY: "auto" }}>
                    {customer.vehicles.map((vehicle) => (
                      <VehicleTag key={vehicle.id}>
                        <span className="plate">{vehicle.licensePlate}</span>
                        <span className="category">{vehicle.categoryName}</span>
                      </VehicleTag>
                    ))}
                  </div>
                </VehiclesSection>
              )}
            </CustomerCard>
          ))}

          {customers?.data?.items.length === 0 && (
            <EmptyState>
              <User size={48} />
              <Title level={4} style={{ color: "#64748b" }}>
                No customers found
              </Title>
              <Text>Try adjusting your search or filters</Text>
            </EmptyState>
          )}
        </CustomerGrid>
      </ContentWrapper>
    </Container>
  );
};

export default Manage_Customer;

import {
  Container,
  ContentWrapper,
  CustomerAvatar,
  CustomerCard,
  CustomerGrid,
  CustomerHeader,
  CustomerInfo,
  EmptyState,
  FilterSection,
  InfoRow,
  StatCard,
  StatsBar,
  StatusBadge,
  VehicleTag,
  VehiclesSection,
} from "./Manage_Customer.styled";
