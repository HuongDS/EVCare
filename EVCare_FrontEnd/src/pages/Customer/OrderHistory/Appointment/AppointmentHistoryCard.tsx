import StatusTag from "../../../../components/StatusTags/StatusTag";
import Car from "../../../../assets/EVcar.webp";
import ButtonAction from "../../../../components/Button/ButtonAction.tsx";
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
import type { AppointmentViewDetailModel } from "../../../../models/AppointmentsModel/AppointmentViewDetailModel";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import { useEffect, useState } from "react";
import { AppointmentStatusEnum } from "../../../../models/enums";
import { ReviewWrapper } from "../../../../components/Review/Review.styled.tsx";
// import ReviewModal from "../../../../components/Review/ReviewModal.tsx";
import LazyReviewModal from "../../../../components/Review/LazyReviewModal.tsx";
import type { CardData } from "../../../../models/Pics/CardData.ts";
import { LazyReviewPicsSection } from "./LazyReviewPicsSection.tsx";
import { useAppDispatch } from "../../../../states/store.ts";
import { openModel3d } from "../../../../states/uiSlice.ts";
import ShowButton from "../../../../components/Button/ShowButton.tsx";

interface props {
  data: AppointmentViewDetailModel;
  onViewAppointmentDetail: (appointmentId: number) => void;
  appointmentId: number;
  loadingModalDetail: number | null;
  setModel3dData: (v: number) => void;
}

export default function AppointmentHistoryCard({
  data,
  onViewAppointmentDetail,
  appointmentId,
  loadingModalDetail,
  setModel3dData,
}: props) {
  const dispatch = useAppDispatch();
  const [isDisplayReviewButton, setIsDisplayReviewButton] = useState(false);
  const [isOpenReviewForm, setIsOpenReviewForm] = useState(false);
  const [pics, setPics] = useState<CardData[]>([]);
  // const { data: appointmentDetail } = useGetAppointmentById(data.id);

  const onOpen = () => {
    setIsOpenReviewForm(true);
  };

  const onClose = () => {
    setIsOpenReviewForm(false);
  };

  // const onSubmit = (data: ReviewCreateDto) => {
  //     console.log(data);
  // }

  useEffect(() => {
    if (data.status === AppointmentStatusEnum.DONE) {
      setIsDisplayReviewButton(true);
    }
    if (data.appointmentImages.length > 1)
      setPics(data.appointmentImages.map((p, i) => ({ id: i, url: p })));
  }, [data.status, data.appointmentImages]);

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
            {pics.length > 1 ? (
              <LazyReviewPicsSection data={pics} />
            ) : (
              <img
                src={data.appointmentImages ? data.appointmentImages[0] : Car}
                alt=""
              />
            )}
          </ImageWrapper>
          <ServiceWrapper>
            {data?.services?.map((s) => (
              <ListItem key={s.id}>{s.name}</ListItem>
            ))}
          </ServiceWrapper>
        </CustomerInformation>
        <ButtonStyle>
          {loadingModalDetail === data?.id ? (
            <SpinnerComponent />
          ) : (
            <>
              <ButtonAction
                text="View Detail"
                variant="primary"
                action={() => onViewAppointmentDetail(appointmentId)}
              />

              {(data.status === AppointmentStatusEnum.IN_PROGRESS ||
                data.status === AppointmentStatusEnum.READY_FOR_PICKUP ||
                data.status === AppointmentStatusEnum.DONE) && (
                <ShowButton
                  text="View 3D Model"
                  onclick={() => {
                    setModel3dData(appointmentId);
                    dispatch(openModel3d());
                  }}
                />
              )}

              {isDisplayReviewButton && !data.reviewId && (
                <div style={{ marginLeft: "10px" }}>
                  <ButtonAction
                    text="Write Review"
                    variant="secondary"
                    action={() => onOpen()}
                  />
                </div>
              )}
            </>
          )}
          {isOpenReviewForm && (
            <ReviewWrapper>
              {/* <ReviewModal appointmentData={data} onClose={onClose} open={isOpenReviewForm} /> */}
              <LazyReviewModal
                appointmentData={data}
                onClose={onClose}
                open={isOpenReviewForm}
              />
            </ReviewWrapper>
          )}
        </ButtonStyle>
      </ContentWrapper>
    </Container>
  );
}
