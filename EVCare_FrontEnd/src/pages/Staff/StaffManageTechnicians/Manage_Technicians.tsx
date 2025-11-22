import { useMemo, useState } from "react";
import { Select, Typography } from "antd";
import { Phone, Award, Wrench, User } from "lucide-react";
import { useGetTechniciansToday } from "../../../services/appointmentServiceApi";
import SearchBar from "../../../components/SearchBar/Search";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { useGetNumberOfTechnician } from "../../../services/staffService";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Available");
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);

  const { data: technicians, isLoading } = useGetTechniciansToday({
    ...(statusFilter ? { Status: statusFilter } : {}),
    ...((searchTerm && { FullName: searchTerm }) || {}),
  });

  const { data: techsAvailableCount } = useGetNumberOfTechnician({
    status: "Available",
  });
  const { data: techsBusyCount } = useGetNumberOfTechnician({ status: "Busy" });
  const { data: techsOnleaveCount } = useGetNumberOfTechnician({
    status: "OnLeave",
  });

  const { total } = useMemo(() => {
    const total = (techsAvailableCount?.data || 0) + (techsBusyCount?.data || 0) + (techsOnleaveCount?.data || 0);
    return { total };
  }, [techsAvailableCount?.data, techsBusyCount?.data]);

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
              <h3>{techsAvailableCount?.data}</h3>
              <p>Available Now</p>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <Wrench size={24} />
            </div>
            <div className="content">
              <h3>{techsBusyCount?.data}</h3>
              <p>Currently Busy</p>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon">
              <Wrench size={24} />
            </div>
            <div className="content">
              <h3>{techsOnleaveCount?.data}</h3>
              <p>Onleave</p>
            </div>
          </StatCard>
        </StatsBar>

        <FilterSection>
          <SearchBar handleSearchValue={setSearchTerm} placeholder="Search technician..." />
          <StyledSelect
            value={statusFilter}
            onChange={(value) => setStatusFilter(String(value))}
            style={{ width: 200 }}
          >
            <Option value="Available">Available</Option>
            <Option value="Busy">Busy</Option>
            <Option value="OnLeave">OnLeave</Option>
          </StyledSelect>
          <Text style={{ marginLeft: "auto", color: "#64748b" }}>
            Showing {technicians?.data?.totalItems} of {technicians?.data?.items?.length} technicians
          </Text>
        </FilterSection>

        {isLoading ? (
          <SpinnerComponent />
        ) : (
          <TechGrid>
            {technicians?.data?.items?.map((tech) => {
              const isFlipped = flippedCardId === tech.id;

              return (
                <FlipCardContainer key={tech.id} onClick={() => {}}>
                  <FlipCardInner $flipped={isFlipped}>
                    <FlipCardFront>
                      <TechHeader>
                        <TechAvatar
                          src={`https://ui-avatars.com/api/?name=${tech.fullName}&background=00ad4e&color=fff&bold=true`}
                        >
                          {tech.fullName.charAt(0)}
                        </TechAvatar>
                        <TechInfo>
                          <h3>{tech.fullName}</h3>
                          <Text className="tech-id">ID: #{tech.id}</Text>
                        </TechInfo>
                        <StatusBadge status={getStatusColor(tech.status)} text={tech.status} />
                      </TechHeader>

                      <InfoRow>
                        <Phone size={18} />
                        <span className="label">Phone:</span>
                        <span style={{ marginLeft: "auto" }}>{tech.phone}</span>
                      </InfoRow>
                      <InfoRow>
                        <Phone size={18} />
                        <span className="label">Email:</span>
                        <span style={{ marginLeft: "auto" }}>{tech.email}</span>
                      </InfoRow>

                      <InfoRow>
                        <Award size={18} />
                        <span className="label">Experience:</span>
                        <span style={{ marginLeft: "auto" }}>
                          {tech.expYears} {tech.expYears === 1 ? "year" : "years"}
                        </span>
                      </InfoRow>

                      <button
                        onClick={() => setFlippedCardId(isFlipped ? null : tech.id)}
                        style={{
                          marginTop: "1rem",
                          background: "#00ad4e",
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        View Skills
                      </button>
                    </FlipCardFront>

                    <FlipCardBack>
                      <h3 style={{ marginBottom: "1rem", color: "#1e293b" }}>Skills & Expertise</h3>
                      <div className="skills-list">
                        {tech.skills.map((skill) => (
                          <SkillTag key={skill.id}>{skill.name}</SkillTag>
                        ))}
                      </div>

                      <button
                        onClick={() => setFlippedCardId(null)}
                        style={{
                          marginTop: "auto",
                          background: "#64748b",
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        Back
                      </button>
                    </FlipCardBack>
                  </FlipCardInner>
                </FlipCardContainer>
              );
            })}
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

import {
  Container,
  ContentWrapper,
  FilterSection,
  FlipCardBack,
  FlipCardContainer,
  FlipCardFront,
  FlipCardInner,
  InfoRow,
  SkillTag,
  StatCard,
  StatsBar,
  StatusBadge,
  StyledSelect,
  TechAvatar,
  TechGrid,
  TechHeader,
  TechInfo,
} from "./Manage_Technicians.styled";
