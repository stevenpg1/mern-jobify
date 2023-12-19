import React from 'react'
import { Form, useSubmit, Link } from 'react-router-dom';

import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useAllJobsContext } from '../pages/AllJobs';
import { JOB_TYPE, JOB_STATUS, JOB_SORT_BY } from '../../../utils/constants';
import { FormRow, FormRowSelect, SubmitBtn} from '.';

const SearchContainer = () => {
  const { data, searchValues } = useAllJobsContext();
  const { search, jobStatus, jobType, sort } = searchValues;
  const submit = useSubmit();
  
  const debounce = (onChange) => {
    let timeout;
    return (e) => {
        const form = e.currentTarget.form;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          onChange(form);
        }, 2000);
    };
  };

  return (
    <Wrapper>
      <Form className='form'>
        <h5 className='form-title'>search form</h5>
        <div className="form-center">
          <FormRow type="search" name="search" defaultValue={search} onChange={debounce((form) => submit(form))}/>
          <FormRowSelect name="jobStatus" defaultValue={jobStatus} labelText="job status" list={['all', ...Object.values(JOB_STATUS)]} onChange={(e) => {
            submit(e.currentTarget.form);
          } }/>
          <FormRowSelect name="jobType" defaultValue={jobType} labelText="job type" list={['all', ...Object.values(JOB_TYPE)]} onChange={(e) => {
            submit(e.currentTarget.form);
          } }/>
          <FormRowSelect name="sort" defaultValue={sort} labelText="sort" list={[...Object.values(JOB_SORT_BY)]} onChange={(e) => {
            submit(e.currentTarget.form);
          } }/>
          <Link to="/dashboard/all-jobs" className='btn form-btn delete-btn'>
            Reset Search Values
          </Link>
          {/* TEMP !!!! 
          <SubmitBtn formBtn />*/}
        </div>
      </Form>
    </Wrapper>
  )
}

export default SearchContainer