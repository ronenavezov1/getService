import { useSession } from "next-auth/react";
import React from "react";
import { useCities } from "~/api/cities";

const TestPage = () => {
  const { data: session, status } = useSession({ required: true });

  const { data: user, isLoading } = useCities(session?.idToken!);
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
