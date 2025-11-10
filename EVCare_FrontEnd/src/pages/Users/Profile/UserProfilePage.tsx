import React, { useEffect, useState } from "react";
import { FiUser, FiFileText } from "react-icons/fi";
import HeaderBar from "./HeaderBar";
// import RankBadge from "./RankBadge";
import PersonalInfoForm from "./InforForm";
import SpendingSection from "./SpendingSection";
import VehiclesSection from "./VehicleSection";
import InvoiceSection from "./InvoiceSection";
import { ContainerWrapper } from "./UserProfile.styled";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import type { UserProfile } from "../../../models/User/UserViewModel";
import { getAccountInformation, updateAccount } from "../../../services/accountService";
import { getCustomerId } from "../../../services/customerServices";
import { getUser } from "../../../token/tokenStore";
import { handleError } from "../../../utils/errorHandler";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";
// import { CustomerRankEnum, RoleEnum } from "../../../models/enums";
import type { AccountUpdateDto } from "../../../models/Accounts/AccountUpdateDto";
// import type { CustomerViewDto } from "../../../models/CustomerModels/CustomerViewDto";
import type { AccountViewModel } from "../../../models/Accounts/accountViewModel";
import type { InvoiceViewModel } from "../../../models/Invoice/InvoiceViewModel";
import { getInvoices } from "../../../services/invoicesService";
import type { User } from "../../../models/AuthModel/authModel";
import { createVehicle, deleteVehicle, getVehicleByCustomerId } from "../../../services/vehicleServicesApi";
import type { VehicleCreateDto } from "../../../models/VehicleModels/VehicleCreateDto";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { RoleEnum } from "../../../models/enums";
import { UserRound } from "lucide-react";
import { FaCarAlt } from "react-icons/fa";

type ProfileTab = "info" | "vehicles" | "invoices";

function UserProfileComponent() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");

  const [vehicles, setVehicles] = useState<VehicleViewDto[]>([]);
  const [profileData, setProfileData] = useState<AccountViewModel>();
  // const [cusProfile, setCusProfile] = useState<CustomerViewDto>();
  const [totalSpending, setTotalSpending] = useState<number>(0);
  const [invoices, setInvoices] = useState<InvoiceViewModel[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveUser = async (updated: Pick<UserProfile, "firstName" | "lastName" | "phone">) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (a: VehicleCreateDto) => {
    setIsLoading(true);
    try {
      const response = await createVehicle(a);
      if (response == null) {
        throw new Error(ERROR_MESSAGE.FAILED_TO_ADD_VEHICLE);
      }
      const newVehicleId = response.data;
      const v: VehicleViewDto = {
        id: newVehicleId || 0,
        cateId: a.categoryId,
        licensePlate: a.licensePlate,
        image: a.img,
      };
      setVehicles((prev) => [...prev, { ...v, id: (prev.at(-1)?.id ?? 0) + 1 }]);
      fetchVehicle();
    } catch (error) {
      handleError(error);
      throw Error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await deleteVehicle(id);
      if (response == null) {
        throw new Error(ERROR_MESSAGE.FAILED_TO_DELETE_VEHICLE);
      }
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      fetchVehicle();
    } catch (error) {
      handleError(error);
      throw Error((error as Error).message);
    }
    setIsLoading(false);
  };

  const fetchVehicle = async () => {
    setIsLoading(true);
    try {
      if (!user?.accountId) {
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
      const response02 = await getCustomerId(user?.accountId);
      if (user == null || response02 == null) {
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
      const response04 = await getVehicleByCustomerId(response02.data?.id || 0);
      setVehicles(response04?.data || []);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchVehicle();
  // }, [vehicles, setVehicles]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response01 = await getAccountInformation();
        const user = getUser();
        if (user == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        setProfileData(response01?.data);
        if (user.role !== RoleEnum.CUSTOMER) return;
        const response02 = await getCustomerId(user?.accountId);
        if (user == null || response01 == null || response02 == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        const response03 = await getInvoices();
        if (response03 == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        const response04 = await getVehicleByCustomerId(response02.data?.id || 0);
        if (response03 == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        setVehicles(response04?.data || []);
        setUser(user);
        setInvoices(response03?.data || []);
        // setCusProfile(response02?.data);
        setTotalSpending(response03?.data ? response03.data.reduce((acc, item) => acc + item.totalPrice, 0) : 0);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "15px",
          }}
        >
          <SpinnerComponent />
        </div>
      ) : (
        <ContainerWrapper>
          <div className="header">
            <HeaderBar />
            <div className="logo">EVCare</div>
          </div>

          <div className="container">
            <div className="sidebar">
              <div className="sidebar-info-card">
                <UserRound className="avatar-placeholder" color="#23cf17" strokeWidth={1.25} absoluteStrokeWidth />
                <h2>
                  {profileData?.first_Name} {profileData?.last_Name}
                </h2>
                <p>{profileData?.email}</p>
              </div>

              <nav className="sidebar-nav">
                <button
                  className={`sidebar-nav-btn ${activeTab === "info" ? "active" : ""}`}
                  onClick={() => setActiveTab("info")}
                >
                  <FiUser /> General
                </button>
                {user?.role === RoleEnum.CUSTOMER && (
                  <>
                    <button
                      className={`sidebar-nav-btn ${activeTab === "vehicles" ? "active" : ""}`}
                      onClick={() => setActiveTab("vehicles")}
                    >
                      <FaCarAlt /> My Vehicles
                    </button>
                    <button
                      className={`sidebar-nav-btn ${activeTab === "invoices" ? "active" : ""}`}
                      onClick={() => setActiveTab("invoices")}
                    >
                      <FiFileText /> Recent Invoices
                    </button>
                  </>
                )}
              </nav>
            </div>

            <div className="content-area">
              {activeTab === "info" && (
                <div className="profile-card">
                  <div className="profile-header">
                    <h1 className="profile-title">Personal Information</h1>
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
                  {user?.role === RoleEnum.CUSTOMER && <SpendingSection amount={totalSpending} />}
                </div>
              )}

              {activeTab === "vehicles" && user?.role === RoleEnum.CUSTOMER && (
                <div className="profile-card vehicles-section">
                  <VehiclesSection vehicles={vehicles} onAdd={handleAddVehicle} onDelete={handleDeleteVehicle} />
                </div>
              )}

              {activeTab === "invoices" && user?.role === RoleEnum.CUSTOMER && (
                <div className="profile-card invoices-section">
                  <InvoiceSection invoices={invoices.slice(0, 10)} />
                </div>
              )}
            </div>
          </div>
        </ContainerWrapper>
      )}
    </>
  );
}

const UserProfilePage = React.memo(UserProfileComponent);
export default UserProfilePage;
