import { useMutation } from "@tanstack/react-query";
import axiosWithAuth from "./axiosConfig";
import { type CallStatus } from "./call";

export interface PickCall {
  workerId: string;
  status: CallStatus;
  expectedArrivalTime: Date | string;
}

const BASE_PICK_API_URL = `/pick`;

const postPick = async (idToken: string, pick: PickCall, callId: string) => {
  const { data } = await axiosWithAuth(idToken).post<PickCall>(
    `${BASE_PICK_API_URL}`,
    pick,
    {
      params: { id: callId },
    }
  );
  return data;
};

export const usePostPick = (idToken: string, callId: string) => {
  return useMutation(
    async (pick: PickCall) => await postPick(idToken, pick, callId)
  );
};
