// import mongoose from "mongoose";
import mongoose from "../database/MongoConnect.js";

const ForgetPassword = mongoose.model('ForgetPassword', new mongoose.Schema(
    { 
        code: { type: String, required: true, unique: true }, 
        user: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
        
    },
    { timestamps: true }
),"forget_password");


export default ForgetPassword;