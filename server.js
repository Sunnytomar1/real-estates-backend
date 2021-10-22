import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
//import cors from "cors"

import jwt from "jsonwebtoken"
import User from './dbModel.js';
import authenticate from './authenticate.js'

//app config
const app=express();
const port=  9000;




//middlewares
app.use(express.json());


app.use((req,res,next) => {
   req.requestTime = new Date().toISOString();
   res.setHeader('Access-Control-Allow-Origin','*'),
   res.setHeader('Access-Control-Allow-Headers','*'),
   console.log(req.headers);
   next();
});








//DBconfig

dotenv.config({path: './config.env'});


const DB=process.env.DATABASE;
mongoose.connect(DB,{
   useNewUrlParser:true,
  useUnifiedTopology: true
   
}).then(() =>{
       console.log(`connection successful`);
}).catch((err) => console.log(`no connection`));



//apiendpoint
//app.get('/', (req,res) => res.status(200).send("hello world"));

//app.post('/register', (req,res) => {
 
// console.log(req.body);
// res.json({message:req.body});
 //res.send("register page");
//})


app.post('/register', (req,res) => {
  console.log(req.body.name);
  //console.log(req.body.email);
  //console.log(req.body.phone);
  //now using modern es6 syntax we do above things using destructuring

  console.log(req.body);
  //res.json({message:req.body});
  const{name,email,phone,work,password,cpassword}= req.body;

    if(!name || !email || !phone || !work || !password || !cpassword){
       return res.json({message:"pls fill field properly"})  //res.status(422).json({error:"pls fill field properly"})
    } 

    User.findOne({email:email})
    .then((userExist)=>{
       if(userExist){

         return res.json({message:"Email already exists"}); //res.status(422).json({message:"Email already exists"})
       }

       

       
       //registering new user
       const user= new User({name,email,work,phone,password,cpassword});
//here comes code to hash password before saving to database




//const token = jwt.sign({_id: User._id}, process.env.SECRET_KEY, {

//   expiresIn: process.env.JWT_EXPIRES_IN
//});



//const token =  user.generateAuthToken();
//console.log(token);

//res.status(201).json({
 //  status:'success',
//   token,
//   data:{
 //     User:user
 //  }
//})


       user.save().then(()=>{
          res.json({message:"user registered successfully",user:user})  //  res.status(201).json({message:"user registered successfully"})
       }).catch((err)=> res.json({message:"failed to registerd"}));   //res.status(500).json({error:"failed to registerd"}));
     
    }).catch(err => {console.log(err)});


  //const { name,email,phone,work,password,cpassword} = req.body;

  //const user = new User({
  // name,email,phone,work,password,cpassword
  //})

  //user.save(err => {
   //  if(err){
   //     res.send(err)
   //  } else{
    //    res.send({message:"successful" })
    // }

  //})

  //if(!name || !email || !phone || !work || !password || !cpassword) {
  //   return res.status(422).json({err:"pls fill the field properly"});
  //}

  
  //try{
  //const userExist = await User.findOne({email:email});
  
  //if(userExist){
  //   return res.status(422).json({error:"email already exists"});
  //} else if(password != cpassword){
  //   return res.status(422).json({error:"password are not matching"});
 // } else{

//registering new user
//const user = new User({name,email,phone,work,password,cpassword});
//here comes code to hash password before saving to database

// await user.save();

// res.status(201).json({message:"user registered sucessfully"});


//  }

 
   
//  }catch(err) {
//     console.log(err);
//  }
           

   
          
         
});


//login route
app.post('/signIn', async (req,res) => {
  // console.log(req.body);
   //res.json({message:"this is working"});
 
try{
   //reading email and password from the body
      const {email,password} = req.body;
      if(!email || !password) {
         return res.status(400).json({error:"fill all credentaials"});
      }
  //reading database data
  const userLogin = await User.findOne({email:email});
  console.log(userLogin);

  if(userLogin){
//now checking the password hashed is present in database when user logs in
const isMatch= await bcrypt.compare(password, userLogin.password);

const token = await userLogin.generateAuthToken();
console.log(token);
//res.json({token})



//storing JWT token in cookie for authentication
res.cookie("jwtoken", token, {
   expires: new Date(Date.now() + 2589200000), 
   httpOnly: true 
});

 
if(!isMatch){
   res.json({message:"invalid email or password"})    //res.status(400).json({})   
} else {
   res.json({message:"user sign in successfully",userLogin:userLogin});
}
  } else{

     res.json({message:"Invalid credentials"});     //res.status(400).json({})
  }

  

}catch(err){
   console.log(err);
}


})


app.get('/about', (req,res) => {

   res.send(data);
})








app.get('/', authenticate , (req,res) => {
   res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 2589200000), 
      httpOnly: true 
   });
   res.send(req.rootUser);
})







app.get('/contact', (req,res) => {
   res.cookie("Test", 'react');
   res.json({message:"i am react"});
})


//listen

app.listen(port, () => console.log(`listening on local host:${port}`));