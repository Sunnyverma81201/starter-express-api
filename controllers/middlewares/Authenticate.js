import express from 'express';
import jwt from "jsonwebtoken";

const app = express()

 const authenticateJWT = app.use((req, res, next) => {
    const headers = req.headers;
    const TOKEN = process.env.ACCESS_TOKEN || "access_token";
    if(headers?.auth){
      try{
        let jtwToken = jwt.verify(headers.auth, TOKEN)
        req.body.id = jtwToken.id
        next()
        return;
      }
      catch(e){
//        res.status(419).send(e)
//        return;
      }
    }
    res.status(419)
    res.send({message: "Authentication Failed"})
  
})

export default authenticateJWT;