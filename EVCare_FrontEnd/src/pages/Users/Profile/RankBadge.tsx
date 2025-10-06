import type { Rank } from "../../../models/enums/AccountRankingEnum";

export default function RankBadge({ rank }: { rank: Rank }) {
  const mapClass = (r: Rank) => {
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
