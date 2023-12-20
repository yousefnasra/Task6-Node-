import { Router } from "express";
import * as postController from "./postController.js"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = Router();

// create Post
router.post('/', isAuthenticated, asyncHandler(postController.createPost));

// delete Post
router.delete('/:id', isAuthenticated, asyncHandler(postController.deletePost));

// update Post
router.patch('/:id', isAuthenticated, asyncHandler(postController.updatePost));

// get all Posts
router.get('/', asyncHandler(postController.getAllPosts));

// get all Posts with owners
router.get('/owner', asyncHandler(postController.getAllPostsWithOwners));

// sort all Posts
router.get('/sort', asyncHandler(postController.sort));

export default router;