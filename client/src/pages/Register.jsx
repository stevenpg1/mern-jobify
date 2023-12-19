import React from "react";
import { Form, redirect, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { Logo, FormRow, SubmitBtn } from "../components";
import customFetch from '../utils/customFetch';

export const action = async ({request}) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  //console.log(data);
  try {
    await customFetch.post('/users/register', data);
    toast.success("Registration successful");
    return redirect('/login');
  } catch (error) {
    //console.log(error);
    toast.error(error?.response?.data?.message);
    return error;
  }
}

//default values removed: *defaultValue="Steve", they are only for dev

const Register = () => {
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow
          type="text"
          name="name"
          labelText="name"
        />
        <FormRow
          type="text"
          name="lastName"
          labelText="last name"
        />
        <FormRow
          type="text"
          name="location"
          labelText="location"
        />
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
        <SubmitBtn  />
        <p>
          Already a total member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Register;
