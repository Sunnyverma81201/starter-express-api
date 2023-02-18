import express from 'express';
import mongoose from "../../database/MongoConnect.js";
import moment from 'moment/moment.js';

const RateLimit = mongoose.model('RateLimit', new mongoose.Schema(
    { 
        ip: { type: String, required: true, unique: true }, 
        attempts: { type: Number, required: true }, 
    },
    { timestamps: true }
),"rate_limit");


const app = express()

 const rateLimit = app.use(async (req, res, next) => {

    let rate = await RateLimit.findOne({ ip: req.ip })
    if(rate == null){
        rate = await RateLimit.create({ ip: req.ip, attempts: 1 })
        next()
        return
    }
    else if(moment(rate.updatedAt).subtract('30','minutes') > moment(rate.createdAt)){
        rate.attempts = 1
        await rate.save()
        next()
        return
    }
    else if(rate.attempts < 10){
        rate.attempts++
        await rate.save()
        next()
        return
    }
    res.status(403).send()
  
})

export default rateLimit;