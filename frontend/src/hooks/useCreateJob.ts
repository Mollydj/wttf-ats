import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

type CreateJobParams = {
  title: string;
  description: string;
  contract_type: string;
  office: string;
  status: string;
  work_mode: string;
  profession_id: number;
};

const createJob = async (params: CreateJobParams): Promise<void> => {
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

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      navigate("/");
    },
    onError: (error) => {
      console.error("error:", error);
    },
  });
};
