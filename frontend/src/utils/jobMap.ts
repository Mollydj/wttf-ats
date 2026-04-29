import { ContractType, Option, StatusType, WorkModeType } from "../types/types";

export const CONTRACT_TYPE_OPTIONS: Option<ContractType>[] = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Temporary", value: "TEMPORARY" },
  { label: "Freelance", value: "FREELANCE" },
  { label: "Internship", value: "INTERNSHIP" },
  { label: "Apprenticeship", value: "APPRENTICESHIP" },
  { label: "VIE", value: "VIE" },
];

export const STATUS_OPTIONS: Option<StatusType>[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Filled", value: "filled" },
  { label: "Archived", value: "archived" },
  { label: "Cancelled", value: "cancelled" },
];

export const WORK_MODE_OPTIONS: Option<WorkModeType>[] = [
  { label: "On-site", value: "onsite" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];
