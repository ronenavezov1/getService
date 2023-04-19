import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UserRole } from "~/components/Auth";
import { CompeleteDetailsFormSchemaType } from "~/pages/onboarding/completeDetails";
import { fetchAuthed } from "~/utils/fetchAuthed";
import { axios } from "./axiosConfig";

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
const BASE_USER_API_URL = `/users`;

const getUserByEmail = async (email: string) => {
  const { data } = await axios.get(`${BASE_USER_API_URL}/${email}`);
  return data as Customer | Worker;
};

const postUser = async (user: CompeleteDetailsFormSchemaType) => {
  const { data } = await axios.post(`${BASE_USER_API_URL}`, user);
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
 *Return useMutation to create user
\ */
export const usePostUser = () => {
  return useMutation(postUser);
};
