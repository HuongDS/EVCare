import React, { useEffect } from "react";
import { ClipboardClock, HandCoins, TicketX, Users } from "lucide-react";

const stats = [
  { icon: <Users />, label: "Customers", value: "1,250", color: "#adaa00" },
  { icon: <ClipboardClock />, label: "Appointments", value: "1,250", color: "#2196f3" },
  { icon: <TicketX />, label: "Canceled Appointments", value: "1,250", color: "#ff1500" },
  { icon: <HandCoins />, label: "Total Revenue", value: "1,250", color: "#00ad4e" },
];

interface Props {
  revenue: number;
  numberOfCustomers: number;
  numberOfAppointments: number;
  numberOfCanceledAppointments: number;
}

const StatsGrid: React.FC<Props> = ({
  revenue,
  numberOfCustomers,
  numberOfAppointments,
  numberOfCanceledAppointments,
}: Props) => {
  useEffect(() => {
    stats[0].value = numberOfCustomers.toString();
    stats[1].value = numberOfAppointments.toString();
    stats[2].value = numberOfCanceledAppointments.toString();
    stats[3].value = revenue.toString();
  }, [revenue, numberOfAppointments, numberOfCanceledAppointments, numberOfCustomers]);

  return (
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
  );
};

export default StatsGrid;
