import { Schema, Types, model } from "mongoose";

// post schema
const postSchema = new Schema({
    title: { type: String, require: true },
    content: { type: String, require: true },
    userID: { type: Types.ObjectId, ref: "User" }
}, { timestamps: true });

// model
export const Post = model("Post", postSchema)