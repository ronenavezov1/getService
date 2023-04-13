import { useQuery } from "@tanstack/react-query";
import { env } from "~/env.mjs";

interface City {
  name: string;
}

const BASE_CITY_API_URL = `${env.NEXT_PUBLIC_BASE_API_URL}cities`;

const fetchCites = async () => {
  const res = await fetch(`${BASE_CITY_API_URL}`);
  const data = await res.json();
  return data as City[];
};

/**
 * Returns all cities from db and caches them
 * @returns returns all cities from db
 */
export const useCities = () => {
  return useQuery(["cities"], fetchCites, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
