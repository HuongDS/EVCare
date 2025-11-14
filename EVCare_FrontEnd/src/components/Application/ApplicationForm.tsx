import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAccountInformation } from "../../services/accountService";
import {
  getCenterInformation,
  getBlockedDate,
} from "../../services/serviceCenterService";
import { sendApplication } from "../../services/sendApplicationApi";
import { getDateOff } from "../../services/getApplicationApi";
import type {
  ApplicationRequestDTO,
  ApplicationResponseDTO,
  ResponseDto,
} from "../../models/ApplicationModel/ApplicationModels";
import type { AccountViewModel } from "../../models/Accounts/accountViewModel";
import {
  FormContainer,
  Title,
  Field,
  Label,
  Input,
  Grid,
  ErrorText,
  SuccessText,
} from "./ApplicationForm.styled";
import dayjs from "dayjs";
import ButtonAction from "../Button/ButtonAction";
import DatePicker from "./DatePickerLazyPerformance";
import { Editor } from "@tinymce/tinymce-react";
import { useNotification } from "../../context/useNotification";

interface ApplicationFormProps {
  onSuccess?: (data: ApplicationResponseDTO) => void;
  onError?: (message: string) => void;
}

export default function ApplicationForm({
  onSuccess,
  onError,
}: ApplicationFormProps) {
  const queryClient = useQueryClient();
  const notification = useNotification();

  const [dateOff, setDateOff] = useState("");
  const [reason, setReason] = useState("");
  const [dateMessage, setDateMessage] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const { data: accountData, isLoading: accountLoading } = useQuery({
    queryKey: ["accountInfo"],
    queryFn: getAccountInformation,
  });
  const { data: centerData } = useQuery({
    queryKey: ["centerInfo"],
    queryFn: getCenterInformation,
  });
  const { data: blockedDatesData } = useQuery({
    queryKey: ["blockedDates"],
    queryFn: getBlockedDate,
  });
  const { data: userDateOffData } = useQuery({
    queryKey: ["userDateOffs"],
    queryFn: getDateOff,
  });

  const mutation = useMutation({
    mutationFn: (request: ApplicationRequestDTO) => sendApplication(request),
    onMutate: () => setLocalStatus("pending"),
    onSuccess: (res: ResponseDto<ApplicationResponseDTO | null>) => {
      if (res.statusCode === 200 && res.data) {
        setLocalStatus("success");
        notification.success({
          message: "Application Sent",
          description:
            "Your leave application has been submitted successfully!",
          showProgress: true,
        });
        queryClient.invalidateQueries({ queryKey: ["myApplications"] });
        onSuccess?.(res.data);
        setTimeout(() => resetForm(), 1500);
      } else {
        setLocalStatus("error");
        notification.error({
          message: "Send Failed",
          description: res.message || "Failed to send application.",
          showProgress: true,
        });
        onError?.(res.message || "Failed to send application.");
      }
    },
    onError: (error: unknown) => {
      console.error("Mutation error:", error);
      setLocalStatus("error");
      notification.error({
        message: "Network Error",
        description: "Failed to send application. Please try again later.",
        showProgress: true,
      });
      onError?.("Network error");
    },
  });

  const account: AccountViewModel | null = accountData?.data ?? null;
  const blockedDates: string[] =
    blockedDatesData?.data?.map((b) =>
      dayjs(b.dateTime).format("YYYY-MM-DD")
    ) ?? [];
  const userDateOffs: string[] = userDateOffData?.data ?? [];
  const center = centerData?.data;

  const validateDate = (selected: string): string | null => {
    const selectedDate = new Date(selected);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (selectedDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (selectedDate < today) return "Cannot select a past date.";
    if (diffDays < 2) return "You must apply at least 2 days in advance.";
    if (diffDays > 31) return "You cannot apply more than 1 month ahead.";
    if (blockedDates.includes(selected))
      return "This date is blocked (center closed).";
    if (userDateOffs.includes(selected))
      return "You have already requested leave on this date.";

    if (center) {
      const dayOfWeek = selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const workDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const startIndex = workDays.indexOf(center.workStartDay);
      const endIndex = workDays.indexOf(center.workEndDay);
      const allowedDays = workDays.slice(startIndex, endIndex + 1);
      if (!allowedDays.includes(dayOfWeek))
        return "This date is outside of working days.";
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !dateOff) return;

    const msg = validateDate(dateOff);
    if (msg) {
      setDateMessage(msg);
      setLocalStatus("error");
      notification.warning({
        message: "Invalid Date",
        description: msg,
        showProgress: true,
      });
      return;
    }

    mutation.mutate({ employeeID: account.id, dateOff, reason });
  };

  const resetForm = () => {
    setDateOff("");
    setReason("");
    setDateMessage(null);
    setLocalStatus("idle");
    mutation.reset();
  };

  if (accountLoading) return <p>Loading account info...</p>;

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Title>Application</Title>
      {account && (
        <>
          <Grid>
            <Field>
              <Label>First Name</Label>
              <Input readOnly value={account.first_Name} />
            </Field>
            <Field>
              <Label>Last Name</Label>
              <Input readOnly value={account.last_Name} />
            </Field>
          </Grid>
          <Grid>
            <Field>
              <Label>Email</Label>
              <Input readOnly value={account.email} />
            </Field>
          </Grid>
          <Field>
            <Label>Phone Number</Label>
            <Input readOnly value={account.phone || "default"} />
          </Field>
        </>
      )}

      <Field>
        <Label>
          Date Off <span style={{ color: "red" }}>*</span>
        </Label>
        <DatePicker
          value={dateOff}
          onChange={(val) => {
            setDateOff(val);
            setDateMessage(validateDate(val));
          }}
          validateDate={validateDate}
          blockedDates={blockedDates}
          userDateOffs={userDateOffs}
          center={center}
          error={dateMessage}
        />
        {dateMessage && <ErrorText>{dateMessage}</ErrorText>}
      </Field>

      <Field>
        <Label>Reason</Label>
        <Editor
          apiKey={import.meta.env.VITE_TINY_KEY}
          value={reason}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "table",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic underline | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Outfit,sans-serif; font-size:15px; line-height:1.6; }",
          }}
          onEditorChange={(newValue) => setReason(newValue)}
        />
      </Field>

      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ButtonAction
          text={
            localStatus === "pending"
              ? "Sending..."
              : localStatus === "success"
              ? "Sent Successfully"
              : localStatus === "error"
              ? "Send Again"
              : "Send"
          }
          variant="primary"
          type="submit"
          action={() => {}}
          disabled={localStatus === "pending"}
        />
      </div>

      {localStatus === "success" && (
        <SuccessText>Leave application submitted successfully!</SuccessText>
      )}
      {localStatus === "error" && (
        <ErrorText>Failed to send. Please try again.</ErrorText>
      )}
    </FormContainer>
  );
}
