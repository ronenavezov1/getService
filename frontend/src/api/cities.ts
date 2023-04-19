import { useQuery } from "@tanstack/react-query";
import { env } from "~/env.mjs";
import { useSession } from "next-auth/react";
import axiosWithAuth from "./axiosConfig";

interface City {
  name: string;
}

const BASE_CITY_API_URL = "/cities";

const fetchCites = async (idToken: string) => {
  const { data } = await axiosWithAuth(idToken).get(BASE_CITY_API_URL);
  return data as City[];
};

/**
 * Returns all cities from db and caches them
 * @returns returns all cities from db
 */
export const useCities = (idToken: string | undefined) => {
  return useQuery(["cities", idToken], () => fetchCites(idToken!), {
    enabled: !!idToken,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
