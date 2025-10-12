import React from "react";
import ApplicationForm from "../../../components/Application/Application";
import SortTable from "../../Technician/Technician_Component/SortTable";
import ApplicationCard from "./ApplicationCard";
import { useQuery } from "@tanstack/react-query";
import { getApplications } from "../../../services/getApplicationApi";
import type { ApplicationResponseDTO } from "../../../models/ApplicationModel/ApplicationModels";
import {
  PageWrapper,
  SectionTitle,
  ApplicationsContainer,
  LoadingText,
  ErrorText,
  EmptyText,
} from "./ApplicationPage.styled";

interface ApplicationPageProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSuccess?: (data: ApplicationResponseDTO) => void;
  onError?: (message: string) => void;
}

const ApplicationPage: React.FC<ApplicationPageProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onSuccess,
  onError,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myApplications"],
    queryFn: () => getApplications({ isApproved: undefined, pageSize: 50 }),
  });

  const applications: ApplicationResponseDTO[] = data?.data?.items ?? [];

  return (
    <PageWrapper>
      <SortTable sortName={tabs} active={activeTab} onChange={onTabChange} />

      {activeTab === "Send Application" ? (
        <ApplicationForm onSuccess={onSuccess} onError={onError} />
      ) : activeTab === "My Applications" ? (
        <>
          <SectionTitle>My Applications</SectionTitle>
          <ApplicationsContainer>
            {isLoading && <LoadingText>Loading applications...</LoadingText>}
            {isError && <ErrorText>Failed to load applications.</ErrorText>}
            {!isLoading && applications.length === 0 && (
              <EmptyText>You have no leave applications yet.</EmptyText>
            )}
            {applications.map((app) => (
              <ApplicationCard key={app.createdAt} application={app} />
            ))}
          </ApplicationsContainer>
        </>
      ) : (
        <div style={{ width: "100%", textAlign: "center", marginTop: "40px" }}>
          <h2 style={{ color: "#16a34a" }}>{activeTab}</h2>
        </div>
      )}
    </PageWrapper>
  );
};

export default ApplicationPage;
