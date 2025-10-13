import React, { useEffect, useState } from "react";
import { ClipboardClock, HandCoins, TicketX, Users } from "lucide-react";
import { getInsights, getSummary } from "../../../services/aiService";
import type { SummaryRes } from "../../../models/Dashboard/dashBoardSummaryDto";
import { useDashboardHub } from "../../../hooks/useDashboardHub";

const stats = [
  { icon: <Users />, label: "Customers", value: "", color: "#adaa00" },
  { icon: <ClipboardClock />, label: "Appointments", value: "", color: "#2196f3" },
  { icon: <TicketX />, label: "Canceled Appointments", value: "", color: "#ff1500" },
  { icon: <HandCoins />, label: "Total Revenue", value: "", color: "#00ad4e" },
];

const StatsGrid: React.FC = () => {
  const [data, setData] = useState<SummaryRes | null>(null);
  const [insight, setInsight] = useState("");

  const from = React.useMemo(() => new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), []);
  const to = React.useMemo(() => new Date().toISOString(), []);

  const refresh = async () => await getSummary().then((r) => setData(r));

  useEffect(() => {
    refresh();
    getInsights(from, to).then((r) => setInsight(r.message));
  }, []);

  useDashboardHub((data: SummaryRes) => {
    // when realtime event comes, refresh quick summary
    // refresh();
    setData(data);
  });

  useEffect(() => {
    stats[0].value = data?.customer?.toString() ?? "";
    stats[1].value = data?.appointments?.toString() ?? "";
    stats[2].value = data?.cancelAppointments?.toString() ?? "";
    stats[3].value = data?.totalRevenue?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) ?? "0";
  }, [data?.customer, data?.appointments, data?.cancelAppointments, data?.totalRevenue]);

  return (
    <>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chart-card" style={{ marginTop: 12 }}>
        <div className="chart-header">
          <h3>AI Insight</h3>
        </div>
        <p>💡 {insight || "Generating insight..."}</p>
      </div>
    </>
  );
};

export default StatsGrid;
