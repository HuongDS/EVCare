import React, { useEffect, useState } from "react";
import { Statistic, Typography } from "antd";
import {
  Calendar,
  Activity,
  Mail,
  Phone,
  IdCard,
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

    setCompletedAppointment(completedAppointment ?? 0);
    setTotal(totalAppointments ?? 0);
  }, [appointments]);

  return (
    <Container>
      <ContentWrapper>
        <WelcomeSection>
          <h1>
            {getCurrentGreeting()},{" "}
            {staffInfo?.data?.first_Name + " " + staffInfo?.data?.last_Name}!
          </h1>
        </WelcomeSection>

        <Grid>
          {staffInfo && (
            <ProfileCard>
              <ProfileHeader>
                <StyledAvatar
                  size={60}
                  src={`https://ui-avatars.com/api/?name=${staffInfo.data?.first_Name}&background=667eea&color=fff&bold=true`}
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
                  <span>Account ID:</span>
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

import {
  Container,
  ContentWrapper,
  Grid,
  InfoRow,
  ProfileCard,
  ProfileHeader,
  ProfileInfo,
  RoleTag,
  ServiceTag,
  StatBox,
  StatsGrid,
  StyledAvatar,
  StyledCard,
  StyledTable,
  TableContainer,
  TableHeader,
  WelcomeSection,
} from "./Staff_General.styled";
