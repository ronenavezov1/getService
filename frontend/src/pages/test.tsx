import { NextPageWithAuth } from "./_app";
import React from "react";
import { useQuery } from "react-query";
import { fetchAuthed } from "~/utils/fetchAuthed";

const TestPage = () => {
  const id = "117175447261374290443";
  const { data: user, isLoading } = useQuery("test", () =>
    fetchAuthed("http://localhost:4000/api/test/1").then((res) => res.json())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{`user: ${JSON.stringify(user)}`}</div>;
};

TestPage.auth = {
  requiredRoles: ["admin", "customer", "provider"],
};

export default TestPage;
