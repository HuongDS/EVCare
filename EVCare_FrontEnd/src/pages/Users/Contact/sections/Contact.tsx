import { useEffect, useState } from "react";
import type { ServiceCenterViewModel } from "../../../../models/ServiceCenter/ServiceCenterViewModel.ts";
import { handleError } from "../../../../utils/errorHandler.ts";
import axios from "axios";
import { ERROR_MESSAGE } from "../../../../constants/messages/Message.ts";
import { getCenterInformation } from "../../../../services/serviceCenterService.ts";
import {
  Column,
  ColumnsWrapper,
  ContactContent,
  ContactInfo,
  ContactWrapper,
  LeftColumn,
  RightColumns,
  Subtitle,
  Title,
  TopRightColumns,
} from "./Contact.styled.tsx";

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
    };
    fetchData();
  }, []);

  return (
    <ContactWrapper>
      <ColumnsWrapper>
        <LeftColumn data-aos="fade-up">
          <Title>Contact Us</Title>
          <ContactContent>
            If you have any questions, feedback, or need assistance, please feel free to reach out to us. We are here to
            help!
          </ContactContent>
        </LeftColumn>

        <RightColumns>
          <TopRightColumns data-aos="fade-up" data-aos-delay="200">
            <Column>
              <Subtitle>
                <i className="bi bi-envelope-fill"></i> Email
              </Subtitle>
              <ContactInfo>evcare@gmail.com</ContactInfo>
            </Column>

            <Column>
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

          <iframe
            data-aos="fade-up"
            data-aos-delay="300"
            src={centerInformation?.address}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </RightColumns>
      </ColumnsWrapper>
    </ContactWrapper>
  );
}
