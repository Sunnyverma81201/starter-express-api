// import mongoose from "mongoose";
import mongoose from "../database/MongoConnect.js";
import slug from "slug";

const Interest = mongoose.model('Interest', new mongoose.Schema(
    { 
        name: { type: String, required: true }, 
        slug: { type: String, required: true }, 
    },
),"interests");

const intrests = [ "Angular", "Node JS", "Express JS","MongoDB" ];

intrests.forEach(async item => {
    await Interest.findOneAndUpdate({ name: item  }, { slug: slug(item) }, {  new: true,upsert: true })
})

export default Interest;