import React, { useEffect, useState } from "react";
import { Table, Tag, Avatar, Space, Select, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { PartHistoryUpdateModel } from "../../../models/Statistic/PartHistoryUpdateModel";
import { ActionTypeEnum } from "../../../models/enums/ActionTypeEnum";
import { useNotification } from "../../../context/useNotification";
import { getHistoryParts } from "../../../services/adminService";
import { useDebounce } from "../../../hooks/useDebounce";
import type { Dayjs } from "dayjs";
import { Pagination } from "../../../components/Paginations/Pagination";
import Search from "antd/es/input/Search";

const { RangePicker } = DatePicker;
const { Option } = Select;

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

export const PartHistoryTab: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<PartHistoryUpdateModel[]>([]);
  const [actionType, setActionType] = useState<ActionTypeEnum | undefined>(undefined);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const debouncedSearch = useDebounce(search, 500);

  const notification = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fromDate, toDate] = dateRange
        ? [dateRange[0]?.format("YYYY-MM-DD"), dateRange[1]?.format("YYYY-MM-DD")]
        : [undefined, undefined];
      const response = await getHistoryParts({
        keyword: debouncedSearch,
        fromDate: fromDate || "",
        toDate: toDate || "",
        actionType: actionType,
        pageIndex: pageIndex,
        pageSize: pageSize,
      });
      setData(response.data?.items.filter((record) => record.actionType !== ActionTypeEnum.Restore) ?? []);
      setTotalItems(response.data?.totalItems ?? 0);
      setTotalPages(response.data?.totalPages ?? 1);
      setPageSize(response.data?.pageSize ?? 10);
    } catch (error) {
      notification.error({ message: "Error", description: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, dateRange, actionType, pageIndex, pageSize]);

  const columns: ColumnsType<PartHistoryUpdateModel> = [
    {
      title: "Parts",
      dataIndex: "partName",
      key: "partName",
      render: (text, record) => (
        <Space>
          <Avatar src={record.imageUrl} shape="square" />
          <Space direction="vertical" size={0}>
            <span style={{ fontWeight: 600 }}>{text}</span>
            <span style={{ fontSize: "0.8rem", color: "#888" }}>{record.partCategoryName}</span>
          </Space>
        </Space>
      ),
    },
    {
      title: "Action",
      dataIndex: "actionType",
      key: "actionType",
      render: (action: ActionTypeEnum) => {
        const color = action === ActionTypeEnum.Create ? "green" : action === ActionTypeEnum.Update ? "orange" : "red";
        return (
          <Tag color={color} className={`action-tag-${action}`}>
            {action}
          </Tag>
        );
      },
    },
    {
      title: "Update By",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Time",
      dataIndex: "changeDate",
      key: "changeDate",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Change Details",
      key: "changes",
      render: (_, record) => (
        <Space direction="vertical" size={2} className="change-diff">
          {record.oldQuantity !== record.newQuantity && (
            <div className="change-item">
              <span className="change-label">Quantity:</span>
              <span className="change-old">{record.oldQuantity}</span>
              <span>→</span>
              <span className="change-new">{record.newQuantity}</span>
            </div>
          )}

          {record.oldUnitPrice !== record.newUnitPrice && (
            <div className="change-item">
              <span className="change-label">Unit Price:</span>
              <span className="change-old">{formatCurrency(record.oldUnitPrice)}</span>
              <span>→</span>
              <span className="change-new">{formatCurrency(record.newUnitPrice)}</span>
            </div>
          )}

          {record.oldReplacePrice !== record.newReplacePrice && (
            <div className="change-item">
              <span className="change-label">Replacement Price:</span>
              <span className="change-old">{formatCurrency(record.oldReplacePrice)}</span>
              <span>→</span>
              <span className="change-new">{formatCurrency(record.newReplacePrice)}</span>
            </div>
          )}
        </Space>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  const handleSearch = (search: string) => {
    setSearch(search);
    setPageIndex(1);
  };

  return (
    <div className="tab-pane-content">
      <div className="filter-bar">
        <Search
          placeholder="Search by part name, service name..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <RangePicker onChange={(dates) => setDateRange(dates as any)} />
        <Select
          placeholder="Filter by action"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => setActionType(value)}
        >
          <Option value={ActionTypeEnum.Create}>Create</Option>
          <Option value={ActionTypeEnum.Update}>Update</Option>
          <Option value={ActionTypeEnum.Delete}>Delete</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => `${record.partName}-${record.changeDate}`}
        loading={loading}
        pagination={false}
      />

      <Pagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPage={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
