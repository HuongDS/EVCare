import React, { useEffect, useState } from "react";
import { ClipboardClock, HandCoins, TicketX, Users } from "lucide-react";
import { getInsights, getSummary } from "../../../services/aiService";
import type { SummaryRes } from "../../../models/Dashboard/dashBoardSummaryDto";
import { useDashboardHub } from "../../../hooks/useDashboardHub";

// const stats = [
//   { icon: <Users />, label: "Customers", value: "", color: "#adaa00" },
//   { icon: <ClipboardClock />, label: "Appointments", value: "", color: "#2196f3" },
//   { icon: <TicketX />, label: "Canceled Appointments", value: "", color: "#ff1500" },
//   { icon: <HandCoins />, label: "Total Revenue", value: "", color: "#00ad4e" },
// ];

const StatsGrid: React.FC = () => {
  const [data, setData] = useState<SummaryRes | null>(null);
  const [insight, setInsight] = useState("");
  const [stats, setStats] = useState([
    { icon: <Users />, label: "Customers", value: "", color: "#adaa00" },
    { icon: <ClipboardClock />, label: "Appointments", value: "", color: "#2196f3" },
    { icon: <TicketX />, label: "Canceled Appointments", value: "", color: "#ff1500" },
    { icon: <HandCoins />, label: "Total Revenue", value: "", color: "#00ad4e" },
  ]);

  const from = React.useMemo(() => new Date(Date.now() - 7 * 24 * 3600 * 1000).toLocaleString("sv-SE"), []);
  const to = React.useMemo(() => new Date().toLocaleString("sv-SE"), []);

  const refresh = async () => await getSummary().then((r) => setData(r));

  useEffect(() => {
    refresh();
    getInsights(from, to).then((r) => setInsight(r.message));
  }, []);

  useDashboardHub<SummaryRes>((type, payload) => {
    // when realtime event comes, refresh quick summary
    // refresh();
    if (type === "AppointmentConfirm") {
      setData(payload);
    }
  });

  useEffect(() => {
    if (!data) return;

    setStats([
      { icon: <Users />, label: "Customers", value: data.customer?.toString() ?? "", color: "#adaa00" },
      { icon: <ClipboardClock />, label: "Appointments", value: data.appointments?.toString() ?? "", color: "#2196f3" },
      {
        icon: <TicketX />,
        label: "Canceled Appointments",
        value: data.cancelAppointments?.toString() ?? "",
        color: "#ff1500",
      },
      {
        icon: <HandCoins />,
        label: "Total Revenue",
        value: data.totalRevenue?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) ?? "0",
        color: "#00ad4e",
      },
    ]);
  }, [data]);

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
        <p> {insight || "Generating insight..."}</p>
      </div>
    </>
  );
};

export default StatsGrid;
