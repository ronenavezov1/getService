import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UserRole } from "~/components/Auth";
import { env } from "~/env.mjs";
import {
  CustomerSchemaType,
  WorkerSchemaType,
} from "~/pages/onboarding/completeDetails";
import { fetchAuthed } from "~/utils/fetchAuthed";

const BASE_USER_API_URL = `${env.NEXT_PUBLIC_BASE_API_URL}users`;

interface User {
  id: string;
  name: string;
  role: UserRole;
  isCompletedOnBoarding: boolean;
}

const getUserById = async (id: string) => {
  const res = await fetchAuthed(`${BASE_USER_API_URL}/${id}`);
  const data = await res.json();
  return data as User;
};

/**
 * Returns user from db by using id, caches user for whole session
 * only fetches if id is defined
 * @param id id of user to fetch
 */
export const useUser = (id: string | undefined) => {
  return useQuery(["user", id], () => getUserById(id!), {
    enabled: !!id,
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
  return useUser(session?.user?.id);
};

/**
 *return mutation to create user
 *
 */
export const useCreateUser = () => {
  return useMutation(
    async (user: CustomerSchemaType | WorkerSchemaType) => {
      const res = await fetchAuthed(`${BASE_USER_API_URL}`, {
        method: "POST",
        body: JSON.stringify(user),
      });
      const data = await res.json();
      return data as User;
    },
    {
      onSuccess: (data) => {
        console.log("data", data);
      },
    }
  );
};
