import React from "react";
import { useLoaderData } from 'react-router-dom';

import { ChartsContainer, StatsContainer } from '../components';
import customFetch from '../utils/customFetch';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/jobs/stats');
    return data;
  } catch (error) {
    return error;
  }
}

const Stats = () => {
  const { defaultStats, monthlyApplications} = useLoaderData();
  return <>
    <StatsContainer defaultStats={defaultStats} />
    {
      monthlyApplications && monthlyApplications.length > 0 &&
      <ChartsContainer data={monthlyApplications} />
    }
  </>;
};

export default Stats;
