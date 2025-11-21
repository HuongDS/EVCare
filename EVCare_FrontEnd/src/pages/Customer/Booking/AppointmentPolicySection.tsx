import React from "react";
import { Card, Typography, Divider } from "antd";

const { Title, Paragraph, Text } = Typography;

interface Props {
  visible: boolean;
  handleSetVisible: () => void;
}

const AppointmentPolicySection: React.FC<Props> = ({
  visible,
  handleSetVisible,
}) => {
  return (
    <div>
      <Text
        underline
        style={{
          color: "#00ad4e",
          cursor: "pointer",
          fontWeight: 500,
        }}
        onClick={() => {
          handleSetVisible();
        }}
      >
        {visible
          ? "Hide Appointment Policies"
          : "Please agree with our policy to continue, View Appointment Policies"}
      </Text>

      {visible && (
        <Card
          bordered
          style={{
            marginTop: 12,
            background: "#fafafa",
            borderRadius: 12,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          <Typography>
            <Title level={5}>1. Appointment Confirmation</Title>
            <Paragraph>
              After a customer creates an appointment, the system will send a
              confirmation email to the registered email address. The customer{" "}
              <Text strong>must confirm the appointment within 24 hours</Text>{" "}
              of creation. If the appointment is not confirmed within 24 hours,
              it will be automatically canceled by the system.
            </Paragraph>

            <Divider />

            <Title level={5}>2. Service Modification</Title>
            <Paragraph>
              Once an appointment has been confirmed, the customer{" "}
              <Text strong>cannot modify the selected services</Text>
              (including service type, maintenance package, technician, etc.).
              If any change is needed, EVCare staff may assist in creating a new
              appointment and canceling the old one if necessary.
            </Paragraph>

            <Divider />

            <Title level={5}>3. Working Hours</Title>
            <Paragraph>
              Appointments can only be scheduled within the service center’s{" "}
              <Text strong>working hours</Text>
              (e.g., 08:00 – 17:00, Monday to Saturday). For same-day bookings,
              the appointment time must be{" "}
              <Text strong>at least 1 hour later than the current time</Text>.
              <br />
              Example: If the current time is 10:30, the earliest available time
              is 11:30.
            </Paragraph>

            <Divider />

            <Title level={5}>4. Appointment Limit per Customer</Title>
            <Paragraph>
              Each customer is allowed to create{" "}
              <Text strong>a maximum of 5 appointments per day</Text>. If this
              limit is exceeded, the system will reject the request and display
              the message:
              <br />
              <Text type="secondary">
                “You have reached the maximum of 5 appointments for today.
                Please select another day.”
              </Text>
            </Paragraph>

            <Divider />

            <Title level={5}>5. Appointment Cancellation</Title>
            <Paragraph>
              Appointments can be canceled{" "}
              <Text strong>at least 2 hours before the scheduled time</Text>.
              After this time, cancellations require manual confirmation from
              the staff.
            </Paragraph>
          </Typography>
        </Card>
      )}
    </div>
  );
};

export default AppointmentPolicySection;
