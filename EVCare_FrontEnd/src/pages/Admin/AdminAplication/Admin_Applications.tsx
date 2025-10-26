// src/pages/admin/LeaveManagementPage.tsx
import React, { useEffect, useState } from "react";
import type { ApplicationAdminViewDto } from "../../../models/ApplicationModel/ApplicationAdminViewDto";
import { ApplicationStatusEnum } from "../../../models/enums/ApplicationStatusEnum";
import {
  ContentWrapper,
  FilterBar,
  FilterBarItem,
  GlassContainer,
  Header,
  PageWrapper,
  RequestTable,
  StatusBadge,
  Subtitle,
  Title,
  ViewButton,
} from "./Admin_Application.styled";
import { DatePicker, notification, Select } from "antd";
import { getAllAplications } from "../../../services/applicationServices";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";
import { Pagination } from "../../../components/Paginations/Pagination";
import type { RangePickerProps } from "antd/es/date-picker";
import { SearchBar } from "./SearchBar";
import LazyLeaveDetailModal from "./LazyLeaveDetailModal";

const { Option } = Select;

const getStatusBadge = (status: ApplicationStatusEnum) => {
  switch (status) {
    case ApplicationStatusEnum.PENDING:
      return <span className="status-badge status-pending">Pending</span>;
    case ApplicationStatusEnum.APPROVED:
      return <span className="status-badge status-approved">Approved</span>;
    case ApplicationStatusEnum.REJECTED:
      return <span className="status-badge status-rejected">Denied</span>;
    default:
      return null;
  }
};

export const Admin_Applications: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationAdminViewDto[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationAdminViewDto | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<ApplicationStatusEnum | undefined>(undefined);
  const [dateRange, setDateRange] = useState<RangePickerProps["value"]>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fromDate = dateRange?.[0] ? dateRange[0].toDate().toDateString() : "";
        const toDate = dateRange?.[1] ? dateRange[1].toDate().toDateString() : "";

        let response = null;
        if (fromDate != "" && toDate != "") {
          response = await getAllAplications({ status, keyword, fromDate, toDate, pageSize, pageIndex });
        } else {
          response = await getAllAplications({ status, keyword, pageSize, pageIndex });
        }
        if (response == null || !response.data) {
          throw new Error(ERROR_MESSAGE.FETCH_DATA_FAILED);
        }
        setApplications(response.data.items ?? []);
        setTotalItems(response.data.totalItems ?? 0);
        setTotalPages(response.data.totalPages ?? 0);
        setPageIndex(response.data.pageIndex ?? pageIndex);
        setPageSize(response.data.pageSize ?? pageSize);
        setRefresh(false);
      } catch (error) {
        notification.error({
          message: "Applications",
          description: (error as Error).message,
        });
      }
    };

    fetchData();
  }, [pageIndex, pageSize, keyword, status, dateRange, refresh]);

  const onPageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
  };

  const handleSearch = (value: string) => {
    setPageIndex(1);
    setKeyword(value.trim());
  };

  const handleStatusChange = (value: ApplicationStatusEnum | undefined) => {
    setPageIndex(1);
    setStatus(value);
  };

  const handleDateRangeChange = (dates: RangePickerProps["value"]) => {
    setPageIndex(1);
    setDateRange(dates);
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <Header>
          <Title>Approval of Leave Request</Title>
          <Subtitle>Manage and respond to employee leave requests (technicians, staff).</Subtitle>
        </Header>

        <FilterBar>
          <SearchBar search={keyword} placeholder="Search by Employee Name or ID" onSearch={handleSearch} />
          <FilterBarItem>
            <Select
              defaultValue={undefined}
              placeholder="Filter by status"
              value={status}
              onChange={handleStatusChange}
              allowClear
            >
              <Option value={undefined}>All Status</Option>
              <Option value={ApplicationStatusEnum.PENDING}>Pending</Option>
              <Option value={ApplicationStatusEnum.APPROVED}>Approved</Option>
              <Option value={ApplicationStatusEnum.REJECTED}>Rejected</Option>
            </Select>
          </FilterBarItem>

          <FilterBarItem>
            <DatePicker.RangePicker value={dateRange} onChange={handleDateRangeChange} />
          </FilterBarItem>
        </FilterBar>

        <GlassContainer>
          <RequestTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Day off</th>
                <th>Date sent</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.employeeId}</td>
                  <td>{app.employeeName}</td>
                  <td>{new Date(app.dateOff).toLocaleDateString("vi-VN")}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <StatusBadge status={app.status}>{getStatusBadge(app.status)}</StatusBadge>
                  </td>
                  <td>
                    <ViewButton onClick={() => setSelectedApp(app)}>Details</ViewButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </RequestTable>
        </GlassContainer>

        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPage={totalPages}
          onPageChange={onPageChange}
        />

        {selectedApp && (
          <LazyLeaveDetailModal setRefresh={setRefresh} application={selectedApp} onClose={handleCloseModal} />
        )}
      </ContentWrapper>
    </PageWrapper>
  );
};
