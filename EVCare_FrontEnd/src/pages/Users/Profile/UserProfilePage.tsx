import React, { useEffect, useMemo, useState } from "react";
import HeaderBar from "./HeaderBar";
import RankBadge from "./RankBadge";
import PersonalInfoForm from "./InforForm";
import SpendingSection from "./SpendingSection";
import VehiclesSection from "./VehicleSection";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import type { UserProfile } from "../../../models/User/UserViewModel";
import { ContainerWrapper } from "./UserProfile.styled";
import { getAccountInformation, updateAccount } from "../../../services/accountService";
import { getCustomerId } from "../../../services/customerServices";
import { getUser } from "../../../token/tokenStore";
import { handleError } from "../../../utils/errorHandler";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";
import { CustomerRankEnum } from "../../../models/enums";
import type { AccountUpdateDto } from "../../../models/Accounts/AccountUpdateDto";
import type { CustomerViewDto } from "../../../models/CustomerModels/CustomerViewDto";
import type { AccountViewModel } from "../../../models/Accounts/accountViewModel";

const initialUser: UserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+84 123 456 789",
  rank: CustomerRankEnum.MEMBER,
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
  {
    id: 2,
    categoryName: "BMW i4",
    licensePlate: "30B-67890",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop",
    cateId: 3,
  },
  {
    id: 2,
    categoryName: "BMW i4",
    licensePlate: "30B-67890",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop",
    cateId: 3,
  },
  {
    id: 2,
    categoryName: "BMW i4",
    licensePlate: "30B-67890",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop",
    cateId: 3,
  },
];

function UserProfileComponent() {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [vehicles, setVehicles] = useState<VehicleViewDto[]>(initialVehicles);
  const profileTitle = useMemo(() => "Personal Information", []);
  const [profileData, setProfileData] = useState<AccountViewModel>();
  const [cusProfile, setCusProfile] = useState<CustomerViewDto>();

  const handleSaveUser = async (updated: Pick<UserProfile, "firstName" | "lastName" | "phone">) => {
    setUser((prev) => ({ ...prev, ...updated }));
    try {
      const data: AccountUpdateDto = {
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
      };
      const response = await updateAccount(data);
      if (response == null) {
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
      setProfileData(response?.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddVehicle = (v: Omit<VehicleViewDto, "id">) => {
    setVehicles((prev) => [...prev, { ...v, id: (prev.at(-1)?.id ?? 0) + 1 }]);
    // TODO: call API add vehicle nếu cần
  };

  const handleDeleteVehicle = (id: number) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    // TODO: call API delete vehicle nếu cần
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response01 = await getAccountInformation();
        const user = getUser();
        if (user == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        const response02 = await getCustomerId(user?.accountId);
        if (user == null || response01 == null || response02 == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        setProfileData(response01?.data);
        setCusProfile(response02?.data);
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(profileData);
    console.log(cusProfile);
  }, [profileData, cusProfile]);

  return (
    <ContainerWrapper>
      <div className="container">
        <div className="header">
          <HeaderBar />
          <div className="logo">EVCare</div>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <h1 className="profile-title">{profileTitle}</h1>
            <RankBadge rank={cusProfile?.rank || CustomerRankEnum.VIP} />
          </div>

          <PersonalInfoForm
            defaultValues={{
              firstName: profileData?.first_Name || "",
              lastName: profileData?.last_Name || "",
              phone: profileData?.phone || "",
              email: profileData?.email || "",
            }}
            onSave={handleSaveUser}
          />

          <SpendingSection amount={user.totalSpending} />
        </div>

        <div className="profile-card vehicles-section">
          <VehiclesSection vehicles={vehicles} onAdd={handleAddVehicle} onDelete={handleDeleteVehicle} />
        </div>
      </div>
    </ContainerWrapper>
  );
}

const UserProfilePage = React.memo(UserProfileComponent);
export default UserProfilePage;
