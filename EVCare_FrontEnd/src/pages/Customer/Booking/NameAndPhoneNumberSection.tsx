import React from "react";
import type { AccountViewModel } from "../../../models/Accounts/accountViewModel";
import { FormGroup, Input, Label } from "./BookingForm.styled";

interface Props {
  accountInfor: AccountViewModel | undefined;
}

function NameAndPhoneNumberComponent({ accountInfor }: Props) {
  let displayName;
  let displayPhone = "default";

  if (accountInfor) {
    displayName = accountInfor.first_Name + " " + accountInfor.last_Name;
    if (accountInfor.phone) {
      displayPhone = accountInfor.phone;
    }
  } else {
    displayName = "Customer";
  }

  /* istanbul ignore next */
  return (
    <>
      <FormGroup>
        <Label htmlFor="name-input">Name</Label>
        <Input id="name-input" type="text" disabled defaultValue={displayName} />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="phone-input">Phone Number</Label>
        <Input id="phone-input" type="tel" disabled defaultValue={displayPhone} />
      </FormGroup>
    </>
  );
}

const NameAndPhoneNumberSection = React.memo(NameAndPhoneNumberComponent);
export default NameAndPhoneNumberSection;
