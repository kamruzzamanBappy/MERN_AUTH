import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';
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



///Sending welcome email  ===>
const mailOptions ={
  from: process.env.SENDER_EMAIL,
  to: email,
//we get email frm the request body const {name,email,password} = req.body;
    subject:'Welcome to kb07',

   text:`Welcome to greatstack website.Your account has been created with email id: ${email}`
}
// send the mail

await transporter.sendMail(mailOptions);
//after sending the mail it generate response with success true
  return res.json({success:true});

} catch(error){
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



// send verification OTP to users email

export const sendVerifyOtp = async(req,res) =>{
  try {
// get the user id to verify the user

const {userId} = req.body;
// find user from our db

const user = await userModel.findById(userId);

if(user.isAccounVerified){
  return res.json({success:false, message:'Account Already verified'})
}


// generate ottp we use math random function
const otp = String(Math.floor(100000 + Math.random()* 900000));

// save the otp in the database for particular user
user.verifyOtp = otp;
user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

//save user in database
await user.save();

// update data, send to email

const mailOption = {
  from:process.env.SENDER_EMAIL,
  to:user.email,
  subject:'Account Verification OTP',
  text:`Your OTP is ${otp}. Verify your account using this OTP.`
}

// send email
await transporter.sendMail(mailOption);

//add response
res.json({success:true, message:'Verification OTP send on email'})



  } catch(error){
    res.json({success:false, message:error.message});
  }
}

//  verify email using  ottp verification

export const verifyEmail = async (req,res) =>{
  const {userId,otp} = req.body;

  if(!userId || !otp) {
    return res.json({success:false, message:'Missing details'});

  }
  try {
//find user from user id
const user = await userModel.findById(userId);
//check for the user

if(!user){
  return res.json({success:false,message:'USER NOT FOUND'});
}

if(user.verifyOtp === '' || user.verifyOtp !==otp){
  return res.json({success:false, message:'Invalid OTP'});
}

if(user.verifyOtpExpireAt <Date.now()){
  return res.json({success:false, message:'OTP Expired'});
}

user.isAccounVerified = true;
user.verifyOtp = '';
user.verifyOtpExpireAt = 0;

// save user data
await user.save();
return res.json({success:true, message:'Email verified successfully'})





  } catch(error) {
    return res.json({success:false, message:error.message});
  }

}

// check user login or logout

// chk if user is authenticated

export const isAuthenticated = async(req,res) =>{

  try{
    return res.json({success:true});  
  } catch(error){
    res.json({success:false, message:error.message})
  }

}

//Send Password Reset OTP
export const sendResetOtp = async(req,res)=>{
  const {email} = req.body
  // reset password need email. then user exist or not

  if(!email){
    return res.json({success:false,message:'Email is required'})
  }

try {

  const user = await userModel.findOne({email});

  if(!user){
    return res.json({success:false, message:'User not found!'});
  }


  //user is available in this email  id, generate one otp, otp will save in db,send on email

const otp = String(Math.floor(100000 + Math.random() * 900000));
//generate six digit randon number
user.resetOtp = otp;
user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000
await user.save();

// send email 

const mailOption = {
  from:process.env.SENDER_EMAIL,
  to:user.email,
  subject:'Password rest otp',
  text:`Your OTP for resetting your password is ${otp}. Use this otp to proceed with resetting your password.`
};

await transporter.sendMail(mailOption);

//after sending email we will generate response

return res.json({success:true, message:'OTP send to your email'});

} catch(error) {
  return res.json({success:false, message:error.message})
}
}

//user verify otp and reset password


export const resetPassword = async(req,res) =>{

const {email,otp,newPassword} = req.body;

if(!email || !otp || !newPassword){
  return res.json({success:false, message:'Email,OTP and new password are required'});
}

try {
  const user = await userModel.findOne({email});

  if(!user){
    return res.json({success:false, message:'User not found'})
  }

  if(user.resetOtp == "" || user.resetOtp !==otp){
    return res.json({success:false, message:'Invalid OTP'});
  }

// otp matching otp stored in db

if(user.resetOtpExpireAt < Date.now()){
  return res.json({success:false, message:'OTP Expired'});
}

//OTP is not expired is valid, update user password,sent new password

const hashedPassword = await bcrypt.hash(newPassword, 10);

user.password = hashedPassword;
user.resetOtp = '';
user.resetOtpExpireAt = 0;

await user.save();

return res.json({success:true, message:'Password has been reset successfully'});

 



} catch(error) {
  return res.json({success:false, message:error.message});
}




}









