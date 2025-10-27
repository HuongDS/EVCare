export enum DamageLevelEnum {
  NotAssessed = 0,
  Minor = 30,
  Moderate = 50,
  Severe = 70,
  Critical = 100,
}

export const DamageLevelLabels: Record<DamageLevelEnum, string> = {
  [DamageLevelEnum.NotAssessed]: "Not Assessed",
  [DamageLevelEnum.Minor]: "Minor",
  [DamageLevelEnum.Moderate]: "Moderate",
  [DamageLevelEnum.Severe]: "Severe",
  [DamageLevelEnum.Critical]: "Critical",
};

export const damageColorMap: Record<DamageLevelEnum, string> = {
  [DamageLevelEnum.NotAssessed]: "#9ca3af",
  [DamageLevelEnum.Minor]: "#22c55e",
  [DamageLevelEnum.Moderate]: "#facc15",
  [DamageLevelEnum.Severe]: "#f97316",
  [DamageLevelEnum.Critical]: "#ef4444",
};
