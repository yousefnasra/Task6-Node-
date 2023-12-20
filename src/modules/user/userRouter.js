import { Router } from "express";
import * as userController from "./userController.js"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = Router();

// signup
router.post('/signup', asyncHandler(userController.signup));

// login
router.post('/login', asyncHandler(userController.login));

// logout
router.post('/logout', isAuthenticated, asyncHandler(userController.logout));

// update
router.put('/:id', isAuthenticated, asyncHandler(userController.updateUser));

// delete
router.delete('/:id', isAuthenticated, asyncHandler(userController.deleteUser));

// filter
router.get('/search', asyncHandler(userController.filter));

// filter with age
router.get('/search/age', asyncHandler(userController.filterByAge));

// get all users
router.get('/', asyncHandler(userController.getAllUsers));

// get user with his posts
router.get('/posts/:id', asyncHandler(userController.getUserWithPosts));

export default router;