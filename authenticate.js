import jwt from 'jsonwebtoken'
import User from './dbModel.js'
import mongoose from 'mongoose'

const authenticate = async (req,res,next) => {

    try{

       const token = req.cookies.jwtoken;
              const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
         const rootUser  = await User.findOne({_id:verifyToken._id, "tokens.token":token})

          if(!rootUser){throw new Error('User not found')}

         req.token = token;
          req.rootUser = rootUser;
          req.userId = rootUser._id;
//let token;
//if(req.headers.authorisation &&req.headers.authorisation.startsWith('Bearer')

//){
//    token=req.headers.authorisation.split(' ')[1]
//}
//console.log(token);

//if(!token){
  //  return res.status(401).json({message:"you are not logged in!pls log in"})
//}

//next get accessed by route we are protecting
          next();




    } catch(err){
        res.status(401).send('unauthorized:No token provided');
        console.log(err);
    }


}


export default authenticate;