import { UseQueryOptions, useQuery } from "react-query";
import { env } from "~/env.mjs";
import { fetchAuthed } from "~/utils/fetchAuthed";

const BASE_USER_API_URL = `${env.NEXT_PUBLIC_BASE_API_URL}users`;

const fetchUserById = async (id: string) => {
  const res = await fetchAuthed(`${BASE_USER_API_URL}/${id}`);
  const data = await res.json();
  return data;
};

export const useUser = (id: string | undefined) => {
  return useQuery(["user", id], () => fetchUserById(id!), { enabled: !!id });
};
