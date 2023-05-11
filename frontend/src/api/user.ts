import { useMutation, useQuery } from "@tanstack/react-query";
import { type UserRole } from "~/components/Auth";
import type { CompeleteDetailsFormSchemaType } from "~/pages/onboarding/completeDetails";
import axiosWithAuth from "./axiosConfig";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  isOnBoardingCompleted: boolean;
  isApproved: boolean;
}

interface Customer extends User {
  type: UserRole.CUSTOMER;
}

interface Admin extends User {
  type: UserRole.ADMIN;
}

interface Worker extends User {
  type: UserRole.WORKER;
  profession: string;
}

export type FullUser = Customer | Worker | Admin;

const BASE_USER_API_URL = `/user`;

const postUser = async (
  idToken: string,
  user: CompeleteDetailsFormSchemaType
) => {
  const { data } = await axiosWithAuth(idToken).post<FullUser>(
    `/onBoarding`,
    user
  );
  return data;
};

/**
 *Return useMutation to create user
 */
export const usePostUser = (idToken: string) => {
  return useMutation(
    async (user: CompeleteDetailsFormSchemaType) =>
      await postUser(idToken, user)
  );
};

const getUserByIdToken = async (idToken: string) => {
  const { data } = await axiosWithAuth(idToken).get<Customer | Worker | Admin>(
    `${BASE_USER_API_URL}`
  );
  return data;
};

export const useGetUserByIdToken = (idToken: string) => {
  return useQuery(["user", idToken], () => getUserByIdToken(idToken), {
    enabled: !!idToken,
    staleTime: 60 * (60 * 1000), // 60 mins ,
    cacheTime: 60 * (60 * 1000), // 60 mins ,
  });
};
