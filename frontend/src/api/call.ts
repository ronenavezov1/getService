import { useMutation, useQuery } from "@tanstack/react-query";
import axiosWithAuth from "./axiosConfig";
import type { callCreateFormSchema } from "~/components/CallForm";

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
  creationTime: string;
  status: CallStatus;
}

const BASE_CALL_API_URL = `/call`;

const getUserCalls = async (idToken: string) => {
  const { data } = await axiosWithAuth(idToken).get<Call[]>(
    `${BASE_CALL_API_URL}`
  );
  return data;
};

interface CallQueryParams {
  id?: string;
  status?: string;
  customerId?: string;
  workerId?: string;
}

const getCall = async (idToken: string, queryParams: CallQueryParams) => {
  const { id, status, customerId, workerId } = queryParams;
  const { data } = await axiosWithAuth(idToken).get<Call[]>(
    `${BASE_CALL_API_URL}`,
    {
      params: { id, status, customerId, workerId },
    }
  );
  return data;
};

export const useGetCall = (
  idToken: string,
  queryParams: CallQueryParams = {}
) => {
  const { id, status, customerId, workerId } = queryParams;

  return useQuery(
    ["call", id, status, customerId, workerId],
    async () => await getCall(idToken, { id, status, customerId, workerId }),
    {
      enabled: !!idToken,
    }
  );
};

// const getCallbyId = async (idToken: string, callId: string) => {
//   const { data } = await axiosWithAuth(idToken).get(
//     `${BASE_CALL_API_URL}/${callId}`
//   );
//   return data as Call;
// };

//TODO:what delete call response returns?
const deleteCall = async (idToken: string, callId: string) => {
  const { data } = await axiosWithAuth(idToken).delete<Call>(
    `${BASE_CALL_API_URL}/${callId}`
  );
  return data;
};

// const updateCall = async (idToken: string, call: Call) => {
//   const { data } = await axiosWithAuth(idToken).put(
//     `${BASE_CALL_API_URL}/${call.id}`,
//     call
//   );
//   return data as Call;
// };

//TODO? what response returns? call?
const createCall = async (idToken: string, call: callCreateFormSchema) => {
  const { data } = await axiosWithAuth(idToken).post<Call>(
    `${BASE_CALL_API_URL}`,
    call
  );
  return data;
};

export const useCreateCall = (idToken: string) => {
  return useMutation(
    async (call: callCreateFormSchema) => await createCall(idToken, call)
  );
};

export const useDeleteCall = (idToken: string) => {
  return useMutation(
    async (callId: string) => await deleteCall(idToken, callId)
  );
};

export const useUserCalls = (idToken: string) => {
  return useQuery(
    ["userCalls", idToken],
    async () => await getUserCalls(idToken),
    {
      enabled: !!idToken,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
};

// export const useCallById = (CallId: string, idToken?: string) => {
//   return useQuery(
//     ["call", CallId],
//     async () => await getCallbyId(idToken!, CallId!),
//     {
//       enabled: !!CallId && !!idToken,
//     }
//   );
// };
