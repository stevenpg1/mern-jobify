import { Router } from 'express';
const router = Router();

import { registerUser, loginUser, logoutUser, getCurrentUser, getApplicationStats, getUser, editUser, deleteUser } from '../controllers/userController.js';
import { validateUserInput, validateUserLoginInput, validateEditUserInput, validateUserIdParam } from '../middleware/validationMiddleware.js';
import { authenticateUser, authorisePermissions, checkForTestUser } from '../middleware/authMiddleware.js';
import upload from '../middleware/fileHandlingMiddleware.js';

router.route('/register')
    .post(validateUserInput, registerUser);
router.route('/login')
    .post(validateUserLoginInput, loginUser);
router.route('/logout')
    .get(logoutUser);

router.route('/current-user')
    .get(authenticateUser, getCurrentUser);

router.route('/admin/app-stats')
    .get(authenticateUser, authorisePermissions('admin'), getApplicationStats);

router.route('/update-user')
    .patch(authenticateUser, checkForTestUser, upload.single('avatar'), validateEditUserInput, editUser)
    
router.route('/:id')
    .get(authenticateUser, validateUserIdParam, getUser)
    .delete(authenticateUser, checkForTestUser, validateUserIdParam, deleteUser);

export default router;