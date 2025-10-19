import type { EmployeeSkill } from "./EmployeeSkill";

export type EmployeeSkillCategoryViewModel = {
  id: number;
  name: string;
  isDeleted: boolean;
  services: EmployeeSkill[];
};
