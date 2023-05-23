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

export enum ExpectedArrivalTimeSlots {
  Morning = "8:00-12:00",
  Afternoon = "12:00-16:00",
  Evening = "16:00-20:00",
}

export interface Call {
  id: string;
  customer: UserCallDetails;
  worker?: UserCallDetails;
  profession: string;
  description: string;
  city: string;
  address: string;
  expectedArrivalDate: Date;
  expectedArrivalTime: ExpectedArrivalTimeSlots;
  creationTime: Date;
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

interface CallCompleteBody {
  status: CallStatus.DONE;
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
  call: callCreateFormSchema | CallCompleteBody
) => {
  const { data } = await axiosWithAuth(idToken).put<
    callCreateFormSchema | CallCompleteBody
  >(`${BASE_CALL_API_URL}`, call, {
    params: { id: callId },
  });
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

export const usePutCompleteCall = (idToken: string, callId: string) => {
  const completePayload: CallCompleteBody = {
    status: CallStatus.DONE,
  };

  return useMutation(
    async () => await putCall(idToken, callId, completePayload)
  );
};
