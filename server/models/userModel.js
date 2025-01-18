import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

name:{type:String, required:true},
email:{type:String, required:true, unique:true},
password:{type:String, required:true},
verifyOtp:{type:String, default:''},
verifyOtpExpireAt:{type:Number,default:0},
isAccountVerified:{type:Boolean, default:false},
 // bydefault unverified, verified = true

 resetOtp:{type:String, default:''},
 resetOtpExpireAt:{type:Number, default:0},
})



const userModel = mongoose.models.user || mongoose.model('user',userSchema) //user = model name, 


export default userModel;