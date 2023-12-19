import React from "react";
import { FaTimes } from "react-icons/fa";

import { useDashboardContext } from "../pages/DashboardLayout";
import Wrapper from "../assets/wrappers/SmallSidebar";
import { Logo, NavLinks } from "../components";

const SmallSidebar = () => {
  const { showSidebar, toggleSidebar } = useDashboardContext();
  // console.log(data);
  return (
    <Wrapper>
      <div
        className={`sidebar-container ${showSidebar ? " show-sidebar" : ""}`}
      >
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSidebar;
