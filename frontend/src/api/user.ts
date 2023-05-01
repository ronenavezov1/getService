import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { UserRole } from "~/components/Auth";
import type { CompeleteDetailsFormSchemaType } from "~/pages/onboarding/completeDetails";
import axiosWithAuth, { axios } from "./axiosConfig";

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

interface Admin extends User {
  role: UserRole.ADMIN;
}

interface Worker extends User {
  role: UserRole.WORKER;
  proffesion: string;
}

const BASE_USER_API_URL = `/user`;

//TODO:what post respose returns?
const postUser = async (user: CompeleteDetailsFormSchemaType) => {
  const { data } = await axios.post<Customer | Worker | Admin>(
    `${BASE_USER_API_URL}`,
    user
  );
  return data;
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
  });
};

/**
 *Return useMutation to create user
\ */
export const usePostUser = () => {
  return useMutation(postUser);
};
