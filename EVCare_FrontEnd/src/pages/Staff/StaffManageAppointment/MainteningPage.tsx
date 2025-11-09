import { Wrench, Calendar, AlertCircle } from "lucide-react";
import {
  PageContainer,
  ContentCard,
  AnimatedIcon,
  Title,
  ProgressSection,
  ProgressLabel,
  ProgressText,
  ExpectedBox,
} from "./styles/MainteningPage.styled";

export default function MainteningPage() {
  return (
    <PageContainer>
      <ContentCard>
        <AnimatedIcon>
          <Wrench size={60} color="white" />
        </AnimatedIcon>

        <Title>Under Maintenance</Title>

        <ProgressSection>
          <ProgressLabel>
            <AlertCircle size={16} />
            Maintenance in Progress
          </ProgressLabel>
          <ProgressText>Technicians is working hard</ProgressText>
        </ProgressSection>

        <ExpectedBox>
          <Calendar size={16} />
          Expected to be back:{" "}
          {new Date(Date.now() + 2.5 * 60 * 60 * 1000).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </ExpectedBox>
      </ContentCard>
    </PageContainer>
  );
}
