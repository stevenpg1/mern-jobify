import React from "react";
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import customFetch from '../utils/customFetch';

export const action = async ({params}) => {
  
  try {
    await customFetch.delete(`/jobs/${params.id}`);
    toast.success("Job deleted");
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return redirect('/dashboard/all-jobs');
};