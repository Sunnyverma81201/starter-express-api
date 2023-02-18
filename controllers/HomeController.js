import User from "../models/User.js"

export const home = async (req,res) => {
    let data = await User.find({})
    res.send(data)
}