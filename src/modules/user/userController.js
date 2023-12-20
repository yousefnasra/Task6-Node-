import { User } from "../../../DB/models/userModel.js";
import { Post } from "../../../DB/models/postModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/tokenModel.js";

// signup
export const signup = async (req, res, next) => {
    // data
    const { userName, email, password, confirmPassword, age, gender, phone } = req.body;
    // check password
    if (confirmPassword !== password)
        return next(new Error("password must match!"));
    // check email
    const isUser = await User.findOne({ email });
    if (isUser)
        return next(new Error("email already exist!"));
    // hash password
    const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));
    // create user
    await User.create({ userName, email, password: hashPassword, age, gender, phone });
    // send response
    return res.json({ success: true, message: "user created successfully!" });
}

// login
export const login = async (req, res, next) => {
    // data
    const { email, password } = req.body;
    // check email
    const isUser = await User.findOne({ email });
    if (!isUser)
        return next(new Error("email is invalid!"));
    // check password
    const match = bcrypt.compareSync(password, isUser.password);
    if (!match)
        return next(new Error("password is invalid!"));
    // generate token
    const token = jwt.sign({ id: isUser._id, email: isUser.email }, process.env.TOKEN_SECRET);
    // Save token 
    await Token.create({ token, userID: isUser._id, agent: req.headers["User-agent"] });
    // send response
    return res.json({ success: true, token });
}

// logout
export const logout = async (req, res, next) => {
    // data
    const { token } = req.headers;
    // change isValid in token model
    await Token.findOneAndUpdate({ token }, { isValid: false });
    // send response
    return res.json({ success: true, message: "User logged out!" });
}

// update
export const updateUser = async (req, res, next) => {
    // data
    const userID = req.payload; //user id
    const { userName, age } = req.body;
    // update user
    const user = await User.findByIdAndUpdate(userID, { userName, age }, { new: true });
    // send response 
    return res.json({ success: true, message: 'user updated successfully!', results: { user } });
}

// delete
export const deleteUser = async (req, res, next) => {
    // data
    const userID = req.payload; //user id
    const { token } = req.headers;
    // delete user
    const user = await User.findByIdAndDelete(userID);
    // change isValid in token model
    await Token.findOneAndUpdate({ token }, { isValid: false });
    // send response 
    return res.json({ success: true, message: 'user deleted successfully!', results: { user } });
}

// filter
export const filter = async (req, res, next) => {
    // data
    const { letter, uAge } = req.query;
    // check user AND FILTER
    const user = await User.find({ userName: { $regex: "^" + letter }, age: { $lt: uAge } });
    if (!user)
        return next(new Error("no users found!"));
    // send response 
    return res.json({ success: true, message: 'user found successfully!', results: { user } });
}

// filter with age
export const filterByAge = async (req, res, next) => {
    // data
    const { fAge, lAge } = req.query;
    // check user AND FILTER
    const user = await User.find({ age: { $gte: fAge, $lte: lAge } });
    if (!user)
        return next(new Error("no users found!"));
    // send response 
    return res.json({ success: true, message: 'user found successfully!', results: { user } });
}

// get all users
export const getAllUsers = async (req, res, next) => {
    // check user 
    const user = await User.find({}, { _id: 0, password: 0 });
    if (!user)
        return next(new Error("no users found!"));
    // send response 
    return res.json({ success: true, message: 'user found successfully!', results: { user } });
}

// get user with his Posts
export const getUserWithPosts = async (req, res, next) => {
    // data
    const { id } = req.params;
    // check user 
    const user = await User.findById(id)
    if (!user)
        return next(new Error("no users found!"));
    // get his Posts
    const posts = await Post.find({ userID: id }).populate({
        path: "userID",
        select: " userName email -_id"
    });
    // send response 
    return res.json({ success: true, message: 'user profile found successfully!', results: { posts } });
}