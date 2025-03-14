import InviteUser from "../models/InviteUser.js";
import Project from "../models/Project.js";
import Interest from "../models/Interest.js";
import User from "../models/User.js";
import File from "../models/File.js";
import path from "path";
import fs from "fs";
import { kmeans } from "./ML/K-means.js"
import { log } from "console";

export const dashboard = async (req,res) => {

    let data = await User.findById(req.body.id,"-password").populate("img")
    res.send(data)
}

export const updateProfile = async (req,res) => {

    await User.updateOne(
        { _id: req.body.id },
        {  first_name: req.body.first_name, last_name: req.body.last_name, location: req.body.location }
    );
    let data = await User.findById(req.body.id).exec();
    res.send(data);
}

export const changePassword = async (req,res) => {
    let data = await User.updateOne(
        { _id:req.body.id, password: crypto.createHash('sha256').update(`Dev-Connect-${password}`).digest('hex') }, 
        { password: crypto.createHash('sha256').update(`Dev-Connect-${newPassword}`).digest('hex') }
    );

    if(data.matchedCount != 1)
        res.status(450);
    res.send();
}

export const projects = async (req,res) => {

    let page = req.params?.page || 1


    // let det = await User.findById(req.body.id).populate("interests");

    // if(det.interests.tech){

    // }

    let data = await Project.find().where('owner').ne(req.body.id).where('users').ne(req.body.id).sort([['createdAt', -1]]).skip((page-1)*10).limit(10).populate(['tech','users','owner']);
    //     let data = await Project.find().where('owner').ne(req.body.id).where('users').ne(req.body.id).sort([['createdAt', -1]]).skip((page-1)*10).limit(10).populate("owner").populate('interests').catch(err => {
    //     res.send(err)
    //     console.log(err);
    //     return
    // });
    res.send(data)

}

export const getTech = async (req,res) => {

    if(!req.body.des){
        res.send([])
        return;
    }
    let data = await Project.find({tech: { $regex: `.*${req.body.des}*.` } },"tech").distinct("tech");
    res.send(data)
}

export const createProject = async(req,res) => {
    await Project.create({
      name: req.body.name,
      tech: req.body.tech,
      owner: req.body.id,
      duration: req.body.duration  
    }).then( data => {
        res.send(data);
    }).catch( err => {
        res.status(500).send();
    });
    
}

export const getCreatedPrjects = async(req,res) => {
    let data = await Project.find({owner: req.body.id }).populate(['tech','users','owner']);
    res.send(data)
}

export const deleteProject = async (req,res) => {

    let data = await Project.findOneAndRemove({ _id: req.body.projectId, owner: req.body.id });
    if(data == null)
        res.status(450);
    res.send(data);
}

export const updateProject = async (req,res) => {
    let data = await Project.updateOne({ _id: req.body.projectId, owner: req.body.id }, { name: req.body.name, tech: req.body.tech, duration: req.body.duration });
    if(data.matchedCount != 1)
        res.status(450);
    res.send();
}

export const projectInvite = async (req,res) => {
    let user = await User.findById(req.body.userId).exec();
    let project = await Project.findById(req.body.projectId).exec();

    if(user == null || project == null){
        res.status(450).send();
        return;
    }

    await InviteUser.create({ user: req.body.userId, project: req.body.projectId })
    .then( data => res.send() )
    .catch( err => res.status(455).send());
}

export const acceptProjectInvite = async (req,res) => {
    let data = await InviteUser.findOne({user: req.body.userId, project: req.body.projectId});

    if(data == null)
        res.status(450);
    else{
        await Project.findByIdAndUpdate(data.project, { $push: { users: req.body.userId }  });
        await User.findByIdAndUpdate(req.body.userId, { $push: { projects: data.project }  });
    }

    await InviteUser.deleteOne({user: req.body.userId, project: req.body.projectId});
    res.send();
}

export const showProjectInvites = async (req,res) => {
    let data = await InviteUser.find({ project: req.body.projectId }).populate('user').exec();
    console.log(data);
    let data1 = await User.find().where('_id').in(data.map(item => item.user.id)).populate(['interest','projects'])
    res.send(data1);
}

export const getUserInterests = async (req,res) => {
    let data = await User.findById(req.body.id,"interest").populate('interest').exec();
    
    let data1 = await Project.find().where('_id').in(data.interest.map(item => item.id)).populate(['tech','owner']);
    
    res.send(data1);
}

