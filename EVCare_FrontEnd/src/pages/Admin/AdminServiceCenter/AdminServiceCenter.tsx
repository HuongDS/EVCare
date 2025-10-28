import React, { useState, useEffect, useCallback } from "react";
import {
  PageWrapper,
  Header,
  Title,
  Instruction,
  ConfigWrapper,
  ConfigGrid,
  FullWidthWrapper,
  SectionTitle,
  InputGroup,
  StyledLabel,
  StyledInput,
  StyledSelect,
  InstructionText,
  FormActions,
  SubmitButton,
  LoadingSpinner,
} from "./AdminServiceCenter.styled";
import { FaSave, FaBuilding, FaRegClock, FaTools } from "react-icons/fa";
import { useNotification } from "../../../context/useNotification";
import SpinnerComponent from "../../../components/SpinnerComponent";
import type { ServiceCenterAdminModel } from "../../../models/ServiceCenter/ServiceCenterAdminModel";
import { adminGetCenterInformation, updateCenterInformation } from "../../../services/serviceCenterService";
import { PHONE_NUMBER_REGEX } from "../../../constants/regexs/PhoneNumberRegex";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AdminServiceCenter() {
  const [formData, setFormData] = useState<ServiceCenterAdminModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminGetCenterInformation();
      setFormData(response?.data ?? null);
    } catch (error) {
      notification.error({ message: "Error", description: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [notification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumericField = ["capacity", "workSlot", "dailyBookingLimit"].includes(name);
    const processedValue = isNumericField ? parseInt(value) || 0 : value;
    setFormData((prev) => (prev ? { ...prev, [name]: processedValue } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSubmitting(true);
    try {
      if (formData.address.trim().length <= 0) {
        throw new Error("Please input address.");
      }
      if (!PHONE_NUMBER_REGEX.test(formData.hotline)) {
        throw new Error("Please input valid phonenumber.");
      }
      if (formData.name.trim().length <= 0) {
        throw new Error("Please input center's name.");
      }
      if (formData.capacity <= 0 || formData.dailyBookingLimit <= 0 || formData.workSlot <= 0) {
        throw new Error("Capacity, Daily Booking Limit or Work Slot must be greater than 0.");
      }
      const response = await updateCenterInformation(formData);
      notification.success({ message: "Success", description: response.message });
    } catch (error) {
      notification.error({ message: "Error", description: (error as Error).message });
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div style={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
          <SpinnerComponent />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header>
        <Title>Service Center Configuration</Title>
        <Instruction>Manage your center's operational details, hours, and booking capacity.</Instruction>
      </Header>

      <ConfigWrapper
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ConfigGrid>
          <SectionTitle>
            <FaBuilding />
            Basic Information
          </SectionTitle>

          <InputGroup>
            <StyledLabel htmlFor="name">Center Name</StyledLabel>
            <StyledInput
              id="name"
              name="name"
              type="text"
              value={formData?.name || ""}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </InputGroup>

          <InputGroup>
            <StyledLabel htmlFor="hotline">Hotline</StyledLabel>
            <StyledInput
              id="hotline"
              name="hotline"
              type="tel"
              value={formData?.hotline || ""}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </InputGroup>

          <FullWidthWrapper>
            <InputGroup>
              <StyledLabel htmlFor="address">Address</StyledLabel>
              <StyledInput
                id="address"
                name="address"
                type="text"
                value={formData?.address || ""}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
            </InputGroup>
          </FullWidthWrapper>

          <SectionTitle>
            <FaRegClock />
            Operating Hours
          </SectionTitle>

          <InputGroup>
            <StyledLabel htmlFor="openTime">Open Time</StyledLabel>
            <StyledInput
              id="openTime"
              name="openTime"
              type="time"
              value={formData?.openTime || ""}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </InputGroup>

          <InputGroup>
            <StyledLabel htmlFor="closeTime">Close Time</StyledLabel>
            <StyledInput
              id="closeTime"
              name="closeTime"
              type="time"
              value={formData?.closeTime || ""}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </InputGroup>

          <InputGroup>
            <StyledLabel htmlFor="workStartDay">Work Start Day</StyledLabel>
            <StyledSelect
              id="workStartDay"
              name="workStartDay"
              value={formData?.workStartDay || "Monday"}
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </StyledSelect>
          </InputGroup>

          <InputGroup>
            <StyledLabel htmlFor="workEndDay">Work End Day</StyledLabel>
            <StyledSelect
              id="workEndDay"
              name="workEndDay"
              value={formData?.workEndDay || "Saturday"}
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </StyledSelect>
          </InputGroup>

          <SectionTitle>
            <FaTools />
            Operational Capacity
          </SectionTitle>

          <InputGroup>
            <StyledLabel htmlFor="capacity">Concurrent Capacity</StyledLabel>
            <StyledInput
              id="capacity"
              name="capacity"
              type="number"
              min={1}
              value={formData?.capacity || 1}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
            <InstructionText>Max number of vehicles serviced at the same time.</InstructionText>
          </InputGroup>

          <InputGroup>
            <StyledLabel htmlFor="workSlot">Work Slots</StyledLabel>
            <StyledInput
              id="workSlot"
              name="workSlot"
              type="number"
              min={1}
              value={formData?.workSlot || 1}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
            <InstructionText>Number of bookable slots per day (e.g., 8 slots).</InstructionText>
          </InputGroup>

          <FullWidthWrapper>
            <InputGroup>
              <StyledLabel htmlFor="dailyBookingLimit">Daily Booking Limit</StyledLabel>
              <StyledInput
                id="dailyBookingLimit"
                name="dailyBookingLimit"
                type="number"
                min={1}
                value={formData?.dailyBookingLimit || 1}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
              <InstructionText>Total number of bookings allowed per day. (e.g., Capacity * Work Slots)</InstructionText>
            </InputGroup>
          </FullWidthWrapper>
        </ConfigGrid>

        <FormActions>
          <SubmitButton type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting ? <LoadingSpinner /> : <FaSave />}
            Save Changes
          </SubmitButton>
        </FormActions>
      </ConfigWrapper>
    </PageWrapper>
  );
}
