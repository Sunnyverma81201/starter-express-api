// import mongoose from "mongoose";
import mongoose from "../database/MongoConnect.js";

const File = mongoose.model('File', new mongoose.Schema(
    { 
        name: { type: String, required: true },
        path: { type: String, required: true }
    },
    { timestamps: true }
),"files");

export default File;