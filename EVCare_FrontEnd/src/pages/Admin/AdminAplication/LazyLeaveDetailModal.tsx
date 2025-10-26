import React, { Suspense } from "react";
import type { ApplicationAdminViewDto } from "../../../models/ApplicationModel/ApplicationAdminViewDto";
import SpinnerComponent from "../../../components/SpinnerComponent";

const LeaveDetailModal = React.lazy(() => import("./LeaveDetailModal"));

interface ModalProps {
  application: ApplicationAdminViewDto;
  onClose: () => void;
  setRefresh: (v: boolean) => void;
}

export default function LazyLeaveDetailModal({ application, onClose, setRefresh }: ModalProps) {
  return (
    <Suspense fallback={<SpinnerComponent />}>
      <LeaveDetailModal setRefresh={setRefresh} application={application} onClose={onClose} />
    </Suspense>
  );
}
