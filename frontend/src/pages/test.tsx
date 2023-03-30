import { NextPageWithAuth } from "next";
import React from "react";

const TestPage = () => {
  return <div>test</div>;
};

TestPage.auth = {
  requiredRole: "admin",
};

export default TestPage;
