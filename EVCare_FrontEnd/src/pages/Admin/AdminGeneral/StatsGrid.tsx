import React from "react";
import {ClipboardClock, HandCoins, Users, Wrench} from "lucide-react";


const stats = [
    {icon: <Users/>, label: "Customers", value: "1,250", color: "#00ad4e"},
    {icon: <ClipboardClock/>, label: "Appointments", value: "1,250", color: "#2196f3"},
    {icon: <Wrench/>, label: "Total Service", value: "1,250", color: "#ff9800"},
    {icon: <HandCoins/>, label: "Total Revenue", value: "1,250", color: "#00ad4e"},
];

const StatsGrid: React.FC = () => {
    return (
        <div className="stats-grid">
            {stats.map((s, i) => (
                <div className="stat-card" key={i}>
                    <div className="stat-icon">{s.icon}</div>
                    <div className="stat-info">
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value" style={{color: s.color}}>
                            {s.value}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;
