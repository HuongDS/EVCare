import { useMemo, useState } from "react";
import "./UserProfile.css";
import HeaderBar from "./HeaderBar";
import RankBadge from "./RankBadge";
import PersonalInfoForm from "./InforForm";
import SpendingSection from "./SpendingSection";
import VehiclesSection from "./VehicleSection";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import type { UserProfile } from "../../../models/User/UserViewModel";

const initialUser: UserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+84 123 456 789",
  rank: "VIP",
  totalSpending: 12450,
};

const initialVehicles: VehicleViewDto[] = [
  {
    id: 1,
    categoryName: "Tesla Model 3",
    licensePlate: "29A-12345",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
    cateId: 1,
  },
  {
    id: 2,
    categoryName: "BMW i4",
    licensePlate: "30B-67890",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop",
    cateId: 3,
  },
];

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [vehicles, setVehicles] = useState<VehicleViewDto[]>(initialVehicles);

  const profileTitle = useMemo(() => "Personal Information", []);

  const handleSaveUser = (updated: Pick<UserProfile, "firstName" | "lastName" | "phone">) => {
    setUser((prev) => ({ ...prev, ...updated }));
    // TODO: call API update profile nếu cần
  };

  const handleAddVehicle = (v: Omit<VehicleViewDto, "id">) => {
    setVehicles((prev) => [...prev, { ...v, id: (prev.at(-1)?.id ?? 0) + 1 }]);
    // TODO: call API add vehicle nếu cần
  };

  const handleDeleteVehicle = (id: number) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    // TODO: call API delete vehicle nếu cần
  };

  return (
    <div className="container">
      <div className="header">
        <HeaderBar />
        <div className="logo">EVCare</div>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">{profileTitle}</h1>
          <RankBadge rank={user.rank} />
        </div>

        <PersonalInfoForm
          defaultValues={{
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
          }}
          onSave={handleSaveUser}
        />

        <SpendingSection amount={user.totalSpending} />
      </div>

      <div className="profile-card vehicles-section">
        <VehiclesSection vehicles={vehicles} onAdd={handleAddVehicle} onDelete={handleDeleteVehicle} />
      </div>
    </div>
  );
}
