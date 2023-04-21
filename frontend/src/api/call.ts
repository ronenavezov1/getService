import { useMutation, useQuery } from "@tanstack/react-query";
import axiosWithAuth from "./axiosConfig";

enum CallStatus {
  NEW = "new",
  IN_PROGRESS = "inProgress",
  DONE = "done",
}

export interface Call {
  id: string;
  workerId: string;
  customerId: string;
  service: string;
  description: string;
  city: string;
  address: string;
  creationTime: Date;
  status: CallStatus;
}

const BASE_CALL_API_URL = `/call`;

const getUserCalls = async (idToken: string) => {
  const { data } = await axiosWithAuth(idToken).get(`${BASE_CALL_API_URL}`);
  return data as Call[];
};

const deleteCall = async (idToken: string, callId: string) => {
  const { data } = await axiosWithAuth(idToken).delete(
    `${BASE_CALL_API_URL}/${callId}`
  );
  return data as Call;
};

export const useDeleteCall = (idToken: string = "") => {
  return useMutation((callId: string) => deleteCall(idToken, callId));
};

export const useUserCalls = (idToken?: string) => {
  return useQuery(["userCalls", idToken], () => getUserCalls(idToken!), {
    enabled: !!idToken,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
