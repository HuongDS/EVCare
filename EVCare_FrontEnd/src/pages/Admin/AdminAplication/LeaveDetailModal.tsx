import React, { useEffect, useState } from "react";
import type { EmployeeViewModel } from "../../../models/Employee/EmployeeViewModel";
import { RoleEnum } from "../../../models/enums";
import type { ApplicationAdminViewDto } from "../../../models/ApplicationModel/ApplicationAdminViewDto";
import { ApplicationStatusEnum } from "../../../models/enums/ApplicationStatusEnum";
import type { ApplicationUpdateDto } from "../../../models/ApplicationModel/ApplicationUpdateDto";
import {
  ActionButtons,
  ActionForm,
  ApproveButton,
  DenyButton,
  EmployeeAvatar,
  EmployeeInfo,
  InfoTable,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  NoteTextarea,
  ReasonBox,
  RequestInfo,
} from "./Admin_Application.styled";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { getEmployeeById } from "../../../services/adminService";
import { useNotification } from "../../../context/useNotification";
import { processApplication } from "../../../services/applicationServices";
import DOMPurify from "dompurify";

interface ModalProps {
  application: ApplicationAdminViewDto;
  onClose: () => void;
  setRefresh: (v: boolean) => void;
}

const LeaveDetailModal: React.FC<ModalProps> = ({
  application,
  onClose,
  setRefresh,
}) => {
  const [employee, setEmployee] = useState<EmployeeViewModel | null>(null);
  const [note, setNote] = useState(application.note || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const bareHTML = application.reason;
  const cleanHTML = DOMPurify.sanitize(bareHTML);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getEmployeeById(application.employeeId);
        setEmployee(res.data ?? null);
      } catch (error) {
        notification.error({
          message: "Error",
          description: (error as Error).message,
          showProgress: true,
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (newStatus: ApplicationStatusEnum) => {
    setIsSubmitting(true);
    const payload: ApplicationUpdateDto = {
      id: application.id,
      status: newStatus,
      note: note,
    };

    try {
      const res = await processApplication(payload);
      notification.success({
        message: "Process Application",
        description: res.message,
        showProgress: true,
      });
      setRefresh(true);
    } catch (error) {
      notification.error({
        message: "Error",
        description: (error as Error).message,
        showProgress: true,
      });
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>&times;</ModalCloseButton>
        <ModalBody>
          <EmployeeInfo>
            <h4>Sender information</h4>
            {!isLoading && employee ? (
              <>
                <EmployeeAvatar
                  src={employee.avatar || "default-avatar.png"}
                  alt="Avatar"
                />
                <strong>{employee.fullName}</strong>
                <p>
                  {employee.role === RoleEnum.TECHNICIAN
                    ? "Technician"
                    : "Staff"}
                </p>

                <InfoTable>
                  <tbody>
                    <tr>
                      <td>Email:</td>
                      <td>{employee.email}</td>
                    </tr>
                    <tr>
                      <td>Phone:</td>
                      <td>{employee.phone}</td>
                    </tr>

                    {employee.role === RoleEnum.TECHNICIAN && (
                      <tr>
                        <td>Exp. Year:</td>
                        <td>{employee.expYear || "N/A"} Years</td>
                      </tr>
                    )}
                  </tbody>
                </InfoTable>
              </>
            ) : (
              <SpinnerComponent />
            )}
          </EmployeeInfo>

          <RequestInfo>
            <h4>Application's Content</h4>
            <p>
              <strong>Day Off:</strong>{" "}
              {new Date(application.dateOff).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <strong>Date sent:</strong>{" "}
              {new Date(application.createdAt).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <strong>Reason:</strong>
            </p>
            <ReasonBox dangerouslySetInnerHTML={{ __html: cleanHTML }} />

            {application.status === ApplicationStatusEnum.PENDING && (
              <ActionForm>
                <h4>Note Response</h4>
                <NoteTextarea
                  placeholder="Enter reason for approval or rejection..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isSubmitting}
                />
                <ActionButtons>
                  <DenyButton
                    onClick={() => handleSubmit(ApplicationStatusEnum.REJECTED)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Rejected"}
                  </DenyButton>
                  <ApproveButton
                    onClick={() => handleSubmit(ApplicationStatusEnum.APPROVED)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing" : "Approved"}
                  </ApproveButton>
                </ActionButtons>
              </ActionForm>
            )}

            {application.status !== ApplicationStatusEnum.PENDING && (
              <ActionForm>
                <h4>Note</h4>
                <ReasonBox $isNote={true}>
                  {application.note || "(No notes)"}
                </ReasonBox>
              </ActionForm>
            )}
          </RequestInfo>
        </ModalBody>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default LeaveDetailModal;