export const fileUpload = async (req,res) => {

    switch(req.params.type){
        case "profile" :
            profilePhotoUpload(req,res)
            break;

        case "file":
            break;

        default:
            fs.unlink(path.resolve('public','storage','users',req.body.id,req.body.file.name))
            res.status(404).send()
    }
}

const profilePhotoUpload = async (req,res) => {

    let file = await File.create(req.body.file);
    let data = await User.findById(req.body.id).populate("img");

    if(data?.img !== null){
        try {
            fs.unlink(path.resolve('public','storage','users',String(data._id),data.img.name),() => {  });
        }
        catch(err ){

        }
        await File.findByIdAndRemove(data.img._id);
    }
    data.img = file._id;
    await data.save();

    res.send({file: data.img});
}

export const updateInterest = async (req, res) => {
    
    await User.findByIdAndUpdate(req.body.id, { $addToSet: { interest: req.body.project }  },{upsert: true, new: true} );

    req.body.tech.forEach((item) => {
        showInterest(req.body.id,item);
    });
 
    res.send();
}   

const showInterest = async (user,tech) => {

    let usr = await User.findById(user);
    let temp = usr.tech.find((item) => { if(item.name == tech.name) { item.score++; return true }  })

    if(!temp) usr.tech.push({name: tech.name, score: 1});
  
    await usr.save();

}

export const addInterest = async (req,res) => {
    req.body.tech.forEach((item) => {
        showInterest(req.body.id,item);
    });
    res.send();
}

const noInterest = async (user,tech) => {
    // let interest = await Interest.findOne({ name: tech, user: user, project: project });

    // if(interest){
    //     interest.score =  (interest.score == 0) ? interest.score-1 : 0;
    //     await interest.save();
    // }
    // else{
    //     await Interest.create({ name: tech, user: user, project: project, score: 0 });
    // }
}

export const getUser = async (req,res) => {

    const user = await User.findById(req.body.id,"-password").populate('img').exec()
    console.log(user)
    res.send(user)
}

export const recommandUser = async (req,res) => {

    const shuffle = (max) =>  {
        return Math.floor(Math.random() * max);
    }
    
    const intersts = await Interest.find();
    const users = await User.findById(req.body.id).populate("interest");
    let usr = await User.find();

    let i = 1, j = 0
    const interestIds = intersts.map(item => { return { id: i++, slug: item.slug } })
    i = 1
    let userIds = []
    let newUsr = []
    users.interest.forEach(async ele => {
        let u = await User.findById(ele.owner).exec()
        userIds.push({ id: i++, _id: u.email })
        newUsr.push({ id: i++, _id: usr[shuffle(usr.length)].email })
    })

    const projects = await Project.find().populate("tech").populate("owner");
    const dataItems = []
    i = 0

    projects.forEach(ele => {
        ele.tech.map(ele1 => {
            let sids = interestIds.filter(item => ele1.slug == item.slug)
            let uids = userIds.filter(item => ele.owner.email == item._id)
            dataItems.push([sids[0].id,uids[0].id])
            if(newUsr[i]?.id)  dataItems.push([sids[0].id,newUsr[i++].id])
        })
    })

    const clusterCount = Math.floor((projects.length)/5);
    let km = kmeans(dataItems,clusterCount)

    let findUsers = []
    let findSkills = []
    km.mean.forEach(item => {

        let tempData1 = interestIds.filter(item1 => Math.round(item[0]) == item1.id)
        !findSkills.includes(tempData1[0].slug) ? findSkills.push(tempData1[0].slug) : console.log("skill exists");

        let tempData2 = userIds.filter(item1 => Math.round(item[1]) == item1.id)
        tempData2.push(...newUsr.filter(item1 => Math.round(item[1]) == item1.id))

        !findUsers.includes(tempData2[0]._id) ? findUsers.push(tempData2[0]._id) : console.log("user exists");
        !findUsers.includes(tempData2[0]._id) ? findUsers.push(tempData2[0]._id) : console.log("user exists");
    })


    let final = []

    projects.forEach(item => {

        let temp = item.tech.filter(ele =>  { return  findSkills.includes(ele.slug)})
        if(findUsers.includes(item.owner.email) && temp.length > 0){
            final.push(item)
        }
    })

    res.send(final)
}