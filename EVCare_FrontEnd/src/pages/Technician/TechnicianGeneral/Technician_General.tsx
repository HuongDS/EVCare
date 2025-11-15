import React, { useEffect, useState } from "react";
import { Statistic, Typography } from "antd";
import {
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  Phone,
  Mail,
  UserRoundPen,
} from "lucide-react";
import dayjs from "dayjs";

import { useGetTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import { useGetAccount } from "../../../services/authService";
import StatusTag from "../../../components/StatusTags/StatusTag";
import { useNavigate } from "react-router-dom";
import {
  Container,
  ContentWrapper,
  WelcomeSection,
  Grid,
  ProfileCard,
  ProfileHeader,
  StyledAvatar,
  RoleTag,
  ProfileInfo,
  InfoRow,
  StatsGrid,
  StatBox,
  TableContainer,
  TableHeader,
  StyledTable,
  StyledButton,
  ServiceTag,
  StyledCard,
} from "./Technician_General.styled";

import { TechnicianWorkingSessionEnum } from "../../../models/enums";

const { Title } = Typography;

interface Service {
  id: number;
  name: string;
}

interface TechnicianAppointment {
  id: number;
  appointmentDate: string;
  customerName: string;
  services: Service[];
  status: string;
}
const TechnicianGeneral: React.FC = () => {
  const [appointments, setAppointments] = useState<TechnicianAppointment[]>([]);
  const [completedAppointment, setCompletedAppointment] = useState(0);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const { data: techInfo } = useGetAccount();
  const statuses = [
    TechnicianWorkingSessionEnum.ADDING_PART,
    TechnicianWorkingSessionEnum.CONFIRM,
    TechnicianWorkingSessionEnum.INPROGRESS,
    TechnicianWorkingSessionEnum.COMPLETED,
    TechnicianWorkingSessionEnum.CANCELED,
  ];

  const queries = statuses.map((status) =>
    useGetTechnicianAppointments({
      Status: String(status),
      BeginTime: dayjs().format("MM/DD/YYYY"),
      EndTime: dayjs().format("MM/DD/YYYY"),
      PageSize: 100,
      PageIndex: 1,
    })
  );

  useEffect(() => {
    const allAppointments = queries.flatMap((q) => q.data?.data?.items ?? []);

    const mappedAppointments: TechnicianAppointment[] = allAppointments.map(
      (a) => ({
        id: a.id,
        appointmentDate: a.appointmentDate,
        customerName: a.customerName,
        status: a.status,
        services: a.services.map((s, index) => ({ id: index, name: s })),
      })
    );

    const recentAppointments = mappedAppointments
      .sort(
        (a, b) =>
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime()
      )
      .slice(0, 5);

    setAppointments(recentAppointments);

    const completed = mappedAppointments.filter(
      (app) => app.status === "Completed"
    ).length;
    setCompletedAppointment(completed);
    setTotal(mappedAppointments.length);
  }, [
    queries.map((q) => q.data).join?.(""),
    queries.map((q) => q.data).toString(),
  ]);

  const formatDate = (dateString: string) => {
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

  return (
    <Container>
      <ContentWrapper>
        <WelcomeSection>
          <h1>
            {getCurrentGreeting()}, {techInfo?.data?.first_Name}!
          </h1>
        </WelcomeSection>

        <Grid>
          {techInfo && (
            <ProfileCard>
              <ProfileHeader>
                <StyledAvatar
                  size={60}
                  src={`https://ui-avatars.com/api/?name=${techInfo.data?.last_Name}&background=667eea&color=fff&bold=true`}
                  alt="Avatar"
                />
                <Title
                  level={3}
                  style={{ margin: "1rem 0 0.5rem", color: "#111" }}
                >
                  {techInfo.data?.first_Name} {techInfo.data?.last_Name}
                </Title>
                <RoleTag>{techInfo.data?.role}</RoleTag>
              </ProfileHeader>

              <ProfileInfo>
                <InfoRow>
                  <Phone size={20} />
                  <span>Phone:</span>
                  <span style={{ marginLeft: "auto", color: "#6b7280" }}>
                    {techInfo.data?.phone}
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
                    {techInfo.data?.email}
                  </span>
                </InfoRow>
              </ProfileInfo>

              <StyledButton
                type="primary"
                icon={<UserRoundPen size={18} />}
                block
                onClick={() => {
                  navigate("/account-information");
                }}
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
                <Statistic title="Total Appointments" value={total} />
              </StatBox>
              <StatBox $type="success">
                <Activity size={28} />
                <Statistic title="Completed" value={completedAppointment} />
              </StatBox>
              <StatBox $type="warning">
                <TrendingUp size={28} />
                <Statistic
                  title="Success Rate"
                  value={Number(
                    (completedAppointment / (total || 1)) * 100
                  ).toFixed(2)}
                  suffix="%"
                />
              </StatBox>
              <StatBox $type="info">
                <Clock size={28} />
                <Statistic
                  title="Pending"
                  value={
                    appointments.filter((a) => a.status === "Pending").length
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
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td style={{ fontWeight: 600, color: "#667eea" }}>
                    #{appointment.id}
                  </td>
                  <td>{formatDate(appointment.appointmentDate)}</td>
                  <td style={{ fontWeight: 500 }}>
                    {appointment.customerName}
                  </td>
                  <td>
                    {appointment.services.slice(0, 2).map((s) => (
                      <ServiceTag key={s.id}>{s.name}</ServiceTag>
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

export default TechnicianGeneral;
