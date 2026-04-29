// Type definitions for the ATS frontend

export interface Profession {
  id: number;
  name: string;
  category_name: string;
}

export type Job = {
  id: number;
  title: string;
  description: string;
  contract_type: ContractType;
  office: string;
  status: StatusType;
  work_mode: WorkModeType;
  profession: Profession | null;
  applicants: Applicant[];
  inserted_at: string;
  updated_at: string;
};

export interface ApiResponse<T> {
  data: T;
}

export interface JobsApiResponse {
  data: Job[];
}

export interface Applicant {
  id: number;
  application_date: string;
  status: string;
  salary_expectation: number;
  candidate: Candidate;
}

export interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  last_known_job: string;
}

export interface JobSearchParams {
  title?: string;
  office?: string;
  work_mode?: string;
  contract_type?: string;
}


export type ContractType =
  | "FULL_TIME"
  | "PART_TIME"
  | "TEMPORARY"
  | "FREELANCE"
  | "INTERNSHIP"
  | "APPRENTICESHIP"
  | "VIE";

export type StatusType =
  | "draft"
  | "published"
  | "filled"
  | "archived"
  | "cancelled";


export type WorkModeType = "onsite" | "remote" | "hybrid";

export type Option<T extends string> = { label: string; value: T };