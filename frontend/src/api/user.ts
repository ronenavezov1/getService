import { useMutation, useQuery } from "@tanstack/react-query";
import type { UserRole } from "~/components/Auth";
import type { CompeleteDetailsFormSchemaType } from "~/pages/onboarding/completeDetails";
import axiosWithAuth from "./axiosConfig";

interface UsersQueryParams {
  isApproved?: boolean;
  isCompletedOnBoarding?: boolean;
  firstName?: string;
  lastName?: string;
}

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
  proffesion: string;
}

export type FullUser = Customer | Worker | Admin;

const BASE_USER_API_URL = `/user`;

//TODO:what post respose returns?
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

const getUsers = async (idToken: string, userQueryParams: UsersQueryParams) => {
  const { data } = await axiosWithAuth(idToken).get<FullUser[]>(
    `${BASE_USER_API_URL}`,
    { params: userQueryParams }
  );
  return data;
};

export const useGetUsers = (
  idToken: string,
  queryParams: UsersQueryParams = {}
) => {
  return useQuery(
    ["users", idToken, { queryParams }],
    () => getUsers(idToken, queryParams),
    {
      enabled: !!idToken,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
};
