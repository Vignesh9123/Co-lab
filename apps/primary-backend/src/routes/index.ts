import { Router } from "express";
import { roomRouter } from "./rooms.route";
import { userRouter } from "./user.route";

export const indexRouter = Router();

indexRouter.use('/user', userRouter);
indexRouter.use('/room', roomRouter);
