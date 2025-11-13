// import StatusTag from "./StatusTags/StatusTag";
// import { OrderStatusEnum } from "../models/enums";
// import OrderHistorySort from "../pages/Customer/CustomerComponent/OrderHistorySort";
// import OrderHistoryCard from "../pages/Customer/OrderHistory/Orders/OrderHistoryCard";

// import ColorSpinner from "../pages/Staff/StaffComponents/ColorSpinner";
// import TextWaitingEffect from "../pages/Staff/StaffComponents/TextWaitingEffect";
// import {
//   useGetPartsInServices,
//   useGetServicesInAppointment,
// } from "../services/appointmentTechnicianApi";

// import StockPredictionTable from "../pages/Staff/StaffManageInventory/AIPrediction";
// import StockPredictionDashboard from "../pages/Staff/StaffManageInventory/AIPrediction";

// import OTPForm from "../pages/Auth/sections/OTPForm";
// import { useAppDispatch } from "../states/store";
// import { closeModel3d, openModel3d } from "../states/uiSlice";
// import BackButton from "./Button/BackButton";
// import Skeleton from "./Skeletons/Skeleton";

// import SortDateRange from "../pages/Staff/StaffComponents/SortDateRange";
// import Payment_Success_Page from "../pages/Staff/StaffManageAppointment/Payment_Success_Page";

// import { SortDateButton } from "../pages/Staff/StaffComponents/SortDateButton";

// import Error from "./StatusModal/FailModal";
// import SuccessPopUp from "./StatusModal/SuccessModal";

// import DropdownMenu from "./Header/DropdownMenu";
// import { useGetPartDamage } from "./../services/Model3dService";

export default function Test() {
  // const [showForm, setShowForm] = useState(false);
  // const sortBy = ["All", "In Progress", "Done", "Cancelled"];
  // const { data: parts } = useGetPartDamage(112);

  // console.log(parts);
  // const dispatch = useAppDispatch();
  // const { data: services } = useGetServicesInAppointment(273);

  // const { data: parts } = useGetPartsInServices({});
  return (
    <>
      {/* <button onClick={() => setShowForm(true)}>Form Booking</button>
      <BookingForm show={showForm} handleClose={() => setShowForm(false)} /> */}
      {/* <StatusTag status={OrderStatusEnum.PROCESSING} /> */}
      {/* <OrderHistorySort sortName={sortBy} />
      <OrderHistoryCard /> */}
      {/* <DropdownMenu /> */}
      {/* <SuccessPopUp message="Login Fail" header="Login" action={() => 1} /> */}
      {/* <Error header="Login" message="Login Success" action={() => 1} /> */}
      {/* <SortDateButton onSort={() => 1} /> */}
      {/* <Payment_Success_Page /> */}
      {/* <SortDateRange onDateRangeChange={() => 1} /> */}
      {/* <button
        className="btn btn-primary"
        onClick={() => dispatch(openModel3d())}
      >
      <button className="btn btn-primary" onClick={() => dispatch(openModel3d())}>
        open
      </button>
      <h1>ĐAY LA MO HINH 3D PAGE</h1>

      <Skeleton /> */}
      {/* <BackButton /> */}
      {/* <StockPredictionTable onPageChange={() => 1} /> */}
      {/* <ColorSpinner width="3em" height="3em" />
      <TextWaitingEffect text="Waiting for processing" fontSize="20px" /> */}
    </>
  );
}
