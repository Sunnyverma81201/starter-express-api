import express  from "express";

import  { home } from "../controllers/HomeController.js";

const homeRoute = express.Router();

homeRoute.get('/', home );

export default homeRoute;