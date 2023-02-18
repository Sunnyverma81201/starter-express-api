import jwt  from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import ForgetPassword from "../models/ForgetPassword.js";

export const login = async (req,res) => {

    let data = await User.findOne({
         email: req.body.email, password: crypto.createHash('sha256').update(`Dev-Connect-${req.body.password}`).digest('hex')
        });
    let tk = null;
    const TOKEN = process.env.ACCESS_TOKEN || "access_token";
    let USERDATA = null;

    if(data == null)
        res.status(419);
    else
        tk = jwt.sign(
            { id: data._id, email: data.email },
            TOKEN,
            { expiresIn: "2h" }
        );
    
    USERDATA = {
        first_name: data.first_name, 
        last_name: data.last_name, 
        email: data.email,
        token: tk,
        location: data.location,
        profile_img: data.img
    }
    res.send(USERDATA);
}

export const register = async (req,res) => {

    await User.create({ 
        first_name: req.body.first_name, 
        last_name:req.body.last_name, 
        email: req.body.email, 
        password:crypto.createHash('sha256').update(`Dev-Connect-${req.body.password}`).digest('hex') 
    }).then( data => {
        delete data.password;
        res.send(data);
    })
    .catch( err => {
        if(err.code == 11000)
            res.status(455);
        else
            res.status(500);
        res.send(err);
    })

}

export const forgetPassword = async (req,res) =>{

    let code = crypto.randomBytes(8).toString('hex');
    let user = await User.findOne({ email: req.body.email });
    if(user == null){
        res.status(450).send()
    }
    else{
        const pass = await ForgetPassword.findOne({ user: user._id });
        if(!pass)
            await ForgetPassword.create({ code: code, user: user._id}).then(a=> { res.send() }).catch( err => { res.status(500)} )
        else
            res.send()
    }
}

export const changePassword = async (req,res) => {

    let data = await ForgetPassword.findOne({ code: req.params.code }).populate("user","_id email");
    if(data == null || data?.user == null)
        res.status(450).send()

    else{
        await User.updateOne( { _id: data.user._id },{ password: req.body.password });
        await data.remove()
        res.send();
    }   
}

