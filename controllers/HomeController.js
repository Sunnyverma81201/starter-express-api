import Interest from "../models/Interest.js"
import User from "../models/User.js"

export const home = async (req,res) => {
    let data = await User.find({})
    res.send(data)
}

export const interests = async (req,res) => {
    let data = await Interest.find()
    res.send(data)
}