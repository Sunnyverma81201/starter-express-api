// import mongoose from "mongoose";
import mongoose from "../database/MongoConnect.js";
import crypto from "crypto";

const User = mongoose.model('User', new mongoose.Schema(
    { 
        first_name: { type: String, required: true }, 
        last_name: { type: String, required: true }, 
        email: { type: String, required:true, unique: true }, 
        password: { type: String, required: true },
        img: { type:mongoose.Schema.Types.ObjectId, ref:'File', default: null},
        projects:[ { type:mongoose.Schema.Types.ObjectId, ref:'Project'  } ],
        interests: [ { type:mongoose.Schema.Types.ObjectId, ref:'Project' } ],
        tech: [ { name:String , score:Number } ],
        location: 'string'
    },
    { timestamps: true }
),"users");

let u = await User.findOne({  email: 'admin@gmail.com' });
if(!u)
await User.create({ first_name: 'admin', last_name:"user", email: 'admin@gmail.com', password:crypto.createHash('sha256').update(`Dev-Connect-admin`).digest('hex') });

export default User;