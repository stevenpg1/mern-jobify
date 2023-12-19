import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import day from 'dayjs';

import Job from '../models/jobModel.js';

//All the validation and errorhandling are done in the custom middleware we have written
//The validation is applied in the router file

export const createJob = async (req, res, next) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({job});
};

export const getAllJobs = async (req, res, next) => {
  //console.log('user from request ', req.user);
  //console.log(req.query); //this is for query string parameters as opposed to dynamic elements of the url (for these use req.params - see editJob etc)
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    //queryObject.position = req.query.search; // or more simply = search (as we have destructured the req.query object above)
    queryObject.$or = [
      {position:{$regex:search, $options: 'i'}}, //'i' means ignore casing
      {company:{$regex:search, $options: 'i'}}, 
    ];
  }

  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }
  
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position'
  };  

  const sortKey = sortOptions[sort] || sortOptions.newest;

  //set up pagination includes numbers for skip and limit(take)  
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; //this expression is always true for any project on any page and can therefore be lifted as it.

  const jobs = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit); //uses skip and limit rather than skip and take

  const totalJobs = await Job.countDocuments(queryObject); //this is effected by search options but not by limit (for pagination)
  const numOfPages = Math.ceil(totalJobs / limit); //always round up //this expression is also always true for any project on any page and can therefore be lifted as it.

  res.status(StatusCodes.OK).json({totalJobs, numOfPages, currentPage:page, jobs});
};

export const getJob = async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  res.status(StatusCodes.OK).json({job});
};

export const editJob = async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }); 
  res.status(StatusCodes.OK).json({message: 'job modified', job});
};

export const deleteJob = async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({message: 'job deleted', job});
};

export const showStats = async (req, res, next) => {
  let stats = await Job.aggregate([
    {$match: {createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
    {$group: {_id: '$jobStatus', count: {$sum: 1}}},
  ]);
  //console.log(stats);
  //turn array into object using vanilla javascript reduce array mamnipulation method
  stats = stats.reduce((acc,curr) => { 
    const {_id:title,count} = curr;
    acc[title] = count;
    return acc;
  }, {});
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0
  };

  let monthlyApplications = await Job.aggregate([
    {$match: {createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
    {
      $group: {
        _id: {year:{$year:'$createdAt'}, month:{$month:'$createdAt'}}, 
        count: {$sum: 1}
      }
    },
    {$sort: {'_id.year': -1, '_id.month': -1}},
    {$limit: 6}
  ]);

  monthlyApplications = monthlyApplications.map((item) => {
    const {_id:{year, month}, count} = item; //extract the necessary variables from the item

    const date = day().month(month -1).year(year).format('MMM YY');

    return {date, count};
  }).reverse(); // reverse because the months above were put in latest first (descending) to limit to last 6 months, now we want months in correct ascending order

  // let monthlyApplications = [
  //   {
  //     date: 'Jul 23',
  //     count: 14
  //   },
  //   {
  //     date: 'Aug 23',
  //     count: 15
  //   },
  //   {
  //     date: 'Sep 23',
  //     count: 18
  //   },
  //   {
  //     date: 'Oct 23',
  //     count: 21
  //   },
  //   {
  //     date: 'Nov 23',
  //     count: 16
  //   },
  //   {
  //     date: 'Dec 23',
  //     count: 8
  //   },
  // ];
  res.status(StatusCodes.OK).json({defaultStats, monthlyApplications });
};

//--------------------------------------------------------------------------------------------------------------------------------------
///THIS IS THE CODE FROM INITIAL PHASE OF DEV WITH WORKINGS AND ALTERNATIVE WAYS NOT CHOSEN ETC
//--------------------------------------------------------------------------------------------------------------------------------------
// // import { nanoid } from 'nanoid';

// // let jobs = [
// //     { id: nanoid(), company: 'apple', position: 'front-end' },
// //     { id: nanoid(), company: 'google', position: 'back-end' }
// // ];

// export const createJob = async (req, res, next) => {
//   const {company, position} = req.body;

//   // if (!company || !position) {
//   //   return res.status(400).json({message: 'invalid data'});
//   // }

//   // const id = nanoid(10);
//   // const job = {id,company,position};
//   // jobs.push(job);

//   //don't need try catch blocks for async errors if you have imported 'express-async-errors' in server.js
//   //try {
//     //const job = await Job.create('something');
    
//     const job = await Job.create({
//       company, position
//     });

//     res.status(StatusCodes.CREATED).json({job});
//   // } catch (error) {
//   //   res.status(500).json({message: 'server error'});
//   // }
  
// };

// export const getAllJobs = async (req, res, next) => {
// const jobs = await Job.find({});
// res.status(StatusCodes.OK).json({jobs});
// };

// export const getJob = async (req, res, next) => {
//   const { id } = req.params;
//   const job = await Job.findById(id);
  
//   // if (!job) {
//   //   return res.status(404).json({message: `no job with id ${id}`});
//   // }
//   if (!job) throw new NotFoundError(`no job with id ${id}`);
  
//   res.status(StatusCodes.OK).json({job});
// };

// export const editJob = async (req, res, next) => {
//   const { id } = req.params;
//   //const job = jobs.find((job) => job.id === id);
//   const job = await Job.findByIdAndUpdate(id, req.body, {
//     new: true
//   }); //instead of req.body could use obj ie: {company, position}
  
//   // if (!job) {
//   //   return res.status(404).json({message: `no job with id ${id}`});
//   // }
//   if (!job) throw new NotFoundError(`no job with id ${id}`);

//   // const {company, position} = req.body;

//   // if (!company || !position) {
//   //   return res.status(400).json({message: 'invalid data'});
//   // }

//   // job.company = company;
//   // job.position = position;

//   //update the job details


//   res.status(StatusCodes.OK).json({message: 'job modified', job});
// };

// export const deleteJob = async (req, res, next) => {
//   const { id } = req.params;
//   const job = await Job.findByIdAndDelete(id);
  
//   // if (!job) {
//   //   return res.status(404).json({message: `no job with id ${id}`});
//   // }
//   if (!job) throw new NotFoundError(`no job with id ${id}`);

//   //jobs = jobs.filter((j) => j.id !== id);
  
//   res.status(StatusCodes.OK).json({message: 'job deleted', job});
// };
