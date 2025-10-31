import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Select, Badge, Avatar, Card, Typography } from "antd";
import { Phone, Award, Wrench, User } from "lucide-react";
import { useGetTechniciansToday } from "../../../services/appointmentServiceApi";
import SearchBar from "../../../components/SearchBar/Search";
import SpinnerComponent from "../../../components/SpinnerComponent";

const { Title, Text } = Typography;
const { Option } = Select;

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "success";
    case "Busy":
      return "warning";
    case "OnLeave":
      return "default";
    default:
      return "default";
  }
};

const Manage_Technicians = () => {
  // const [technicians] = useState(mockTechnicians);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: technicians, isLoading } = useGetTechniciansToday({
    ...(statusFilter !== "all" ? { Status: statusFilter } : {}),
    ...((searchTerm && { FullName: searchTerm }) || {}),
  });

  const { availableCount, busyCount, total } = useMemo(() => {
    const techniciansList = technicians?.data?.items;
    const availableCount = techniciansList?.filter(
      (t) => t.status === "Available"
    ).length;

    const busyCount = techniciansList?.filter(
      (t) => t.status === "Busy"
    ).length;

    const total = techniciansList?.length;
    return { availableCount, busyCount, total };
  }, [technicians]);

  return (
    <Container>
      <ContentWrapper>
        <StatsBar>
          <StatCard>
            <div className="icon">
              <User size={24} />
            </div>
            <div className="content">
              <h3>{total}</h3>
              <p>Total Technicians</p>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <Award size={24} />
            </div>
            <div className="content">
              <h3>{availableCount}</h3>
              <p>Available Now</p>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <Wrench size={24} />
            </div>
            <div className="content">
              <h3>{busyCount}</h3>
              <p>Currently Busy</p>
            </div>
          </StatCard>
        </StatsBar>

        <FilterSection>
          <SearchBar
            handleSearchValue={setSearchTerm}
            searchValue={searchTerm}
            placeholder="Search technician..."
          />
          <StyledSelect
            value={statusFilter}
            onChange={(value) => setStatusFilter(String(value))}
            style={{ width: 200 }}
          >
            <Option value="all">All Status</Option>
            <Option value="Available">Available</Option>
            <Option value="Busy">Busy</Option>
            <Option value="OnLeave">OnLeave</Option>
          </StyledSelect>
          <Text style={{ marginLeft: "auto", color: "#64748b" }}>
            Showing {technicians?.data?.totalItems} of{" "}
            {technicians?.data?.items?.length} technicians
          </Text>
        </FilterSection>

        {isLoading ? (
          <SpinnerComponent />
        ) : (
          <TechGrid>
            {technicians?.data?.items?.map((tech) => (
              <TechCard key={tech.id}>
                <TechHeader>
                  <TechAvatar
                    src={`https://ui-avatars.com/api/?name=${tech.fullName}&background=3b82f6&color=fff&bold=true`}
                  >
                    {tech.fullName.charAt(0)}
                  </TechAvatar>
                  <TechInfo>
                    <h3>{tech.fullName}</h3>
                    <Text className="tech-id">ID: #{tech.id}</Text>
                  </TechInfo>
                  <StatusBadge
                    status={getStatusColor(tech.status)}
                    text={tech.status}
                  />
                </TechHeader>

                <InfoRow>
                  <Phone size={18} />
                  <span className="label">Phone:</span>
                  <span style={{ marginLeft: "auto" }}>{tech.phone}</span>
                </InfoRow>

                <InfoRow>
                  <Award size={18} />
                  <span className="label">Experience:</span>
                  <span style={{ marginLeft: "auto" }}>
                    {tech.expYears} {tech.expYears === 1 ? "year" : "years"}
                  </span>
                </InfoRow>

                <SkillsSection>
                  <div className="skills-label">
                    <Wrench size={16} />
                    <span>Skills & Expertise</span>
                  </div>
                  <div>
                    {tech.skills.map((skill) => (
                      <SkillTag key={skill.id}>{skill.name}</SkillTag>
                    ))}
                  </div>
                </SkillsSection>
              </TechCard>
            ))}
          </TechGrid>
        )}

        {technicians?.data?.items?.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "3rem",
              color: "#64748b",
            }}
          >
            <User size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
            <Title level={4} style={{ color: "#64748b" }}>
              No technicians found
            </Title>
            <Text>Try adjusting your search or filters</Text>
          </div>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default Manage_Technicians;

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

const FilterSection = styled.div`
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

const StyledSelect = styled(Select)`
  min-width: 200px;

  .ant-select-selector {
    border-radius: 8px !important;
    border: 1px solid #e5e7eb !important;
    padding: 0.375rem 0.75rem !important;
    height: auto !important;

    &:hover {
      border-color: #3b82f6 !important;
    }
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 200px;

  .icon {
    background: #eff6ff;
    padding: 0.75rem;
    border-radius: 10px;
    color: #3b82f6;
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

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TechCard = styled(Card)`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #3b82f6;
  }

  .ant-card-body {
    padding: 1.5rem;
  }
`;

const TechHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const TechAvatar = styled(Avatar)`
  width: 64px;
  height: 64px;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`;

const TechInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem;
  }

  .tech-id {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

const StatusBadge = styled(Badge)`
  .ant-badge-status-dot {
    width: 10px;
    height: 10px;
  }

  .ant-badge-status-text {
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 0.75rem;

  svg {
    color: #64748b;
    flex-shrink: 0;
  }

  span {
    color: #475569;
    font-size: 0.9rem;
  }

  .label {
    font-weight: 500;
    color: #334155;
  }
`;

const SkillsSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;

  .skills-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }
`;

const SkillTag = styled.span`
  display: inline-block;
  background: #eff6ff;
  color: #3b82f6;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #dbeafe;
`;
