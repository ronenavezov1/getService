import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useCities } from "~/api/cities";
import { useUserByEmail, useUserBySession } from "~/api/users";
import { NextPageWithAuth, UserRole } from "~/components/Auth";
import { fetchAuthed } from "~/utils/fetchAuthed";

const TestPage: NextPageWithAuth = () => {
  const id = "117175447261374290443";
  const { data: user, isLoading } = useQuery(["test"], () =>
    fetchAuthed("http://localhost:4000/api/users").then((res) => res.json())
  );

  const { data: cities, isLoading: isLoadingCities } = useCities();

  const clickHandler = async () => {
    const response = await fetchAuthed("http://localhost:4000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ name: "test3" }),
    });
    console.log(response);
  };

  if (isLoading || isLoadingCities) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <button
        className=" rounded-lg bg-yellow-400  p-1 font-bold text-slate-700 hover:bg-yellow-500"
        onClick={clickHandler}
      >
        test
      </button>
      {/* <div>{`user: ${JSON.stringify(user)}`}</div> */}
      <div>{`cities : ${JSON.stringify(cities)}`}</div>
      <div className="flex gap-4">
        {cities?.map((city) => (
          <div key={city.name}>{city.name}</div>
        ))}
      </div>
    </>
  );
};

TestPage.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER],
};

export default TestPage;
