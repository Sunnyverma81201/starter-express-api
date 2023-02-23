import Interest from "../models/Interest.js"
import Project from "../models/Project.js"
import User from "../models/User.js"
import { kmeans } from "./ML/K-means.js"

export const home = async (req,res) => {
    let data = await User.find({})
    res.send(data)
}

export const interests = async (req,res) => {
    let data = await Interest.find()
    res.send(data)
}