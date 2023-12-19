import React from "react";
import { FaTimes } from "react-icons/fa";

import { useDashboardContext } from "../pages/DashboardLayout";
import Wrapper from "../assets/wrappers/BigSidebar";
import { Logo, NavLinks } from "../components";

const BigSidebar = () => {
  const { showSidebar, toggleSidebar } = useDashboardContext();
  return (
    <Wrapper>
      <div
        className={`sidebar-container ${!showSidebar ? " show-sidebar" : ""}`}
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks isBigSidebar />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
