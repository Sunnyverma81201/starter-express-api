import express  from "express";
import { changePassword } from "../controllers/AuthController.js";
import fs from "fs";
import File from "../models/File.js";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";

import { acceptProjectInvite, createProject, dashboard, getCreatedPrjects ,deleteProject, fileUpload, getTech, projectInvite, projects, updateProfile, updateProject, updateInterest, addInterest, getUser, recommandUser } from "../controllers/UserController.js";

const userRoute = express.Router();

const validExts = { profile: [".jpeg",".jpg",".png",".svg"], file: [".zip",".rar",".pdf",".doc",".docx",".pptx",".xls",".odt",".jpeg",".jpg",".png",".svg"] }

// storage destination and file parameters
const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        const headers = req.headers;
        const TOKEN = process.env.ACCESS_TOKEN || "access_token";
        let jtwToken = jwt.verify(headers?.auth, TOKEN)
        req.body.id = jtwToken.id

        let dir = `./public/storage/users/${req.body.id}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir)
    },
    filename: async function (req, file, cb) {

        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileName = file.fieldname + '-' + uniqueSuffix+extension
        cb(null, fileName)
        let dir = `/storage/users/${req.body.id}`;
        req.body.file = {name: fileName, path: dir}
    }
})

// file filters, checks and initialization of upload middleware for DP
const filterFile = multer({ 
    storage: storage, 
    fileFilter:function(req,file,cb){
        //check file extension
        const extension = path.extname(file.originalname).toLowerCase()

        if ( validExts[req.params?.type].includes(extension))
            cb(null,true);
        else
            cb("Invalid file type",false)
    }
})

//paths

userRoute.post('/dashboard',  dashboard);
userRoute.post('/upload/:type', filterFile.single("userFiles"), fileUpload);
userRoute.post('/updateProfile',  updateProfile);
userRoute.post('/changePassword',  changePassword);
userRoute.post('/createProject',  createProject);
userRoute.post('/getTech',  getTech);
userRoute.get('/projects/:page',  projects);
userRoute.post('/updateInterest',  updateInterest);
userRoute.post('/getCreatedPrjects', getCreatedPrjects);
userRoute.post('/deleteProject',  deleteProject);
userRoute.post('/updateProject',  updateProject);
userRoute.post('/projectInvite',  projectInvite);
userRoute.post('/acceptProjectInvite', acceptProjectInvite);
userRoute.post('/showInterest', addInterest);
userRoute.get('/getUser', getUser);
userRoute.get('/recommandUser', recommandUser);

export default userRoute;