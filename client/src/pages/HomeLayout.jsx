import React from "react";
import { Outlet } from "react-router-dom";

//<nav>navbar</nav>

const HomeLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default HomeLayout;
