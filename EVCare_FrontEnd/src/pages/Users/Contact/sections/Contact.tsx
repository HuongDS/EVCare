import styled from "styled-components";
import {useEffect, useState} from "react";
import type {ServiceCenterViewModel} from "../../../../models/ServiceCenter/ServiceCenterViewModel.ts";
import {handleError} from "../../../../utils/errorHandler.ts";
import axios from "axios";
import {ERROR_MESSAGE} from "../../../../constants/messages/Message.ts";
import {getCenterInformation} from "../../../../services/serviceCenterService.ts";

const ContactWrapper = styled.div`
    font-family: "Outfit", sans-serif;
    padding: 10vw 5%;
`;

const ColumnsWrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    flex-wrap: wrap;
    gap: 3vw;
`;

const LeftColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    min-width: 250px;
    padding-right: 2vw;
`;

const RightColumns = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 2vw;
    min-width: 300px;
`;

const TopRightColumns = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 5vw;
    flex-wrap: wrap;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Title = styled.h1`
    align-self: center;
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 800;
    color: #00ad4e;
`;

const Subtitle = styled.h2`
    font-size: clamp(1.5rem, 3vw, 2rem);
    margin-bottom: 10px;
    color: #00ad4e;
`;

const ContactInfo = styled.p`
    font-size: clamp(1.2rem, 2vw, 1.5rem);
    margin-bottom: 20px;
`;

const ContactContent = styled.p`
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    margin-bottom: 20px;
    text-align: justify;
`;

export default function Contact() {
    const [centerInformation, setCenterInformation] = useState<ServiceCenterViewModel | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCenterInformation();
                if (response == null) {
                    throw new Error(ERROR_MESSAGE.COULD_NOT_FIND_SERVICE_INFORMATION);
                }
                setCenterInformation(response.data ?? null);
            } catch (e) {
                handleError(e);
                if (axios.isAxiosError(e)) {
                    const errMsg = e.response?.data?.error || ERROR_MESSAGE.SOME_THING_WENT_WRONG;
                    throw new Error(errMsg);
                }
                throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
            }
        }
        fetchData();
    }, []);

    return (
        <ContactWrapper>
            <ColumnsWrapper>
                <LeftColumn data-aos="fade-up">
                    <Title>Contact Us</Title>
                    <ContactContent>
                        If you have any questions, feedback, or need assistance, please feel
                        free to reach out to us. We are here to help!
                    </ContactContent>
                </LeftColumn>

                <RightColumns>
                    <TopRightColumns data-aos="fade-up" data-aos-delay="200">
                        <Column>
                            <Subtitle>
                                <i className="bi bi-envelope-fill"></i> Email
                            </Subtitle>
                            <ContactInfo>evcare@gmail.com</ContactInfo>

                            <Subtitle>
                                <i className="bi bi-telephone-fill"></i> Hotline
                            </Subtitle>
                            <ContactInfo>{centerInformation?.hotline}</ContactInfo>
                        </Column>

                        <Column>
                            <Subtitle>
                                <i className="bi bi-facebook"></i> Facebook
                            </Subtitle>
                            <ContactInfo>{centerInformation?.name}</ContactInfo>
                            
                        </Column>
                    </TopRightColumns>

                    {/*<Image*/}
                    {/*    data-aos="fade-up"*/}
                    {/*    data-aos-delay="300"*/}
                    {/*    src={EVcar}*/}
                    {/*    alt="EVcar"*/}
                    {/*/>*/}

                    <iframe
                        src={centerInformation?.address}
                        width="600" height="450"
                        style={{border: "none"}}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">

                    </iframe>

                </RightColumns>
            </ColumnsWrapper>
        </ContactWrapper>
    );
}
