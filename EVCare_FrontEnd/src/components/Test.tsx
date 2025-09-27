import StatusTag from "./StatusTags/StatusTag";
import { OrderStatusEnum } from "../models/enums";

export default function Test() {
  // const [showForm, setShowForm] = useState(false);
  return (
    <>
      {/* <button onClick={() => setShowForm(true)}>Form Booking</button>
      <BookingForm show={showForm} handleClose={() => setShowForm(false)} /> */}
      <StatusTag status={OrderStatusEnum.PROCESSING} />
    </>
  );
}
