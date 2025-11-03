import { useState } from "react";
import { ReconciliationOutlined, ToolOutlined, BarChartOutlined } from "@ant-design/icons";
import { TopServicesTab } from "./TopServicesTab";
import { TopPartsTab } from "./TopPartsTab";
import { PartHistoryTab } from "./PartHistoryTab";
import { AdminStatisticStyleWrapper } from "./AdminStatistic.styled";

type DashboardTab = "services" | "parts" | "history";

const AdminStatisticPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("services");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "services":
        return <TopServicesTab />;
      case "parts":
        return <TopPartsTab />;
      case "history":
        return <PartHistoryTab />;
      default:
        return <TopServicesTab />;
    }
  };

  return (
    <AdminStatisticStyleWrapper>
      <div className="dashboard-page">
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            <BarChartOutlined /> Top Services
          </button>
          <button
            className={`tab-button ${activeTab === "parts" ? "active" : ""}`}
            onClick={() => setActiveTab("parts")}
          >
            <ToolOutlined /> Top Parts
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <ReconciliationOutlined /> Update History
          </button>
        </div>

        <div className="dashboard-content">{renderActiveTab()}</div>
      </div>
    </AdminStatisticStyleWrapper>
  );
};

export default AdminStatisticPage;
