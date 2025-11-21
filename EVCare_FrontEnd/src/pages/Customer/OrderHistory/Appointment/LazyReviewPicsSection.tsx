import React, { Suspense } from "react";
import type { CardData } from "../../../../models/Pics/CardData";

interface Props {
  data: CardData[];
}

const ReviewPicsSection = React.lazy(() => import("./ReviewPicsSection"));

export const LazyReviewPicsSection = ({ data }: Props) => {
  return (
    <Suspense fallback={<div>Appointment pictures is loading</div>}>
      <ReviewPicsSection data={data} />
    </Suspense>
  );
};
