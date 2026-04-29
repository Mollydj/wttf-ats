import { useQuery } from "@tanstack/react-query";
import { Job, JobSearchParams } from "../types/types";
import { fetchJob, fetchJobs } from "../api/jobs";

export const useJob = (jobId: number) => {
  return useQuery<Job>({
    queryKey: ["jobs", jobId],
    queryFn: () => fetchJob(jobId),
  });
};

export const useJobs = (params: JobSearchParams = {}) => {
  return useQuery<Job[]>({
    queryKey: ["jobs", params],
    queryFn: () => fetchJobs(params),
  });
};