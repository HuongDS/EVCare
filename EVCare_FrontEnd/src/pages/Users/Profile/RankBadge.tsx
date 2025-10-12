import type { CustomerRankEnum } from "../../../models/enums";

export default function RankBadge({ rank }: { rank: CustomerRankEnum }) {
  const mapClass = (r: CustomerRankEnum) => {
    switch (r) {
      case "REGULAR":
        return "rank-badge rank-regular";
      case "MEMBER":
        return "rank-badge rank-member";
      case "VIP":
      default:
        return "rank-badge rank-vip";
    }
  };

  return <span className={mapClass(rank)}>{rank}</span>;
}
