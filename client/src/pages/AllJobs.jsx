import React, { createContext, useContext } from "react";
import { useLoaderData } from "react-router-dom";
import { toast } from 'react-toastify';

import customFetch from "../utils/customFetch";
import { JobsContainer, SearchContainer } from '../components';

export const loader = async ({request}) => {
  //console.log(request.url);
  //from object creates an object and turns the params into that objects properties
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  //console.log(params);
  try {
    const { data } = await customFetch.get('/jobs', {
      params
    });
    return {
      data, searchValues:{...params}
    };
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

const AllJobsContext = createContext();
const AllJobs = () => {
  const { data, searchValues } = useLoaderData();
  console.log(data);
  return <AllJobsContext.Provider value={{data, searchValues}}>
    <SearchContainer />
    <JobsContainer />
  </AllJobsContext.Provider>
};


export const useAllJobsContext = () => useContext(AllJobsContext);
export default AllJobs;
