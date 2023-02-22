import express  from "express";

import  { home, interests } from "../controllers/HomeController.js";

const homeRoute = express.Router();

homeRoute.get('/', home );
homeRoute.get('/interests', interests );

export default homeRoute;