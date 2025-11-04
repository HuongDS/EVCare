import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Badge, Avatar, Card, Typography } from "antd";
import { Phone, Mail, Car, User, Users, UserCheck, Ban } from "lucide-react";
import { useGetAllCustomer } from "../../../services/staffService";
import SearchBar from "../../../components/SearchBar/Search";
const { Title, Text } = Typography;

const Manage_Customer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allCustomersRaw } = useGetAllCustomer({
    keyword: "",
  });

  const { data: customers } = useGetAllCustomer({
    keyword: searchTerm,
  });

  const { totalCus, activeCount, bannedCount, totalVehicles } = useMemo(() => {
    const totalCus = allCustomersRaw?.data?.items.length;
    const activeCount = allCustomersRaw?.data?.items.filter(
      (c) => !c.banned
    ).length;
    const bannedCount = allCustomersRaw?.data?.items.filter(
      (c) => c.banned
    ).length;
    const totalVehicles = allCustomersRaw?.data?.items.reduce(
      (sum, c) => sum + c.vehicles.length,
      0
    );
    return { totalCus, activeCount, bannedCount, totalVehicles };
  }, [allCustomersRaw?.data?.items]);

  return (
    <Container>
      <ContentWrapper>
        <StatsBar>
          <StatCard>
            <div className="icon">
              <Users size={24} />
            </div>
            <div className="content">
              <h3>{totalCus}</h3>
              <p>Total Customers</p>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <UserCheck size={24} />
            </div>
            <div className="content">
              <h3>{activeCount}</h3>
              <p>Active Customers</p>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <Ban size={24} />
            </div>
            <div className="content">
              <h3>{bannedCount}</h3>
              <p>Banned</p>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <Car size={24} />
            </div>
            <div className="content">
              <h3>{totalVehicles}</h3>
              <p>Total Vehicles</p>
            </div>
          </StatCard>
        </StatsBar>

        <FilterSection>
          <SearchBar
            handleSearchValue={setSearchTerm}
            placeholder="Search customer..."
            searchValue={searchTerm}
          />
        </FilterSection>

        <CustomerGrid>
          {customers?.data?.items.map((customer) => (
            <CustomerCard key={customer.accountId} $banned={customer.banned}>
              <CustomerHeader>
                <CustomerAvatar
                  size={40}
                  src={`https://ui-avatars.com/api/?name=${customer.customerName}&background=3b82f6&color=fff&bold=true`}
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

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  * {
    font-family: "Outfit", sans-serif;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .icon {
    border: 1px solid #ccc;
    padding: 0.75rem;
    border-radius: 10px;
    color: black;
    display: flex;
  }

  .content {
    h3 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    p {
      color: #64748b;
      font-size: 0.875rem;
      margin: 0;
    }
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: flex-end;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const CustomerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CustomerCard = styled(Card)<{ $banned: boolean }>`
  border: 1px solid ${({ $banned }) => ($banned ? "#fca5a5" : "#e5e7eb")};
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  opacity: ${({ $banned }) => ($banned ? 0.8 : 1)};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: ${({ $banned }) => ($banned ? "#f87171" : "#3b82f6")};
  }

  .ant-card-body {
    padding: 1.5rem;
  }
`;

const CustomerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const CustomerAvatar = styled(Avatar)`
  width: 64px;
  height: 64px;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
`;

const CustomerInfo = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .customer-id {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

const StatusBadge = styled(Badge)<{ $banned: boolean }>`
  .ant-badge-status-dot {
    width: 10px;
    height: 10px;
  }

  .ant-badge-status-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ $banned }) => ($banned ? "#dc2626" : "#22c55e")};
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 0.75rem;

  svg {
    color: #64748b;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .content {
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-columns: 0.2fr 1fr;

    .label {
      font-weight: 500;
      color: #334155;
      font-size: 0.875rem;
      margin-bottom: 0.125rem;
    }

    .value {
      color: #64748b;
      font-size: 0.9rem;
      word-break: break-word;
    }
  }
`;

const VehiclesSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;

  .vehicles-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }
`;

const VehicleTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  color: #1e40af;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;

  .plate {
    font-weight: 600;
    font-family: monospace;
  }

  .category {
    color: #3b82f6;
    font-size: 0.75rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
  grid-column: 1 / -1;

  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;
