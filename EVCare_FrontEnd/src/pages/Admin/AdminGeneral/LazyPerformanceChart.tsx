import React, { Suspense } from "react";

const PerformanceChart = React.lazy(() => import("./PerformanceChart"));

export default function LazyPerformanceChart() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <PerformanceChart />
    </Suspense>
  );
}
