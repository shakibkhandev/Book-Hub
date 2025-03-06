import express from "express";
import { SignInFunction, SignOutFunction, SignUpFunction } from "../../controllers/v1/authControllers";
import { upload } from "../../middlewares/multer.middlewares";

export const authRoutes = express.Router();


authRoutes.post("/sign-in", SignInFunction);
authRoutes.post("/sign-up", upload.single("avatar"), SignUpFunction);
authRoutes.post("/sign-out", SignOutFunction);

