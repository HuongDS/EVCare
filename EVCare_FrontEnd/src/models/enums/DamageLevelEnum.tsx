export enum DamageLevelEnum {
  NotAssessed = 0,
  Minor = 30,
  Moderate = 50,
  Severe = 70,
  Critical = 100,
}

export enum DamageLevelStringEnum {
  NotAssessed = "NotAssessed",
  Minor = "Minor",
  Moderate = "Moderate",
  Severe = "Severe",
  Critical = "Critical",
}

export const DamageLevelLabels: Record<DamageLevelStringEnum, string> = {
  [DamageLevelStringEnum.NotAssessed]: "Not Assessed",
  [DamageLevelStringEnum.Minor]: "Minor",
  [DamageLevelStringEnum.Moderate]: "Moderate",
  [DamageLevelStringEnum.Severe]: "Severe",
  [DamageLevelStringEnum.Critical]: "Critical",
};

export const damageColorMap: Record<DamageLevelStringEnum, string> = {
  [DamageLevelStringEnum.NotAssessed]: "#9ca3af",
  [DamageLevelStringEnum.Minor]: "#22c55e",
  [DamageLevelStringEnum.Moderate]: "#facc15",
  [DamageLevelStringEnum.Severe]: "#f97316",
  [DamageLevelStringEnum.Critical]: "#ef4444",
};
