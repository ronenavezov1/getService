import axios from "axios";
import { signOut } from "next-auth/react";
import { env } from "~/env.mjs";

// Set base URL for all requests
axios.defaults.baseURL = `${env.NEXT_PUBLIC_BASE_API_URL}`;

const defaultAxios = axios.create({
  baseURL: `${env.NEXT_PUBLIC_BASE_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { defaultAxios as axios };

export const axiosWithAuth = (idToken: string) => {
  const instance = axios.create({
    baseURL: `${env.NEXT_PUBLIC_BASE_API_URL}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `${idToken}`,
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 401) {
        await signOut();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosWithAuth;
