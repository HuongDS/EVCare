import { useState } from "react";
import { PageWrapper, Header, Title, Instruction, MainTabContainer, MainTabButton } from "./Admin_Category.styled";
import { FaCar, FaCogs, FaTools } from "react-icons/fa";
import PartCategoryAdmin from "./PartCategoryAdmin";
import VehicleCategoryAdmin from "./VehicleCategoryAdmin";
import ServiceCategoryAdmin from "./ServiceCategoryAdmin";

type MainTab = "vehicle" | "part" | "service";

export default function Admin_Category() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("vehicle");

  const renderContent = () => {
    switch (activeMainTab) {
      case "vehicle":
        return <VehicleCategoryAdmin />;
      case "part":
        return <PartCategoryAdmin />;
      case "service":
        return <ServiceCategoryAdmin />;
      default:
        return null;
    }
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Category Management</Title>
        <Instruction>Catalog management for Vehicles, Parts, and Services.</Instruction>
      </Header>

      <MainTabContainer>
        <MainTabButton $isActive={activeMainTab === "vehicle"} onClick={() => setActiveMainTab("vehicle")}>
          <FaCar /> Vehicle Categories
        </MainTabButton>
        <MainTabButton $isActive={activeMainTab === "part"} onClick={() => setActiveMainTab("part")}>
          <FaCogs /> Part Categories
        </MainTabButton>
        <MainTabButton $isActive={activeMainTab === "service"} onClick={() => setActiveMainTab("service")}>
          <FaTools /> Service Categories
        </MainTabButton>
      </MainTabContainer>
      {renderContent()}
    </PageWrapper>
  );
}
