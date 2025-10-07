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
import InvoiceSection from "./InvoiceSection";
import type { InvoiceViewModel } from "../../../models/Invoice/InvoiceViewModel";
import { getInvoices } from "../../../services/invoicesService";

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

// const mockInvoice: InvoiceViewModel[] = [
//   {
//     id: 1,
//     appointmentDate: "06-10-2025",
//     totalPrice: 9999,
//     paymentMethod: PaymentMethodEnum.CASH,
//     paymentDate: "06-10-2025",
//     status: PaymentStatusEnum.COMPLETED,
//   },
//   {
//     id: 2,
//     appointmentDate: "06-10-2025",
//     totalPrice: 9999,
//     paymentMethod: PaymentMethodEnum.CASH,
//     paymentDate: "06-10-2025",
//     status: PaymentStatusEnum.COMPLETED,
//   },
// ];

function UserProfileComponent() {
  const [vehicles, setVehicles] = useState<VehicleViewDto[]>(initialVehicles);
  const profileTitle = useMemo(() => "Personal Information", []);
  const [profileData, setProfileData] = useState<AccountViewModel>();
  const [cusProfile, setCusProfile] = useState<CustomerViewDto>();
  const [totalSpending, setTotalSpending] = useState<number>(0);
  const [invoices, setInvoices] = useState<InvoiceViewModel[]>([]);

  const handleSaveUser = async (updated: Pick<UserProfile, "firstName" | "lastName" | "phone">) => {
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
      throw error;
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
        const response03 = await getInvoices();
        if (response03 == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        setInvoices(response03?.data || []);
        setProfileData(response01?.data);
        setCusProfile(response02?.data);
        setTotalSpending(response03?.data ? response03.data.reduce((acc, item) => acc + item.totalPrice, 0) : 0);
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
            <RankBadge rank={cusProfile?.rank || CustomerRankEnum.REGULAR} />
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

          <SpendingSection amount={totalSpending} />
        </div>

        <div className="profile-card vehicles-section">
          <VehiclesSection vehicles={vehicles} onAdd={handleAddVehicle} onDelete={handleDeleteVehicle} />
        </div>

        <div className="profile-card invoices-section">
          <InvoiceSection invoices={invoices} />
        </div>
      </div>
    </ContainerWrapper>
  );
}

const UserProfilePage = React.memo(UserProfileComponent);
export default UserProfilePage;
