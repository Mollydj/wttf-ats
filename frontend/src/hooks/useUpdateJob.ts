import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updateJob, UpdateJobParams } from "../api/jobs";

export const useUpdateJob = (id: number | string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (params: UpdateJobParams) => updateJob(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      navigate("/");
    },
  });
};