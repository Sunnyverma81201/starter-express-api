// import mongoose from "mongoose";
import mongoose from "../database/MongoConnect.js";

const Project = mongoose.model('Project', new mongoose.Schema(
    { 
        name: { type: String, required: true }, 
        tech: { type: Array, default: [] },
        owner: { type:mongoose.Schema.Types.ObjectId, ref:'User' },
        users:[ { type:mongoose.Schema.Types.ObjectId, ref:'User' } ],
        duration: 'string',
        info: 'string'
    },
    { timestamps: true }
),"projects");

export default Project;