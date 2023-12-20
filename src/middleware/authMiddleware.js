import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../../DB/models/userModel.js";
import jwt from "jsonwebtoken";
import { Token } from "../../DB/models/tokenModel.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    let { token } = req.headers; //user id
    // check token existence
    if (!token) return next(new Error("Token missing!"), { cause: 400 });
    // check prefix
    if (!token.startsWith(process.env.BEARER_KEY))
        return next(new Error("Invalid token!"), { cause: 401 });
    token = token.split(process.env.BEARER_KEY)[1];
    // check token if it valid
    const tokenDB = Token.findOne({ token, isValid: true });
    if (!tokenDB)
        return next(new Error("Token expired!"), { cause: 401 });
    // verify token
    const payload = jwt.verify(token, process.env.TOKEN_SECRET); // {id: ,email: }
    // check user
    const isUser = await User.findById(payload.id);
    if (!isUser)
        return next(new Error("user not found!"), { cause: 404 });
    // pass user to next controller
    req.payload = payload.id;
    // call next controller
    return next();
});