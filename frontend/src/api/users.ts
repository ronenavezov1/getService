import { useQuery } from "@tanstack/react-query";
import axiosWithAuth from "./axiosConfig";
import type { FullUser } from "./user";

interface UsersQueryParams {
  isApproved?: boolean;
  isCompletedOnBoarding?: boolean;
  firstName?: string;
  lastName?: string;
}

const BASE_USERS_API_URL = `/users`;

const getUsers = async (idToken: string, userQueryParams: UsersQueryParams) => {
  const { data } = await axiosWithAuth(idToken).get<FullUser[]>(
    `${BASE_USERS_API_URL}`,
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
