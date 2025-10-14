import React, { Suspense } from "react";
import type { AppointmentViewDetailModel } from "../../models/AppointmentsModel/AppointmentViewDetailModel";
import SpinnerComponent from "../SpinnerComponent";

const ReviewModal = React.lazy(() => import("./ReviewModal"));

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  appointmentData: AppointmentViewDetailModel;
}

export default function LazyReviewModal({ open, onClose, appointmentData }: ReviewModalProps) {
  return (
    <Suspense fallback={<SpinnerComponent />}>
      <ReviewModal appointmentData={appointmentData} onClose={onClose} open={open} />
    </Suspense>
  );
}
