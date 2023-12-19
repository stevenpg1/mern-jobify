import React from "react";
import { Link, useRouteError } from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";
import notFound from "../assets/images/not-found.svg";

const Error = () => {
  const error = useRouteError();
  //console.log(error);
  if (error.status === 404) {
    return (
      <Wrapper>
        <div>
          <img src={notFound} alt="not found" />
          <h3>Page not found</h3>
          <p>The page you are looking for does not exist.</p>
          <Link to="/dashboard">back to dashboard</Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h3>something went wrong</h3>
    </Wrapper>
  );
};

export default Error;
