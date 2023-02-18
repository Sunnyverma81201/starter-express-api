import express  from "express";

import { changePassword, forgetPassword, login, register } from "../controllers/AuthController.js";

const authRoute = express.Router();

authRoute.post('/register',  register);
authRoute.post('/login',  login);
authRoute.post('/forgetPassword',forgetPassword);
authRoute.post('/changePassword/:code',changePassword);

export default authRoute;