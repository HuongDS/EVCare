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
      tabs={["Send Application", "My Applications"]}
      activeTab={activeTab}
      onTabChange={(val) => {
        if (val !== activeTab) {
          setActiveTab(val.replace(/\s+/g, ""));
        }
      }}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
