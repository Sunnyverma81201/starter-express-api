import mongoose from "mongoose";
import  dotenv from 'dotenv';
dotenv.config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcxm6.mongodb.net/Dev-Connect`);

export default mongoose;