//we will add function => find token from the cookie => that token it will find the userID


import jwt from 'jsonwebtoken';

const userAuth = async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token) {
        return res.json({success:false,message:'Not Authorized .Login Again'})
   // if token is not available
   
    }

try{
    //decode token that we are getting from this cookies using jwt
   const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);

   if(tokenDecode.id){
    req.body.userId = tokenDecode.id
   }
   else{
    return res.json({success:false, message:'Not Autorized, Login Again'});
   }

next();
// it will call our controller function



} catch(error){
    res.json({success:false, message: error.message
     });
}

}


export default userAuth;