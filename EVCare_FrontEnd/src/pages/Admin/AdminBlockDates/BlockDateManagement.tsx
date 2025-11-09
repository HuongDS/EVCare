import React, { useState, useEffect } from "react";
import { Form, Input, Select, Space, Popconfirm, Badge, Tooltip } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  PageWrapper,
  Header,
  Title,
  Instruction,
  SplitLayout,
  CalendarColumn,
  FormColumn,
  StyledCalendar,
  FormPlaceholder,
  EvcareButton,
} from "./BlockDateManagement.styled";
import { BlockOutlined, PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import type { BlockDateViewDto } from "../../../models/ServiceCenter/BlockDateViewDto";
import { UnavailableTypeEnum } from "../../../models/enums/UnavailableTypeEnum";
import type { BlockDateCreateDto } from "../../../models/ServiceCenter/BlockDateCreateDto";
import { createBlockDate, deleteBlockDate, getBlockDates, updateBlockDate } from "../../../services/blockDateService";
import SpinnerComponent from "../../../components/SpinnerComponent";

const { Option } = Select;

const BlockDateManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [allBlockedDates, setAllBlockedDates] = useState<BlockDateViewDto[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedEvent, setSelectedEvent] = useState<BlockDateViewDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getBlockDates();
      setAllBlockedDates(response.data ?? []);
    } catch (error) {
      console.error("Failed to fetch blocked dates", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectDate = (date: Dayjs) => {
    setSelectedDate(date);
    const eventOnDate = allBlockedDates.find((event) => dayjs(event.dateTime).isSame(date, "day"));

    if (eventOnDate) {
      setSelectedEvent(eventOnDate);
      form.setFieldsValue({
        reason: eventOnDate.reason,
        unavailableType: eventOnDate.unavailableType,
      });
    } else {
      setSelectedEvent(null);
      form.resetFields();
    }
  };

  useEffect(() => {
    if (!isLoading) {
      handleSelectDate(selectedDate);
    }
  }, [isLoading, selectedDate]);

  const handleSubmit = async (values: { reason: string; unavailableType: UnavailableTypeEnum }) => {
    setIsApiLoading(true);
    const dto: BlockDateCreateDto = {
      date: selectedDate.format("YYYY-MM-DD"),
      reason: values.reason,
      unavailableType: values.unavailableType,
    };

    try {
      if (selectedEvent) {
        await updateBlockDate(dto);
      } else {
        await createBlockDate(dto);
      }
      await fetchData();
      handleSelectDate(selectedDate);
    } catch (error) {
      console.error("Failed to save data", error);
    }
    setIsApiLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setIsApiLoading(true);
    try {
      await deleteBlockDate(selectedEvent.dateTime);
      await fetchData();
      handleSelectDate(selectedDate);
    } catch (error) {
      console.error("Failed to delete data", error);
    }
    setIsApiLoading(false);
  };

  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  const cellRender = (date: Dayjs) => {
    const eventOnDate = allBlockedDates.find((event) => dayjs(event.dateTime).isSame(date, "day"));
    if (eventOnDate) {
      return (
        <Tooltip title={eventOnDate.reason}>
          <Badge status="success" className="event-marker" />
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <PageWrapper>
      <Header>
        <Title>BlockDate Management</Title> {/* <-- Dùng Title */}
        <Instruction>Select a date on the calendar to add, edit, or delete the center's blocked dates.</Instruction>
      </Header>
      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <SplitLayout>
          <CalendarColumn>
            <StyledCalendar
              onSelect={handleSelectDate}
              disabledDate={disabledDate}
              cellRender={cellRender}
              value={selectedDate}
            />
          </CalendarColumn>

          <FormColumn>
            {selectedDate ? (
              <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={isApiLoading}>
                <h3 className="form-title">
                  {selectedEvent ? <EditOutlined /> : <PlusOutlined />}
                  {selectedEvent ? " Edit Blocked Date" : " Add New Blocked Date"}
                </h3>

                <Form.Item label="Picked Date">
                  <Input value={selectedDate.format("DD/MM/YYYY")} disabled size="large" />
                </Form.Item>

                <Form.Item
                  name="reason"
                  label="Reason"
                  rules={[{ required: true, message: "Please input the reason..." }]}
                >
                  <Input.TextArea rows={6} placeholder="Example: Holiday on April 30th, system maintenance..." />
                </Form.Item>

                <Form.Item
                  name="unavailableType"
                  label="Type"
                  rules={[{ required: true, message: "Please select the type!" }]}
                >
                  <Select placeholder="Select the type of blocked date" size="large">
                    <Option value={UnavailableTypeEnum.Holiday}>Holiday</Option>
                    <Option value={UnavailableTypeEnum.Maintenance}>Maintenance</Option>
                    <Option value={UnavailableTypeEnum.OverCapacity}>OverCapacity</Option>
                  </Select>
                </Form.Item>

                <Space direction="vertical" style={{ width: "100%", marginTop: "1rem" }}>
                  <EvcareButton
                    type="primary"
                    htmlType="submit"
                    loading={isApiLoading}
                    size="large"
                    block
                    icon={selectedEvent ? <EditOutlined /> : <PlusOutlined />}
                  >
                    {selectedEvent ? "Update" : "Save"}
                  </EvcareButton>

                  {selectedEvent && (
                    <Popconfirm
                      title="Delete blocked date?"
                      description="Are you sure you want to delete this date?"
                      onConfirm={handleDelete}
                      okText="Confirm Delete"
                      cancelText="Cancel"
                      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                    >
                      <EvcareButton danger loading={isApiLoading} size="large" block icon={<DeleteOutlined />}>
                        Delete this date
                      </EvcareButton>
                    </Popconfirm>
                  )}
                </Space>
              </Form>
            ) : (
              <FormPlaceholder>
                <BlockOutlined />
                <span>Please select a date on the calendar</span>
              </FormPlaceholder>
            )}
          </FormColumn>
        </SplitLayout>
      )}
    </PageWrapper>
  );
};

export default BlockDateManagement;
