import { NextPageWithAuth } from "./_app";
import React from "react";

const TestPage = () => {
  return <div>test</div>;
};

TestPage.auth = {
  requiredRole: "user",
};

export default TestPage;
