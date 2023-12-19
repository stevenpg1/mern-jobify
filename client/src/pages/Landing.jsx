import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";
import { Logo } from "../components";

// const StyledBtn = styled.button`
//   font-size: 1.5rem;
//   background: red;
//   color: white;
// `;

//<StyledBtn>styled btn</StyledBtn>

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum
            molestias et consequatur, quibusdam modi inventore soluta odit iste
            reprehenderit dignissimos est sapiente animi hic nemo earum vel ad
            ratione sequi!
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn ">
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
