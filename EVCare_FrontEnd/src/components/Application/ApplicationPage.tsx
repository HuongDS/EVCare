// src/pages/Shared/Application/ApplicationPage.tsx
import React, { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import SortTable from "../../pages/Technician/Technician_Component/SortTable";
import ApplicationCard from "./ApplicationCard";
import { useQuery } from "@tanstack/react-query";
import { getApplications } from "../../services/getApplicationApi";
import type {
  ApplicationResponseDTO,
  ResponseDto,
  PageModel,
} from "../../models/ApplicationModel/ApplicationModels";
import {
  PageWrapper,
  SectionTitle,
  ApplicationsContainer,
  LoadingText,
  ErrorText,
  EmptyText,
  PaginationWrapper,
} from "./ApplicationPage.styled";
import { Pagination } from "../Paginations/Pagination";

interface ApplicationPageProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSuccess?: (data: ApplicationResponseDTO) => void;
  onError?: (message: string) => void;
}

const PAGE_SIZE = 3; // Số card hiển thị mỗi trang

const ApplicationPage: React.FC<ApplicationPageProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onSuccess,
  onError,
}) => {
  const [pageIndex, setPageIndex] = useState(1);

  const {
    data: applicationsData,
    isLoading,
    isError,
  } = useQuery<ResponseDto<PageModel<ApplicationResponseDTO>>, Error>({
    queryKey: ["myApplications", pageIndex],
    queryFn: () =>
      getApplications({
        isApproved: undefined,
        pageSize: PAGE_SIZE,
        pageIndex,
      }),
    staleTime: 1000 * 60,
  });

  const applications = applicationsData?.data?.items ?? [];
  const totalPages = applicationsData?.data?.totalPages ?? 1;
  const totalItems = applicationsData?.data?.totalItems ?? 0;

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  return (
    <PageWrapper>
      <SortTable sortName={tabs} active={activeTab} onChange={onTabChange} />

      {activeTab === "Send Application" ? (
        <ApplicationForm
          onSuccess={(data) => {
            onSuccess?.(data);
            setPageIndex(1);
          }}
          onError={onError}
        />
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
              <ApplicationCard application={app} />
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
          <h2 style={{ color: "#16a34a" }}>{activeTab}</h2>
        </div>
      )}
    </PageWrapper>
  );
};

export default ApplicationPage;
