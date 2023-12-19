import React from "react";
import { useOutletContext, Form } from 'react-router-dom';
import { toast } from 'react-toastify';

import Wrapper from '../assets/wrappers/DashboardFormPage';
import customFetch from '../utils/customFetch';
import { FormRow, SubmitBtn } from '../components';

export const action = async ({request}) => {
  const formData = await request.formData();

  const file = formData.get('avatar');
  if (file && file.size > 500000) {
    toast.error('Image size must be < 0.5MB');
    return null;
  }

  try {
    await customFetch.patch('/users/update-user', formData);
    toast.success('Profile updated.');
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return null;
};

const Profile = () => {
  const { user } = useOutletContext();
  const { name, lastName, email, location } = user;

  return <Wrapper>
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title">profile</h4>
        <div className="form-center">
          <div className="form-row">
            {/* file input */}
            <label htmlFor="avatar" className="form-label">
              Select an image file (max 0.5MB)
            </label>
            <input type="file" id="avatar" name="avatar" className="form-input" accept="image/*" />
          </div>
          <FormRow type="text" name="name" defaultValue={name} />
          <FormRow type="text" name="lastName" labelText="last name" defaultValue={lastName} />
          <FormRow type="email" name="email" defaultValue={email} />
          <FormRow type="text" name="location" defaultValue={location} />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
};

export default Profile;
