import React from "react";
import type { AccountViewModel } from "../../../models/Accounts/accountViewModel";
import { FormGroup, Input, Label } from "./BookingForm.styled";

interface Props {
  accountInfor: AccountViewModel | undefined;
}

function NameAndPhoneNumberComponent({ accountInfor }: Props) {
  return (
    <>
      <FormGroup>
        <Label>Name</Label>
        <Input type="text" disabled defaultValue={accountInfor?.first_Name + " " + accountInfor?.last_Name} />
      </FormGroup>
      <FormGroup>
        <Label>Phone Number</Label>
        <Input type="tel" disabled defaultValue={accountInfor?.phone ?? "default"} />
      </FormGroup>
    </>
  );
}

const NameAndPhoneNumberSection = React.memo(NameAndPhoneNumberComponent);
export default NameAndPhoneNumberSection;
