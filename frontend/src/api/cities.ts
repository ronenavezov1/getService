import { useQuery } from "@tanstack/react-query";
import axiosWithAuth from "./axiosConfig";

interface City {
  name: string;
}

const BASE_CITY_API_URL = "/cities";

const fetchCites = async (idToken: string) => {
  const { data } = await axiosWithAuth(idToken).get<City[]>(BASE_CITY_API_URL);
  return data;
};

/**
 * Returns all cities from db and caches them
 */
export const useCities = (idToken: string) => {
  return useQuery(["cities", idToken], () => fetchCites(idToken), {
    enabled: !!idToken,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
