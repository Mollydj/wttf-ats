import Cookies from "js-cookie";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMe } from "../api/me";

export const useMe = () => {
  const queryClient = useQueryClient();
  const bearerToken = Cookies.get("user-token");

  const { data: user = null, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: Boolean(bearerToken),
  });

  const clearUser = () => queryClient.setQueryData(["me"], null);

  return {
    user,
    hasBearerToken: Boolean(bearerToken),
    isLoading,
    clearUser,
  };
};