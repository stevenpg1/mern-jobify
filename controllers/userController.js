import { StatusCodes } from 'http-status-codes';
import cloudinary from 'cloudinary';
import {promises as fs} from 'fs';

import User from '../models/userModel.js';
import Job from '../models/jobModel.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';

export const registerUser = async (req, res, next) => {
    const isFirstAccount = await User.countDocuments() === 0;
    req.body.role = isFirstAccount ? 'admin' : 'user';

    req.body.password = await hashPassword(req.body.password);

    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({message: 'user created'});
};

export const loginUser = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) throw new UnauthenticatedError('invalid credentials');

    const isPasswordCorrect = await comparePassword(req.body.password, user.password); //user.password comes from the db and will therefore be the hashed one
    if (!isPasswordCorrect) throw new UnauthenticatedError('invalid credentials');

    const token = createJWT({userId: user._id, role: user.role});
    const oneDay = 1000 * 60*60*24;
    //not going to send back token like this:- //res.json({ token });
    //set up cookie with token to send back to front end
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(StatusCodes.OK).json({ message: 'user logged in'});
};

export const logoutUser = async (req, res, next) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ message: 'user logged out'});
};

export const getCurrentUser = async (req, res, next) => {
    let user = await User.findOne({ _id: req.user.userId});
    res.status(StatusCodes.OK).json({user});
};

export const getApplicationStats = async (req, res, next) => {
    //fka getAllUsers
    
    const users = await User.countDocuments();         //.find({});
    const jobs = await Job.countDocuments();
    res.status(StatusCodes.OK).json({users, jobs});
};

export const editUser = async (req, res, next) => {
    //the id will not come from the param id but from req.user.userId which it gets from the auth-middleware
    //also admin should not be able to edit any other user's details except their own

    //remove password to ensure that it won't be modified
    const newUser = {...req.body};
    delete newUser.password;

    if(req.file) {
        const response = await cloudinary.v2.uploader.upload(req.file.path);
        await fs.unlink(req.file.path); //remove the file from our file system
        newUser.avatar = response.secure_url;
        newUser.avatarPublicId = response.public_id;
    }

    const existingUser = await User.findByIdAndUpdate(req.user.userId, newUser);
    //check if old images exist on cloudinary
    if(req.file && existingUser.avatarPublicId) {
        await cloudinary.v2.uploader.destroy(existingUser.avatarPublicId);
    }
    
    res.status(StatusCodes.OK).json({message: 'user modified'});
};

export const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(StatusCodes.OK).json({user});
};

export const deleteUser = async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({message: 'user deleted', user});
};