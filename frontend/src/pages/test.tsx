import { NextPageWithAuth } from "./_app";
import React from "react";
import { useQuery } from "react-query";
import { fetchUserById } from "~/api/user";

const TestPage = () => {
  const id = "117175447261374290443";
  const query = useQuery(["user", id], () => fetchUserById(id));
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
