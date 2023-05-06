import { useQuery } from "@tanstack/react-query";
import axiosWithAuth from "./axiosConfig";

interface City {
  name: string;
}

interface CityQueryParams {
  startWith: string;
}

const BASE_CITY_API_URL = "/cities";

const getCities = async (idToken: string, cityQueryParams: CityQueryParams) => {
  const { data } = await axiosWithAuth(idToken).get<City[]>(BASE_CITY_API_URL, {
    params: { ...cityQueryParams },
  });
  return data;
};

/**
 * Returns all cities that start with the given string with a minimum length of 3
 */
export const useGetCities = (
  idToken: string,
  cityQueryParams: CityQueryParams
) => {
  return useQuery(
    ["cities", idToken],
    () => getCities(idToken, cityQueryParams),
    {
      enabled: !!idToken && cityQueryParams.startWith?.length >= 3,
    }
  );
};
