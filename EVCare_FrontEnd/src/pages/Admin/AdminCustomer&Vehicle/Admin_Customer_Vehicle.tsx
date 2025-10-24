import { PageWrapper, ContentWrapper, Header, Title, Instruction } from "./Admin_Customer_Vehicle.styled";
import { useState, useEffect } from "react";
import SearchBar from "../AdminCustomer&Vehicle/SearchBar";
import BanModal from "../AdminCustomer&Vehicle/BanModel";
import type { FullCustomerInfor } from "../../../models/CustomerModels/FullCustomerInfor";
import { banAccount, getAllCustomerInformation } from "../../../services/adminService";
import { ERROR_MESSAGE, MSG_TITLE } from "../../../constants/messages/Message";
import { useNotification } from "../../../context/useNotification";
import { Pagination } from "../../../components/Paginations/Pagination";
import CustomerTable from "./CustomerTable";

export default function Admin_Customer_Vehicle() {
  const [data, setData] = useState<FullCustomerInfor[]>([]);
  const [search, setSearch] = useState("");
  const [banModal, setBanModal] = useState<{ visible: boolean; user?: FullCustomerInfor }>({ visible: false });
  const [pageSize, setPageSize] = useState(6);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);

  const notification = useNotification();

  const handleBan = (user: FullCustomerInfor) => {
    setBanModal({ visible: true, user: user });
  };

  const handleConfirmBan = async () => {
    if (banModal.user) {
      const accountId = banModal.user.accountId;
      setBanModal({ visible: false });
      try {
        await banAccount(accountId);

        setData((prevData) => prevData.map((u) => (u.accountId === accountId ? { ...u, banned: true } : u)));

        notification.warning({
          message: MSG_TITLE.BAN_ACCOUNT,
          description: "Banned successfully",
        });
      } catch (error) {
        notification.error({
          message: MSG_TITLE.BAN_ACCOUNT,
          description: (error as Error).message,
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
          description: (error as Error).message,
        });
      }
    };
    fetchData();
  }, [pageIndex, search, notification, pageSize]);

  useEffect(() => {
    setPageIndex(1);
  }, [search]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <Header>
          <Title>Customer Management</Title>
          <Instruction>Manage all your customers. Click on a customer's row to see their vehicle details.</Instruction>
        </Header>

        <SearchBar search={search} onSearchChange={setSearch} />

        <CustomerTable customers={data} onBanCustomer={handleBan} />

        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPage={totalPages}
          onPageChange={onPageChange}
        />
      </ContentWrapper>

      <BanModal
        visible={banModal.visible}
        userName={banModal.user?.customerName}
        isBanned={banModal.user?.banned}
        onCancel={() => setBanModal({ visible: false })}
        onConfirm={handleConfirmBan}
      />
    </PageWrapper>
  );
}
