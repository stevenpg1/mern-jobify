import React from "react";
import { useLoaderData, redirect } from 'react-router-dom';
import { FaSuitcaseRolling, FaCalendarCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/StatsContainer';
import { StatItem } from "../components";

export const loader = async () => {
  try {
    const {data} = await customFetch.get('/users/admin/app-stats');
    //toast.success("Admin stats retrieved");
    return data;
  } catch (error) {
    //toast.error(error?.response?.data?.message);
    toast.error('You must be an admin user to view this page.');
    return redirect('/dashboard');
  }
};

const Admin = () => {
  const { users, jobs } = useLoaderData();

  return <Wrapper>
      <StatItem title='current users' count={users} color='#e9b949' bcg='#fcefc7' icon={<FaSuitcaseRolling/>} />
      <StatItem title='total jobs' count={jobs} color='#647acb' bcg='#e0e8f9' icon={<FaCalendarCheck/>} />
    </Wrapper>;
};

export default Admin;
