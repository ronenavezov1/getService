import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useUser, useUserBySession } from "~/api/users";
import { NextPageWithAuth, UserRole } from "~/components/Auth";
import { fetchAuthed } from "~/utils/fetchAuthed";

const TestPage: NextPageWithAuth = () => {
  const id = "117175447261374290443";
  const { data: user, isLoading } = useQuery(["test"], () =>
    fetchAuthed("http://localhost:4000/api/test/1").then((res) => res.json())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{`user: ${JSON.stringify(user)}`}</div>;
};

TestPage.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER],
};

export default TestPage;
