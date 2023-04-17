import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";
import { useCities } from "~/api/cities";
import { useUserByEmail, useUserBySession } from "~/api/users";
import { NextPageWithAuth, UserRole } from "~/components/Auth";
import { fetchAuthed } from "~/utils/fetchAuthed";

const TestPage = () => {
  const { data: session, status } = useSession({ required: true });
  console.log(session?.idToken);

  const { data: user, isLoading } = useQuery(["testUser"], () =>
    fetch("http://get-service.eastus.cloudapp.azure.com:8080/api/cities", {
      method: "GET",
      headers: {
        Authorization: `${session?.idToken}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  );

  // const { data: cities, isLoading: isLoadingCities } = useCities();

  // const clickHandler = async () => {
  //   const response = await fetchAuthed("http://localhost:4000/api/users", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },

  //     body: JSON.stringify(user),
  //   });
  //   console.log(response);
  // };

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <button
        className=" rounded-lg bg-yellow-400  p-1 font-bold text-slate-700 hover:bg-yellow-500"
        onClick={clickHandler}
      >
        test
      </button> */}
      <div>{`user: ${JSON.stringify(user)}`}</div>
    </>
  );
};

export default TestPage;
