// import mongoose from "mongoose";
import mongoose from "../database/MongoConnect.js";
import slug from "slug";

const Interest = mongoose.model('Interest', new mongoose.Schema(
    { 
        name: { type: String, required: true }, 
        slug: { type: String, required: true }, 
    },
),"interests");

const intrests = ["javascript", "python", "ruby", "java", "html", "css", "php", "shell", "simple", "library", "objective-c", "android", "go", "files", "framework", "c++", "swift", "c", "build", "react", "server", "client", "c#", "google", "example", "docker", "image", "angular", "rails", "website", "system", "awesome", "collection", "browser", "theme", "scala", "open-source", "tools", "typescript", "design", "extension", "component", "clojure", "development", "coffeescript", "jquery", "language", "graph", "search", "django", "programming", "bootstrap", "generator", "configuration", "network", "elixir", "viml", "manager", "testing", "cloud" ];

intrests.forEach(async item => {
    await Interest.findOneAndUpdate({ name: item  }, { slug: slug(item) }, {  new: true,upsert: true })
})

export default Interest;