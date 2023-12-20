import { Schema, model } from "mongoose";

// user schema
const userSchema = new Schema({
    userName: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    age: { type: Number, min: 16, max: 90, require: true },
    gender: { type: String, require: true },
    phone: { type: String, require: true }
}, { timestamps: true });

// model
export const User = model("User", userSchema);