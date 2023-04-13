import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { env } from "~/env.mjs";
import { fetchAuthed } from "~/utils/fetchAuthed";

const BASE_USER_API_URL = `${env.NEXT_PUBLIC_BASE_API_URL}users`;

const fetchUserById = async (id: string) => {
  const res = await fetchAuthed(`${BASE_USER_API_URL}/${id}`);
  const data = await res.json();
  return data;
};

export const useUser = (id: string | undefined) => {
  return useQuery(["user", id], () => fetchUserById(id!), {
    enabled: !!id,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};

/**
 * Returns user from db by using id from nextAuth session
 * @returns {User} User object
 */
export const useUserBySession = () => {
  const { data: session } = useSession();
  return useUser(session?.user?.id);
};
