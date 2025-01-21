1.npm run server 2.

3. To create new user we create controller function . fom controller we get api end point

//// register, login,logout controller function

after generate token we have to send this token to users in the response. response we aadd cookie,
using the cookie we will send this token

4. Create api end point using this controller function . for that create route . server => routes

5. Add auth router in server.js file

6. test api in postman
   POST :http://localhost:4000/api/auth/register
   body =>raw
   {
   "name": "Bappy",
   "email":"kamruzzamanbappy13@gmail.com",
   "password":"1234"
   }
   =>> send.
   {
   "success": true
   }

cookies => we get token

////// \***\* verify account from the db \*\*\***
atlas => cluster => browse collection.

mern-auth=> users
=>
\_id
678f38bcdef607b6a7282a6b
name
"Bappy"
email
"kamruzzamanbappy13@gmail.com"
password
"$2a$10$KeWn1e6ddcuKzjfGMHYdW.nsSfGoZ2qNwIdouy1gHad1PvZ8mtzQq"
verifyOtp
""
verifyOtpExpireAt
0
isAccountVerified
false
resetOtp
""
resetOtpExpireAt
0
\_\_v
====>>>> USER REGISTRATION SUCCESSFULLY WORKING //////

====> TEST USER LOGIN API
POST => http://localhost:4000/api/auth/login
body =>
{

    "email":"kamruzzamanbappy13@gmail.com",
    "password":"1234"

}

out=>
{
"success": true
}

====> TEST USER LOGOUT API
POST => http://localhost:4000/api/auth/login
body =>
{

    "email":"kamruzzamanbappy13@gmail.com",
    "password":"1234"

}

out=>
{
"success": true,
"message": "Logged Out"
}

////// cookies will completly empty ////
