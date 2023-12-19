import { Router } from 'express';
const router = Router();

import { getAllJobs, createJob, getJob, editJob, deleteJob, showStats } from '../controllers/jobController.js';
import { validateJobInput, validateJobIdParam } from '../middleware/validationMiddleware.js';
import { authenticateUser, checkForTestUser } from '../middleware/authMiddleware.js'; // you could then add it before each route below. For all routes add it to server.js instead.

router.route('/')
    .get(getAllJobs)
    .post(checkForTestUser, validateJobInput, createJob);

router.route('/stats').get(showStats);

router.route('/:id')
    .get(validateJobIdParam,getJob)
    .patch(checkForTestUser, validateJobInput, validateJobIdParam, editJob)
    .delete(checkForTestUser, validateJobIdParam,deleteJob);

// //ONE WAY OF DOING IT:
// // GET ALL JOBS
// router.get('/', getAllJobs);

// // CREATE A JOB 
// router.post('/', createJob)

// // GET A SINGLE JOB
// router.get('/:id', getJob)

// // EDIT A JOB
// router.patch('/:id', editJob);

// // DELETE A JOB
// router.delete('/:id', deleteJob);

export default router;