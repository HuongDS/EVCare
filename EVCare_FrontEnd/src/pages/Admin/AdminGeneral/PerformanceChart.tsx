import React, { useEffect, useMemo, useState } from "react";
import { getPerformance } from "../../../services/aiService";
import { useDashboardHub } from "../../../hooks/useDashboardHub";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { PerfRes } from "../../../models/Dashboard/perfRes";

const PerformanceChart: React.FC = () => {
  const [data, setData] = useState<PerfRes | null>(null);

  const from = useMemo(() => new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(), []);
  const to = useMemo(() => new Date().toISOString(), []);

  useEffect(() => {
    getPerformance(from, to).then((r) => setData(r));
  }, [from, to]);

  useDashboardHub(() => {
    // on any realtime update, refetch
    getPerformance(from, to).then((r) => setData(r));
  });

  const merged = useMemo(() => {
    if (!data) return [];
    return data.labels.map((label, i) => ({
      label,
      thisMonth: data.thisMonth[i] ?? 0,
      lastMonth: data.lastMonth[i] ?? 0,
    }));
  }, [data]);

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
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={merged} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
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
