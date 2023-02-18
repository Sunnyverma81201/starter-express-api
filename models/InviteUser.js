// import mongoose from "mongoose";
import mongoose from "../database/MongoConnect.js";

const InviteUser = mongoose.model('InviteUser', new mongoose.Schema(
    { 
        project: { type:mongoose.Schema.Types.ObjectId, ref:'Project' },
        user: { type:mongoose.Schema.Types.ObjectId, ref:'User' }
    },
    { timestamps: true }
),"invite_users");


export default InviteUser;