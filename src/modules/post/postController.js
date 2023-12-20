import { Post } from "../../../DB/models/postModel.js";

// create Post
export const createPost = async (req, res, next) => {
    // data
    const { title, content } = req.body;
    const userID = req.payload; //user id
    // create post
    await Post.create({ title, content, userID });
    // send response
    return res.status(201).json({ success: true, message: "post created successfully!" });
}

// delete
export const deletePost = async (req, res, next) => {
    // data
    const { id } = req.params; //post id
    const userID = req.payload; //user id
    // check post and owner
    const post = await Post.findOneAndDelete({ _id: id, userID });
    if (!post)
        return next(new Error("post not found or you are not the owner!"));
    // send response 
    return res.json({ success: true, message: 'post deleted successfully!', results: { post } });
}

// update
export const updatePost = async (req, res, next) => {
    // data
    const { id } = req.params; //post id
    const {content } = req.body; 
    const userID = req.payload; //user id
    // check post 
    const post = await Post.findById(id);
    if (!post)
        return next(new Error("post not found!"));
    // chech owner
    if (post.userID.toString() !== userID.toString())
        // 2 object ids
        return next(new Error("you are not the owner!"));
    // update post
    post.content = content;
    await post.save();
    // send response 
    return res.json({ success: true, message: 'post updated successfully!', results: { post } });
}

// get all Posts
export const getAllPosts = async (req, res, next) => {
    // get posts 
    const post = await Post.find({}, { _id: 0 });
    // send response 
    return res.json({ success: true, message: 'post found successfully!', results: { post } });
}

// get all Posts with owners
export const getAllPostsWithOwners = async (req, res, next) => {
    // get posts with owners
    const post = await Post.find().populate("userID");
    // send response 
    return res.json({ success: true, message: 'post found successfully!', results: { post } });
}

// sort all Posts
export const sort = async (req, res, next) => {
    // sort posts by date
    const post = await Post.find({}, { _id: 0 }).sort({ createdAt: -1 });
    // send response 
    return res.json({ success: true, message: 'post sorted successfully!', results: { post } });
}