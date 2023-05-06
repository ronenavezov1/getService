import { useMutation } from "@tanstack/react-query";
import axiosWithAuth from "./axiosConfig";

export const BASE_CALL_API_URL = `/approveUser`;

interface ApproveUser {
  isApproved: boolean;
}

const postApproveUser = async (
  idToken: string,
  userId: string,
  approveUser: ApproveUser
) => {
  const { data } = await axiosWithAuth(idToken).post<ApproveUser>(
    `${BASE_CALL_API_URL}`,
    approveUser,
    { params: { id: userId } }
  );
  return data;
};

export const usePostApproveUser = (idToken: string, userId: string) => {
  return useMutation(
    async (approveUser: ApproveUser) =>
      await postApproveUser(idToken, userId, approveUser)
  );
};
