/* eslint-disable */
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";
import { useGetCities } from "~/api/cities";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import axiosWithAuth, { axios } from "~/api/axiosConfig";

const TestPage = () => {
  const { data: session } = useSession({ required: true });
  const { data } = useQuery(["test", session?.idToken], async () => {
    const { data } = await axiosWithAuth(session?.idToken!).get(
      "http://localhost:4000/api/test"
    );
    return data;
  });

  return <button onClick={() => toast.error("error")}>click</button>;
};

export default TestPage;
