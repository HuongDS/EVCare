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
import {List} from "antd";
import type {AppointmentViewDetailModel} from "../../../../models/AppointmentsModel/AppointmentViewDetailModel";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import {useEffect, useState} from "react";
import {AppointmentStatusEnum} from "../../../../models/enums";
import {ReviewWrapper} from "../../../../components/Review/Review.styled.tsx";
import ReviewModal from "../../../../components/Review/ReviewModal.tsx";

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
    const [isDisplayReviewButton, setIsDisplayReviewButton] = useState(false);
    const [isOpenReviewForm, setIsOpenReviewForm] = useState(false);

    const onOpen = () => {
        setIsOpenReviewForm(true);
    };

    const onClose = () => {
        setIsOpenReviewForm(false);
    }

    // const onSubmit = (data: ReviewCreateDto) => {
    //     console.log(data);
    // }

    useEffect(() => {
        if (data.status === AppointmentStatusEnum.DONE) {
            setIsDisplayReviewButton(true);
        }
    }, [data.status]);

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
                        Date: <span>{dayjs(data.appointmentDate).format("DD/MM/YYYY")}</span>
                    </h5>
                    <div>
                        <StatusTag status={data.status}/>
                    </div>
                </DateStyled>
                <h5>{data?.vehicleName}</h5>
            </GeneralStyled>
            <ContentWrapper>
                <CustomerInformation>
                    <ImageWrapper>
                        <img src={data.appointmentImages ? data.appointmentImages[0] : Car} alt=""/>
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
                        <SpinnerComponent/>
                    ) : (
                        <>
                            <ButtonAction
                                text="View Detail"
                                color="white"
                                backgroundColor="#00ad4e"
                                action={() => onViewAppointmentDetail(appointmentId)}
                            />
                            {isDisplayReviewButton && (
                                <ButtonAction
                                    text="Write Review"
                                    color="white"
                                    backgroundColor="#00ad4e"
                                    action={() => onOpen()}
                                />
                            )}
                        </>
                    )}
                    {isOpenReviewForm &&
                        <ReviewWrapper><ReviewModal appointmentData={data} onClose={onClose}
                                                    open={isOpenReviewForm}/></ReviewWrapper>}
                </ButtonStyle>
            </ContentWrapper>
        </Container>
    );
}
