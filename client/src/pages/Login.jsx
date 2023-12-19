import React from "react";
import { Form, redirect, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { Logo, FormRow, SubmitBtn } from "../components";
import customFetch from '../utils/customFetch';

export const action = async ({request}) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  //console.log(data);
  try {
    await customFetch.post('/users/login', data);
    toast.success("Login successful");
    return redirect('/dashboard');
  } catch (error) {
    //console.log(error);
    toast.error(error?.response?.data?.message);
    return error;
  }
}

const Login = () => {
  //redirect for action function, useNavigate for component itself
  const navigate = useNavigate();
  const loginDemoUser = async () => {
    const data = {
      email: "test@test.com",
      password: "Password"
    }

    try {
      await customFetch.post('/users/login', data);
      toast.success("Test the app");
      navigate('/dashboard');
    } catch (error) {
      //console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow
          type="email"
          name="email"
          labelText="email"
        />
        <FormRow
          type="password"
          name="password"
          labelText="password"
        />
        <SubmitBtn />
        <button type="button" className="btn btn-block" onClick={loginDemoUser}>
          explore the app
        </button>
        <p>
          Not yet a total member?
          <Link to="/register" className="member-btn">
            register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Login;
