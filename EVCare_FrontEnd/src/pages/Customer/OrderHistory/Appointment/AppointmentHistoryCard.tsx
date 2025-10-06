import StatusTag from "../../../../components/StatusTags/StatusTag";
import Car from "../../../../assets/EVcar.webp";
import ButtonAction from "../../../../components/Button/ReviewButton";
import {
  ButtonStyle,
  Container,
  ContentWrapper,
  CustomerInformation,
  DateStyled,
  GeneralStyled,
  IDWrapper,
  ImageWrapper,
  ListItem,
  ServiceWrapper,
} from "./AppointmentHistoryCard.styled";
import dayjs from "dayjs";
import { List } from "antd";
import type { AppointmentViewDetailModel } from "../../../../models/AppointmentsModel/AppointmentViewDetailModel";
import SpinnerComponent from "../../../../components/SpinnerComponent";

interface props {
  data: AppointmentViewDetailModel;
  onViewAppointmentDetail: (appointmentId: number) => void;
  appointmentId: number;
  loadingModalDetail: number | null;
}

export default function AppointmentHistoryCard({
  data,
  onViewAppointmentDetail,
  appointmentId,
  loadingModalDetail,
}: props) {
  return (
    <Container>
      <IDWrapper>
        <h5>
          ID <span>#{data.id}</span>
        </h5>
      </IDWrapper>
      <GeneralStyled>
        <DateStyled>
          <h5>
            Date:{" "}
            <span>{dayjs(data.appointmentDate).format("DD/MM/YYYY")}</span>
          </h5>
          <div>
            <StatusTag status={data.status} />
          </div>
        </DateStyled>
        <h5>{data?.vehicleName}</h5>
      </GeneralStyled>
      <ContentWrapper>
        <CustomerInformation>
          <ImageWrapper>
            <img src={data.appointmentImages ? data.appointmentImages[0] : Car} alt="" />
          </ImageWrapper>
          <ServiceWrapper>
            <List>
              {data?.services?.map((s) => (
                <ListItem key={s.id}>{s.name}</ListItem>
              ))}
            </List>
          </ServiceWrapper>
        </CustomerInformation>
        <ButtonStyle>
          {loadingModalDetail === data?.id ? (
            <SpinnerComponent />
          ) : (
            <ButtonAction
              text="View Detail"
              color="white"
              backgroundColor="#00ad4e"
              action={() => onViewAppointmentDetail(appointmentId)}
            />
          )}
        </ButtonStyle>
      </ContentWrapper>
    </Container>
  );
}
