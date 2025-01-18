import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';

export const register = async(req ,res) =>{

const {name,email,password} = req.body;

if(!name || !email || !password){
    return res.json({success:false, message:'Missing Details'}) //user not created
}

try{


    //check existing email id

const existingUser = await userModel.findOne({email})

if(existingUser){
    return res.json({success:false, message:"User already exists "})
    //success:false user does not create. user already exists
}



    const hashedPassword = await bcrypt.hash(password,10) 
    const user = new userModel({name,email,password:hashedPassword});
    //save the password in database
    await user.save();
    // new user created store in db

  // send token using the cookies

  // generate token


  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

  res.cookie('token',token,{
    httpOnly:true,
    
  }) // name & value





}catch(error){
res.json({success:false, message:error.message})

}



}