import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UserRole } from "~/components/Auth";
import { env } from "~/env.mjs";
import { CompeleteDetailsFormSchemaType } from "~/pages/onboarding/completeDetails";
import { fetchAuthed } from "~/utils/fetchAuthed";

const BASE_USER_API_URL = `${env.NEXT_PUBLIC_BASE_API_URL}users`;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  adress: string;
  city: string;
  isCompletedOnBoarding: boolean;
}

interface Customer extends User {
  role: UserRole.CUSTOMER;
}

interface Worker extends User {
  role: UserRole.WORKER;
  proffesion: string;
}

const getUserByEmail = async (email: string) => {
  const res = await fetchAuthed(`${BASE_USER_API_URL}/${email}`);
  const data = await res.json();
  return data as Customer | Worker;
};

const postUser = async (user: CompeleteDetailsFormSchemaType) => {
  const res = await fetchAuthed(`${BASE_USER_API_URL}`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(user),
  });
  const data = await res.json();
  return data;
};

/**
 * Returns user from db by using id, caches user for whole session
 * only fetches if id is defined
 * @param id id of user to fetch
 */
export const useUserByEmail = (email?: string | null) => {
  return useQuery(["user", email], () => getUserByEmail(email!), {
    enabled: !!email,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};

/**
 * Returns user from db by using id from nextAuth session
 * only fetches if id is defined
 */
export const useUserBySession = () => {
  const { data: session } = useSession();
  return useUserByEmail(session?.user?.email);
};

/**
 *Return mutation to create user
 *invalidates user query on success
 * @param queryClient
 */
export const useCreateUser = () => {
  return useMutation(postUser);
};
