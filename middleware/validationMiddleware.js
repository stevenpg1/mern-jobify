import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/customErrors.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import Job from '../models/jobModel.js';
import User from '../models/userModel.js';

//this function pretty much won't change. ie presenting the error to the ui
const withValidationErrors = (validateValues) => {
    return [ 
        validateValues, 
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.msg);
                if (errorMessages[0].startsWith('no job')) {
                    throw new NotFoundError(errorMessages);    
                }
                if (errorMessages[0].startsWith('not authorised')) {
                    throw new UnauthorizedError(errorMessages);    
                }
                throw new BadRequestError(errorMessages);
            }
            next();
        }
    ];
};

//whereas there will be a specific validation for every controller like the one immediately below
//TEMPLATE ONE AS EXAMPLE
export const validateREPLACEWITHMODELNAME = withValidationErrors([
    body('PROPERTYNAMEHERE')
        .notEmpty()
        .withMessage('PROPERTY is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('PROPERTY must be at least 3, but no more than 50')
        .trim()
]);

//THE ONES FOR THIS APP
export const validateJobInput = withValidationErrors([
    body('company').notEmpty().withMessage('company is required').trim(),
    body('position').notEmpty().withMessage('position is required').trim(),
    body('jobLocation').notEmpty().withMessage('job location is required').trim(),
    body('jobStatus').isIn(Object.values(JOB_STATUS)).withMessage('invalid job status provided').trim(),
    body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('invalid job type provided').trim(),
]);

export const validateJobIdParam = withValidationErrors([
    param('id')
        .custom(async (value, {req}) => {
            const isValidId = mongoose.Types.ObjectId.isValid(value);
            if (!isValidId) throw new BadRequestError('invalid MongDB id');
            const job = await Job.findById(value);
            if (!job) throw new NotFoundError(`no job with id ${value}`);
            const isAdmin = req.user.role === 'admin';
            const isOwner = req.user.userId === job.createdBy.toString();
            if (!isAdmin && !isOwner) throw new UnauthorizedError('not authorised to access this route');
        })
]);

export const validateUserInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required').trim(),
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email format').custom(async (email) => {
        const user = await User.findOne({email});
        if (user) throw new BadRequestError(`${email} already exists`);
    }).trim(),
    body('password').notEmpty().withMessage('password is required').isLength({min:8}).withMessage('password must be at least 8 characters long').trim(),
    body('lastName').notEmpty().withMessage('last name is required').trim(),
    body('location').notEmpty().withMessage('location is required').trim()//,
    //body('role').notEmpty().withMessage('role is required').trim(),
]);

export const validateUserLoginInput = withValidationErrors([
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email format').trim(),
    body('password').notEmpty().withMessage('password is required').trim(),
]);

export const validateEditUserInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required').trim(),
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email format').custom(async (email, {req }) => {
        const user = await User.findOne({email});
        if (user && user._id.toString() !== req.user.userId) throw new BadRequestError(`${email} already exists`);
    }).trim(),
    body('lastName').notEmpty().withMessage('last name is required').trim(),
    body('location').notEmpty().withMessage('location is required').trim(),
]);

export const validateUserIdParam = withValidationErrors([
    param('id')
        .custom(async (value) => {
            const isValidId = mongoose.Types.ObjectId.isValid(value);
            if (!isValidId) throw new BadRequestError('invalid MongDB id');
            const user = await User.findById(value);
    
            if (!user) throw new NotFoundError(`no user with id ${value}`);
        })
]);



