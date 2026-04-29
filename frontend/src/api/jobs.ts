import { Job, JobSearchParams } from "../types/types";

const buildQueryString = (params: JobSearchParams): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && value.trim() !== "") {
      query.append(key, value.trim());
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

export const fetchJobs = async (
  params: JobSearchParams = {},
): Promise<Job[]> => {
  const res = await fetch(`/api/jobs${buildQueryString(params)}`);

  if (!res.ok) {
    throw new Error("Get Jobs failed");
  }

  const body = await res.json();
  return body.data;
};

export const fetchJob = async (jobId: number) => {
  const res = await fetch(`/api/jobs/${jobId}`);

  if (!res.ok) {
    throw new Error("Get Job failed");
  }

  const body = await res.json();
  return body.data;
};

import Cookies from "js-cookie";

export const deleteJob = async (jobId: number | string): Promise<void> => {
  const bearerToken = Cookies.get("user-token");
  const csrfToken = Cookies.get("technical-test-csrf-token");

  const res = await fetch(`/api/jobs/${jobId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
    },
  });

  if (!res.ok) {
    throw new Error("Delete job failed");
  }
};

export type UpdateJobParams = {
  title: string;
  description: string;
  contract_type: string;
  office: string;
  status: string;
  work_mode: string;
};

export const updateJob = async (
  id: number | string,
  params: UpdateJobParams,
): Promise<void> => {
  const bearerToken = Cookies.get("user-token");
  const csrfToken = Cookies.get("technical-test-csrf-token");

  const res = await fetch(`/api/jobs/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
    },
    body: JSON.stringify({ job: params }),
  });

  if (!res.ok) {
    throw new Error("Update job failed");
  }
};

type CreateJobParams = {
  title: string;
  description: string;
  contract_type: string;
  office: string;
  status: string;
  work_mode: string;
};

export const createJob = async (params: CreateJobParams): Promise<void> => {
  const bearerToken = Cookies.get("user-token");
  const csrfToken = Cookies.get("technical-test-csrf-token");

  const res = await fetch("/api/jobs", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
    },
    body: JSON.stringify({ job: params }),
  });

  if (!res.ok) {
    throw new Error("Create job failed");
  }
};
