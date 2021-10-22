import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const userSchema = mongoose.Schema ({

 name: {
     type:String,
     required:true
 },

 email: {
     type:String,
     required:true
 },


 phone: {
    type:Number,
    required:true
},


work: {
    type:String,
    required:true
},


password: {
    type:String,
    required:true,
    
    
},

cpassword: {
    type:String,
    required:true
    
 
},

tokens : [

{
    token: {
       type: String,
        required:true
    }
}


]
    



})




//we are hashing the password

userSchema.pre('save', async function (next){
    console.log("hello");
  if(this.isModified('password')){
      this.password = await bcrypt.hash(this.password,12)
      this.cpassword = await bcrypt.hash(this.cpassword,12)
  }
next();

})


//generating token

userSchema.methods.generateAuthToken = async function(){

    try{
  const  token = jwt.sign({_id:this._id}, process.env.SECRET_KEY,{});
   this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;
    } catch(err){
        console.log(err);
    }

}




export default mongoose.model('User',userSchema)
//const User = mongoose.model('USER', userSchema);
//module.exports = User;

