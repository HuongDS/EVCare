import React from "react";

interface textAreaProps {
  value: string;
}
export default function TextAreaDisabled({ value }: textAreaProps) {
  return (
    <textarea
      value={value}
      disabled
      style={{
        width: "80%",
        maxHeight: "100px",
        minHeight: "50px",
        padding: "10px",
      }}
    />
  );
}
