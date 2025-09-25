import { useState } from "react";
import BookingForm from "../pages/Customer/Booking/BookingForm";

export default function Test() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <button onClick={() => setShowForm(true)}>Form Booking</button>
      <BookingForm show={showForm} handleClose={() => setShowForm(false)} />
    </>
  );
}
