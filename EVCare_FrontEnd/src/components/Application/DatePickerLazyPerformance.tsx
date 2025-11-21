import React, { Suspense, lazy } from "react";

const DatePicker = lazy(() => import("./DatePicker"));

export default function DatePickerLazyPerformance(
  props: React.ComponentProps<typeof DatePicker>
) {
  return (
    <Suspense
      fallback={<div style={{ textAlign: "center" }}>Loading calendar...</div>}
    >
      <DatePicker {...props} />
    </Suspense>
  );
}
