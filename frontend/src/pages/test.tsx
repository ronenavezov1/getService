import { NextPageWithAuth } from "./_app";
import React from "react";
import { useQuery } from "react-query";
import { env } from "process";
import { signOut } from "next-auth/react";
import fetchAuthed from "~/utils/fetchAuthed";

async function fetchUsers() {
  const res = await fetchAuthed("http://localhost:4000/api/test/1");
  const data = await res.json();
  console.log("res:", data);
  return data;
}

const TestPage = () => {
  const query = useQuery("user", fetchUsers);
  const { data: user, isLoading } = query;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(user);
  return <div>{`user: worked`}</div>;
};

TestPage.auth = {
  requiredRoles: ["admin", "customer", "provider"],
};

export default TestPage;
