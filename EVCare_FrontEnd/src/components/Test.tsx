import StatusTag from "./StatusTags/StatusTag";
import { OrderStatusEnum } from "../models/enums";
import SuccessPopUp from "./StatusModal/SuccessModal";
import Error from "./StatusModal/FailModal";
import { ProgressSteps, stepsAppoinment } from "./ProgressStep/ProgressStep";
import Appoinment_Progress_Modal from "../pages/Staff/StaffManageAppointment/Appoinment_Progress_Modal";

export default function Test() {
  // const [showForm, setShowForm] = useState(false);
  const action = () => 1;
  const steps = stepsAppoinment;
  return (
    <>
      {/* <button onClick={() => setShowForm(true)}>Form Booking</button>
      <BookingForm show={showForm} handleClose={() => setShowForm(false)} /> */}
    </>
  );
}
