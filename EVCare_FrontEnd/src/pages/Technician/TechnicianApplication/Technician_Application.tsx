import { useState } from "react";
import type { ApplicationResponseDTO } from "../../../models/ApplicationModel/ApplicationModels";
import ApplicationPage from "../../../components/Application/ApplicationPage";

export default function Technician_Application() {
  const [activeTab, setActiveTab] = useState("SendApplication");

  const handleSuccess = (data: ApplicationResponseDTO) => {
    console.log("Send application successfully:", data);
  };

  const handleError = (msg: string) => {
    console.error("Failed:", msg);
  };

  return (
    <ApplicationPage
      tabs={["SendApplication", "MyApplications"]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
