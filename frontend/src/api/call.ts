import { useMutation, useQuery } from "@tanstack/react-query";
import axiosWithAuth from "./axiosConfig";
import type { callCreateFormSchema } from "~/components/CallForm";

export enum CallStatus {
  NEW = "new",
  IN_PROGRESS = "inProgress",
  DONE = "done",
}

interface UserCallDetails {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Call {
  id: string;
  customer: UserCallDetails;
  worker?: UserCallDetails;
  service: string;
  description: string;
  city: string;
  address: string;
  expectedArrival: Date;
  creationTime: string;
  status: CallStatus;
}

export const BASE_CALL_API_URL = `/call`;

export interface CallQueryParams {
  id?: string;
  status?: string;
  customerId?: string;
  workerId?: string;
  profession?: string;
  city?: string;
  dateLimit?: number; //TODO days??
}

const getCall = async (idToken: string, queryParams: CallQueryParams) => {
  const { data } = await axiosWithAuth(idToken).get<Call[]>(
    `${BASE_CALL_API_URL}`,
    {
      params: queryParams,
    }
  );
  return data;
};

export const useGetCall = (
  idToken: string,
  queryParams: CallQueryParams = {}
) => {
  return useQuery(
    ["call", { ...queryParams }],
    async () => await getCall(idToken, queryParams),
    {
      enabled: !!idToken,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
};

const putCall = async (
  idToken: string,
  callId: string,
  call: callCreateFormSchema
) => {
  const { data } = await axiosWithAuth(idToken).put<callCreateFormSchema>(
    `${BASE_CALL_API_URL}`,
    {},
    {
      params: { ...call, id: callId },
    }
  );
  return data;
};

export const usePutCall = (idToken: string, callId: string) => {
  return useMutation(
    async (call: callCreateFormSchema) => await putCall(idToken, callId, call)
  );
};

const postCall = async (idToken: string, call: callCreateFormSchema) => {
  const { data } = await axiosWithAuth(idToken).post<Call>(
    `${BASE_CALL_API_URL}`,
    call
  );
  return data;
};

export const useCreateCall = (idToken: string) => {
  return useMutation(
    async (call: callCreateFormSchema) => await postCall(idToken, call)
  );
};

//TODO:what delete call response returns?
const deleteCall = async (idToken: string, callId: string) => {
  const { data } = await axiosWithAuth(idToken).delete<Call>(
    `${BASE_CALL_API_URL}`,
    { params: { id: callId } }
  );
  return data;
};

export const useDeleteCall = (idToken: string) => {
  return useMutation(
    async (callId: string) => await deleteCall(idToken, callId)
  );
};
