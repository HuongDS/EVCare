import { AdminCustomerVehicleWrapper } from "./Admin_Customer_Vehicle.styled";
import { useState, useEffect } from "react";
import SearchBar from "../AdminCustomer&Vehicle/SearchBar";
import UserCard from "../AdminCustomer&Vehicle/CustomerAndVehicleCard";
import BanModal from "../AdminCustomer&Vehicle/BanModel";
import type { FullCustomerInfor } from "../../../models/CustomerModels/FullCustomerInfor";
import { banAccount, getAllCustomerInformation } from "../../../services/adminService";
import { ERROR_MESSAGE, MSG_TITLE } from "../../../constants/messages/Message";
import { useNotification } from "../../../context/useNotification";
import { Pagination } from "../../../components/Paginations/Pagination";

export default function Admin_Customer_Vehicle() {
  const [data, setData] = useState<FullCustomerInfor[]>([]);
  const [search, setSearch] = useState("");
  const [banModal, setBanModal] = useState<{ visible: boolean; id?: number }>({ visible: false });
  const [pageSize, setPageSize] = useState(6);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);

  const notification = useNotification();

  const handleBan = (id: number) => setBanModal({ visible: true, id });
  const handleConfirmBan = async () => {
    if (banModal.id) {
      // setUsers((prev) => prev.map((u) => (u.id === banModal.id ? { ...u, banned: true } : u)));
      setBanModal({ visible: false });
      try {
        await banAccount(banModal.id);
        notification.warning({
          message: MSG_TITLE.BAN_ACCOUNT,
          description: "Banned successfully",
        });
      } catch (error) {
        notification.error({
          message: MSG_TITLE.BAN_ACCOUNT,
          description: error as string,
        });
      }
    }
  };

  const onPageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllCustomerInformation(search.trim(), pageSize, pageIndex);
        if (response == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        setData(response.data?.items ?? []);
        setPageIndex(response.data?.pageIndex ?? 1);
        setPageSize(response.data?.pageSize ?? 1);
        setTotalItems(response.data?.totalItems ?? 1);
        setTotalPages(response.data?.totalPages ?? 1);
      } catch (error) {
        notification.error({
          message: MSG_TITLE.FETCH_DATA,
          description: error as string,
        });
      }
    };
    fetchData();
  }, [pageIndex, search, notification, pageSize]);

  useEffect(() => {
    setPageIndex(1);
  }, [search]);

  return (
    <AdminCustomerVehicleWrapper>
      <div className="layout">
        <main className="main-content">
          <SearchBar search={search} onSearchChange={setSearch} />
          <div className="users-grid">
            {data.length ? (
              data.map((u) => <UserCard setOpenBanModal={setBanModal} key={u.accountId} user={u} onBan={handleBan} />)
            ) : (
              <div className="empty-state">No users found</div>
            )}
          </div>
        </main>

        <BanModal
          visible={banModal.visible}
          userName={data.find((u) => u.accountId === banModal.id)?.customerName}
          onCancel={() => setBanModal({ visible: false })}
          onConfirm={handleConfirmBan}
        />
      </div>
      <Pagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPage={totalPages}
        onPageChange={onPageChange}
      />
    </AdminCustomerVehicleWrapper>
  );
}
