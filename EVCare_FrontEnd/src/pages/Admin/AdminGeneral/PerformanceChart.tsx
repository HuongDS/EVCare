import React, { useEffect, useMemo, useState } from "react";
import { getPerformance } from "../../../services/aiService";
import { useDashboardHub } from "../../../hooks/useDashboardHub";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import type { PerfRes } from "../../../models/Dashboard/perfRes";
import type { PerfRes } from "../../../models/Dashboard/perfRes";

const PerformanceChart: React.FC = () => {
  const [perfData, setPerfData] = useState<PerfRes | null>(null);

  const from = useMemo(() => new Date(Date.now() - 6 * 24 * 3600 * 1000).toLocaleString("sv-SE"), []);
  const to = useMemo(() => new Date().toLocaleString("sv-SE"), []);

  useEffect(() => {
    const fetchData = async () => {
      await getPerformance(from, to).then((r) => setPerfData(r));
    };
    fetchData();
  }, [from, to]);

  useDashboardHub<PerfRes>((type, payload) => {
    // on any realtime update, refetch
    // getPerformance(from, to).then((r) => setPerfData(r));
    if (type === "InvoiceComplete") {
      console.log("check chart: ", payload);
      setPerfData(payload);
    }
  });

  const merger =
    perfData?.labels.map((label, i) => ({
      label,
      thisMonth: perfData.thisMonth[i],
      lastMonth: perfData.lastMonth[i],
    })) || [];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2 className="chart-title">Performance</h2>
        {/* <select className="date-filter">
          <option>01-07 May</option>
          <option>08-14 May</option>
          <option>15-21 May</option>
          <option>22-28 May</option>
        </select> */}
      </div>

      {/* <canvas ref={canvasRef} height={80}></canvas> */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={merger} margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={(v) => `${v}₫`} />
          <Tooltip formatter={(v) => `${v}₫`} />
          <Line type="monotone" dataKey="thisMonth" stroke="#64b5f6" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="lastMonth" stroke="#ffa726" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
