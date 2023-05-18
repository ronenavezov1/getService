import { useQuery } from "@tanstack/react-query";
import axiosWithAuth from "./axiosConfig";

export interface Profession {
  value: string;
}

const BASE_CITY_API_URL = "/professions";

const getProfessions = async (idToken: string) => {
  const { data } = await axiosWithAuth(idToken).get<Profession[]>(
    BASE_CITY_API_URL
  );
  return data;
};

export const useGetProfessions = (idToken: string) => {
  return useQuery(["professions", idToken], () => getProfessions(idToken), {
    enabled: !!idToken,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
