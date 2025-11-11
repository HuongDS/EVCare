import React, { useCallback, useEffect, useState } from "react";
import { getPerformance } from "../../../services/aiService";
import { useDashboardHub } from "../../../hooks/useDashboardHub";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { PerfRes } from "../../../models/Dashboard/perfRes";

const PerformanceChart: React.FC = () => {
  const [perfData, setPerfData] = useState<PerfRes | null>(null);
  const [dateRange, setDateRange] = useState<string>("7days");

  const fetchData = useCallback(async () => {
    const toDate = new Date();
    const fromDate = new Date(toDate);

    if (dateRange === "30days") {
      fromDate.setDate(fromDate.getDate() - 30);
    } else if (dateRange === "90days") {
      fromDate.setDate(fromDate.getDate() - 90);
    } else {
      fromDate.setDate(fromDate.getDate() - 7);
    }

    const toStr = toDate.toLocaleString("sv-SE"); // nearest to ISO8601
    const fromStr = fromDate.toLocaleString("sv-SE");

    try {
      const response = await getPerformance(fromStr, toStr);
      setPerfData(response);
    } catch (error) {}
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useDashboardHub<PerfRes>((type) => {
    if (type === "InvoiceComplete") {
      fetchData();
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

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{ padding: "4px 8px", borderRadius: "4px" }}
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

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
