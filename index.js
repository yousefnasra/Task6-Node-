import express, { json } from "express";
import { connectDB } from "./DB/connection.js";
import userRouter from "./src/modules/user/userRouter.js";
import postRouter from "./src/modules/post/postRouter.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT;

// middleware
app.use(express.json());
// DB connection
await connectDB();

// APIs
// user
app.use('/user', userRouter);
// post
app.use('/post', postRouter)
// all methods
app.all('*', (req, res) => {
    return res.json({ success: false, message: "Page not found!" })
})
// global error handler 
app.use((error, req, res, next) => {
    const statusCode = error.cause || 500;
    return res.status(statusCode).json({
        success: false,
        message: error.message,
        stack: error.stack
    });
})


app.listen(port, () => console.log("server is running on port:", port));
