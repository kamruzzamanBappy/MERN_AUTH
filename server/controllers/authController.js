import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

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

  // generate token for authentication


  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
// store id in this token,

  res.cookie('token',token,{
    httpOnly:true, // only http request can accept this cookies
    secure:process.env.NODE_ENV === 'production',
//env use for make the statement true, or false . env => NODE_ENV
     sameSite: process.env.NODE_ENV == 'production'? 'none':'strict',
     maxge: 7 * 24 * 60  *60 * 1000
// front end , backend er localhost  same hoba na
    
  }) ;// name & value


  return res.json({success:true});



}catch(error){
res.json({success:false, message:error.message})
}
}

export const login = async(req,res)=>{
  const {email,password} = req.body;

if(!email || !password){
  return res.json({success:false, message:'Email and Password are required'})
}


// if we find user
try {

const user = await userModel.findOne({email});

// if not user

if(!user){
  return res.json({success:false, message:'Invalid email'})
}

// password store in mongo db

const isMatch = await bcrypt.compare(password,user.password);

if(!isMatch){
  return res.json({success:false, message:'Invalid password'})
}

// if password matching , generate onre token bcz email id existing already in db, user already existing , password is correct

// create one token. in this token , user will be authenticate, login website


const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
// store id in this token,

  res.cookie('token',token,{
    httpOnly:true, // only http request can accept this cookies
    secure:process.env.NODE_ENV === 'production',
//env use for make the statement true, or false . env => NODE_ENV
     sameSite: process.env.NODE_ENV == 'production'? 'none':'strict',
     maxge: 7 * 24 * 60  *60 * 1000

     // front end , backend er localhost  same hoba na
    
  }); // name & value

  return res.json({success:true});

} catch(error){
  return res.json({success:false, message:error.message});
}

}



export const logout = async(req,res) =>{
  try{

    // clear the cookie from the respnse. token = cookie name
    res.clearCookie('token',{
      httpOnly:true, // only http request can accept this cookies
      secure:process.env.NODE_ENV === 'production',
  //env use for make the statement true, or false . env => NODE_ENV
       sameSite: process.env.NODE_ENV == 'production'? 'none':'strict',
    })

return res.json({success:true, message:"Logged Out"})
// bez we remove token from ths cookie user will b logout


  }
  catch(error) {
    return res.json({success:false, message:error.message})
  }
}