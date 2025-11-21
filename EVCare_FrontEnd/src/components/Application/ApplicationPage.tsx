import React, { useEffect, useState } from "react";
import ApplicationForm from "./ApplicationForm";
import SortTable from "../../pages/Technician/Technician_Component/SortTable";
import ApplicationCard from "./ApplicationCard";
import { getApplications } from "../../services/getApplicationApi";
import type { ApplicationResponseDTO } from "../../models/ApplicationModel/ApplicationModels";
import {
  PageWrapper,
  SectionTitle,
  ApplicationsContainer,
  LoadingText,
  EmptyText,
  PaginationWrapper,
} from "./ApplicationPage.styled";
import { Pagination } from "../Paginations/Pagination";
import { useNotification } from "../../context/useNotification";

interface ApplicationPageProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSuccess?: (data: ApplicationResponseDTO) => void;
  onError?: (message: string) => void;
}

const PAGE_SIZE = 10;

const ApplicationPage: React.FC<ApplicationPageProps> = ({ tabs, activeTab, onTabChange, onSuccess, onError }) => {
  const [pageIndex, setPageIndex] = useState(1);
  const [applicationsData, setApplicationsData] = useState<ApplicationResponseDTO[]>([]);
  const notification = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getApplications({ pageIndex: pageIndex, pageSize: PAGE_SIZE });
      setApplicationsData(response.data?.items ?? []);
      setTotalItems(response.data?.totalItems ?? 0);
      setTotalPages(response.data?.totalPages ?? 1);
    } catch (error) {
      notification.error({ message: (error as Error).message });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex]);

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  return (
    <PageWrapper>
      <SortTable sortName={tabs} active={activeTab} onChange={onTabChange} />

      {activeTab === "SendApplication" ? (
        <ApplicationForm
          onSuccess={(data) => {
            onSuccess?.(data);
            setPageIndex(1);
          }}
          onError={onError}
        />
      ) : activeTab === "MyApplications" ? (
        <>
          <SectionTitle>My Applications</SectionTitle>
          <ApplicationsContainer>
            {isLoading && <LoadingText>Loading applications...</LoadingText>}
            {!isLoading && applicationsData.length === 0 && <EmptyText>You have no leave applications yet.</EmptyText>}
            {applicationsData.map((app) => (
              <ApplicationCard key={app.createdAt} application={app} />
            ))}
          </ApplicationsContainer>
          <PaginationWrapper>
            {totalPages > 1 && (
              <Pagination
                pageIndex={pageIndex}
                pageSize={PAGE_SIZE}
                totalItems={totalItems}
                totalPage={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </PaginationWrapper>
        </>
      ) : (
        <div style={{ width: "100%", textAlign: "center", marginTop: "40px" }}>
          <h2 style={{ color: "#16a34a" }}>
            {activeTab === "SendApplication"
              ? "Send Application"
              : activeTab === "MyApplications"
              ? "My Applications"
              : activeTab}
          </h2>
        </div>
      )}
    </PageWrapper>
  );
};

export default ApplicationPage;
