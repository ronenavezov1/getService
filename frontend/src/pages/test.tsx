import { NextPageWithAuth } from "./_app";
import React from "react";
import { useQuery } from "react-query";
import { fetchUser } from "~/api/user";

// async function fetchUsers() {
//   const res = await fetchAuthed("http://localhost:4000/api/test/1");
//   const data = await res.json();
// }

const TestPage = () => {
  const id = "1"; //TODO uuid testing
  const query = useQuery(["user", id], () => fetchUser(id));
  const { data: user, isLoading } = query;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{`user: ${JSON.stringify(user)}`}</div>;
};

TestPage.auth = {
  requiredRoles: ["admin", "customer", "provider"],
};

export default TestPage;
