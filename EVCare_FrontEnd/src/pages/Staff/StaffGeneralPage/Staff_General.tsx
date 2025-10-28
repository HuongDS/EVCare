import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Avatar, Tag, Button, Statistic, Typography } from "antd";
import {
  Calendar,
  Activity,
  Mail,
  Phone,
  IdCard,
  UserRoundPen,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useGetAccount } from "../../../services/authService";
import { useGetAllAppointments } from "../../../services/appointmentServiceApi";
import StatusTag from "../../../components/StatusTags/StatusTag";
import dayjs from "dayjs";

const { Title } = Typography;

const StaffDashboard: React.FC = () => {
  const [completedAppointment, setCompletedAppointment] = useState(0);
  const [total, setTotal] = useState(0);
  const { data: appointments } = useGetAllAppointments({
    beginTime: dayjs().format("MM/DD/YYYY"),
    endTime: dayjs().format("MM/DD/YYYY"),
  });

  const { data: staffInfo } = useGetAccount();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const completedAppointment = appointments?.data?.items?.filter(
      (app) => app.status === "Done"
    ).length;
    const totalAppointments = appointments?.data?.items?.length;
    console.log(completedAppointment);
    console.log(totalAppointments);

    setCompletedAppointment(completedAppointment ?? 0);
    setTotal(totalAppointments ?? 0);
  }, [appointments]);

  return (
    <Container>
      <ContentWrapper>
        <WelcomeSection>
          <h1>
            {getCurrentGreeting()}, {staffInfo?.data?.first_Name}!
          </h1>
        </WelcomeSection>

        <Grid>
          {staffInfo && (
            <ProfileCard>
              <ProfileHeader>
                <StyledAvatar
                  size={60}
                  src={`https://ui-avatars.com/api/?name=${staffInfo.data?.last_Name}&background=667eea&color=fff&bold=true`}
                  alt="Avatar"
                />
                <Title
                  level={3}
                  style={{ margin: "1rem 0 0.5rem", color: "#fffff" }}
                >
                  {staffInfo.data?.first_Name} {staffInfo.data?.last_Name}
                </Title>
                <RoleTag>{staffInfo.data?.role}</RoleTag>
              </ProfileHeader>

              <ProfileInfo>
                <InfoRow>
                  <IdCard size={20} />
                  <span>ID:</span>
                  <span style={{ marginLeft: "auto", color: "#6b7280" }}>
                    {staffInfo.data?.id}
                  </span>
                </InfoRow>
                <InfoRow>
                  <Phone size={20} />
                  <span>Phone:</span>
                  <span style={{ marginLeft: "auto", color: "#6b7280" }}>
                    {staffInfo.data?.phone}
                  </span>
                </InfoRow>
                <InfoRow>
                  <Mail size={20} />
                  <span>Email:</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "#6b7280",
                      fontSize: "0.85rem",
                    }}
                  >
                    {staffInfo.data?.email}
                  </span>
                </InfoRow>
              </ProfileInfo>

              <StyledButton
                type="primary"
                icon={<UserRoundPen size={18} />}
                block
              >
                Edit Profile
              </StyledButton>
            </ProfileCard>
          )}

          <StyledCard>
            <Title
              level={4}
              style={{ marginBottom: "1.5rem", color: "#1f2937" }}
            >
              Today's Statistics
            </Title>
            <StatsGrid>
              <StatBox $type="primary">
                <Calendar size={28} />
                <Statistic
                  title="Total Appointments"
                  value={appointments?.data?.items?.length ?? 0}
                />
              </StatBox>
              <StatBox $type="success">
                <Activity size={28} />
                <Statistic
                  title="Completed"
                  value={
                    appointments?.data?.items?.filter(
                      (a) => a.status === "Done"
                    ).length ?? 0
                  }
                />
              </StatBox>
              <StatBox $type="warning">
                <TrendingUp size={28} />
                <Statistic
                  title="Success Rate"
                  value={Number((completedAppointment / total) * 100).toFixed(
                    2
                  )}
                  suffix="%"
                />
              </StatBox>
              <StatBox $type="info">
                <Clock size={28} />
                <Statistic
                  title="Pending"
                  value={
                    appointments?.data?.items?.filter(
                      (a) => a.status === "Pending"
                    ).length ?? 0
                  }
                />
              </StatBox>
            </StatsGrid>
          </StyledCard>
        </Grid>

        {/* Recent Appointments */}
        <TableContainer>
          <TableHeader>
            <h3>Recent Appointments</h3>
          </TableHeader>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Services</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments?.data?.items?.map((appointment) => (
                <tr key={appointment.id}>
                  <td style={{ fontWeight: 600, color: "#667eea" }}>
                    #{appointment.id}
                  </td>
                  <td>{formatDate(appointment.appointmentDate)}</td>
                  <td style={{ fontWeight: 500 }}>
                    {appointment.customerName}
                  </td>
                  <td>
                    {appointment.services.slice(0, 2).map((service) => (
                      <ServiceTag key={service.id}>{service.name}</ServiceTag>
                    ))}
                    {appointment.services.length > 2 && (
                      <ServiceTag>
                        +{appointment.services.length - 2}
                      </ServiceTag>
                    )}
                  </td>
                  <td>
                    <StatusTag status={appointment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      </ContentWrapper>
    </Container>
  );
};

export default StaffDashboard;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #778be4 0%, #d7ffdf 30%);
  padding: 2rem;

  * {
    font-family: "Outfit", sans-serif;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  color: white;
  margin-bottom: 2rem;

  h1 {
    color: white;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: none;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  .ant-card-body {
    padding: 2rem;
  }
`;

const ProfileCard = styled(StyledCard)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    border-radius: 20px 20px 0 0;
  }
`;

const ProfileHeader = styled.div`
  position: relative;
  text-align: center;
  margin-top: 5%;
`;

const StyledAvatar = styled(Avatar)`
  border: 5px solid white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  margin-top: -40px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9ff;
  border-radius: 12px;
  color: #4b5563;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:hover {
    background: #eff6ff;
    transform: translateX(5px);
  }

  svg {
    color: #667eea;
    flex-shrink: 0;
  }

  span:first-of-type {
    font-weight: 600;
    color: #374151;
  }
`;

const RoleTag = styled(Tag)`
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 1rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const StatBox = styled.div<{
  $type: "primary" | "success" | "warning" | "info";
}>`
  background: ${({ $type }) =>
    ({
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      success: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      warning: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      info: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    }[$type])};
  padding: 1.5rem;
  border-radius: 16px;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    transition: all 0.5s ease;
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    &::before {
      top: -100%;
      right: -100%;
    }
  }

  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .ant-statistic-content {
    color: white;
    font-weight: 700;
    font-size: 1.8rem;
  }

  svg {
    opacity: 0.9;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  th,
  td {
    padding: 1rem 1.25rem;
    text-align: left;
  }

  th {
    font-weight: 600;
    color: #6b7280;
    background: #f9fafb;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e5e7eb;
  }

  tbody tr {
    transition: all 0.3s ease;
    border-bottom: 1px solid #f3f4f6;

    &:hover {
      background: #f9fafb;
      transform: scale(1.01);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }

  tr:last-child td {
    border-bottom: none;
  }

  td {
    font-size: 0.95rem;
    color: #374151;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 12px;
  height: 45px;
  font-weight: 600;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
`;

const ServiceTag = styled(Tag)`
  border-radius: 8px;
  padding: 0.25rem 0.75rem;
  font-weight: 500;
  border: none;
  background: #eff6ff;
  color: #3b82f6;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
`;
