import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
}

export const fetchMe = async (): Promise<User | null> => {
  const csrfToken = Cookies.get("technical-test-csrf-token");
  const bearerToken = Cookies.get("user-token");

  if (!bearerToken) return null;

  const res = await fetch("/api/me", {
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${bearerToken}`,
      ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
    },
  });

  if (!res.ok) return null;
  
  const body = await res.json().catch(() => ({}));
  return body?.data ?? null;
};
